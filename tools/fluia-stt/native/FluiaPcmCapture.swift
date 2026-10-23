import AVFoundation
import Foundation
import UIKit

// Experimental, foreground-only PCM capture. No audio is written to disk.
final class FluiaPcmCapture {
  let id: String
  private let engine = AVAudioEngine()
  private let lock = NSLock()
  private let chunk: ([String: Any]) -> Void
  private let ended: ([String: Any]) -> Void
  private var converter: AVAudioConverter?
  private var active = false
  private var started = false
  private var tapped = false
  private var pending = Data()
  private var sequence = 0
  private var bytes = 0
  private var queued = 0
  private var observers: [NSObjectProtocol] = []
  private var deadline: DispatchWorkItem?
  private var previous: (AVAudioSession.Category, AVAudioSession.Mode, AVAudioSession.CategoryOptions)?

  init(id: String, chunk: @escaping ([String: Any]) -> Void, ended: @escaping ([String: Any]) -> Void) {
    self.id = id
    self.chunk = chunk
    self.ended = ended
  }

  func start() throws {
    let session = AVAudioSession.sharedInstance()
    previous = (session.category, session.mode, session.categoryOptions)
    do {
      var options: AVAudioSession.CategoryOptions = [.defaultToSpeaker]
      #if compiler(>=6.2)
      options.insert(.allowBluetoothHFP)
      #else
      options.insert(.allowBluetooth)
      #endif
      try session.setCategory(.playAndRecord, mode: .measurement, options: options)
      try session.setActive(true)
      let input = engine.inputNode
      let source = input.outputFormat(forBus: 0)
      guard source.sampleRate > 0, source.channelCount > 0,
            let target = AVAudioFormat(commonFormat: .pcmFormatInt16, sampleRate: 16000, channels: 1, interleaved: true),
            let converter = AVAudioConverter(from: source, to: target) else {
        throw failure()
      }
      self.converter = converter
      lock.lock(); active = true; started = true; lock.unlock()
      input.installTap(onBus: 0, bufferSize: 1024, format: source) { [weak self] buffer, _ in
        self?.convert(buffer, target: target)
      }
      tapped = true
      engine.prepare()
      try engine.start()
      let center = NotificationCenter.default
      observers.append(center.addObserver(forName: AVAudioSession.interruptionNotification, object: nil, queue: .main) { [weak self] note in
        let value = note.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt
        if value == AVAudioSession.InterruptionType.began.rawValue { self?.stop(reason: "interruption") }
      })
      observers.append(center.addObserver(forName: UIApplication.willResignActiveNotification, object: nil, queue: .main) { [weak self] _ in self?.stop(reason: "background") })
      observers.append(center.addObserver(forName: AVAudioSession.mediaServicesWereResetNotification, object: nil, queue: .main) { [weak self] _ in self?.stop(reason: "interruption") })
      observers.append(center.addObserver(forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main) { [weak self] note in
        let value = note.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt
        if value == AVAudioSession.RouteChangeReason.oldDeviceUnavailable.rawValue || value == AVAudioSession.RouteChangeReason.newDeviceAvailable.rawValue { self?.stop(reason: "interruption") }
      })
      let deadline = DispatchWorkItem { [weak self] in self?.stop(reason: "limit") }
      self.deadline = deadline
      DispatchQueue.main.asyncAfter(deadline: .now() + 30, execute: deadline)
    } catch {
      stop(reason: "error")
      throw failure()
    }
  }

  private func failure() -> NSError {
    NSError(domain: "FluiaPcmCapture", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not start foreground PCM capture"])
  }

  private func convert(_ input: AVAudioPCMBuffer, target: AVAudioFormat) {
    lock.lock(); let running = active; lock.unlock()
    guard running, let converter else { return }
    let capacity = AVAudioFrameCount(ceil(Double(input.frameLength) * 16000 / input.format.sampleRate) + 32)
    guard let output = AVAudioPCMBuffer(pcmFormat: target, frameCapacity: capacity) else { return }
    var supplied = false
    var error: NSError?
    let status = converter.convert(to: output, error: &error) { _, state in
      if supplied { state.pointee = .noDataNow; return nil }
      supplied = true
      state.pointee = .haveData
      return input
    }
    if error != nil || status == .error {
      DispatchQueue.main.async { [weak self] in self?.stop(reason: "error") }
      return
    }
    guard output.frameLength > 0, let pointer = output.audioBufferList.pointee.mBuffers.mData else { return }
    let data = Data(bytes: pointer, count: Int(output.frameLength) * 2)
    lock.lock()
    guard active else { lock.unlock(); return }
    let remaining = max(0, 960000 - bytes)
    let accepted = data.prefix(remaining)
    pending.append(accepted)
    bytes += accepted.count
    while pending.count >= 3200 {
      let content = Data(pending.prefix(3200))
      pending.removeFirst(3200)
      enqueue(content)
    }
    let reachedLimit = bytes >= 960000
    let overloaded = queued > 12
    if reachedLimit || overloaded { active = false }
    lock.unlock()
    if reachedLimit || overloaded {
      DispatchQueue.main.async { [weak self] in self?.stop(reason: overloaded ? "error" : "limit") }
    }
  }

  // Caller holds lock. At most a small bounded number of main-thread events.
  private func enqueue(_ data: Data) {
    let sequence = self.sequence
    self.sequence += 1
    queued += 1
    DispatchQueue.main.async { [weak self] in
      guard let self else { return }
      self.chunk(["id": self.id, "sequence": sequence, "content": data.base64EncodedString()])
      self.lock.lock(); self.queued -= 1; self.lock.unlock()
    }
  }

  // Invoked on the main queue. No automatic resume after interruption.
  func stop(reason: String) {
    lock.lock(); let wasStarted = started; started = false; active = false; lock.unlock()
    deadline?.cancel(); deadline = nil
    observers.forEach { NotificationCenter.default.removeObserver($0) }; observers.removeAll()
    if tapped { engine.inputNode.removeTap(onBus: 0); tapped = false }
    engine.stop()
    lock.lock()
    if !pending.isEmpty { enqueue(pending); pending = Data() }
    let samples = bytes / 2
    lock.unlock()
    var endingReason = reason
    if let previous {
      do {
        try AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
        try AVAudioSession.sharedInstance().setCategory(previous.0, mode: previous.1, options: previous.2)
      } catch { endingReason = "cleanup" }
      self.previous = nil
    }
    if wasStarted {
      let finalReason = endingReason
      // Scheduled after every PCM event, including the final short chunk.
      DispatchQueue.main.async { [weak self] in
        guard let self else { return }
        self.ended(["id": self.id, "reason": finalReason, "samples": samples])
      }
    }
  }
}
