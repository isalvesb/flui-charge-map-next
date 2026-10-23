const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const methods = `
    // FLUIA_PCM_STREAM_METHODS: private, foreground-only capture.
    Events("fluiaPcmChunk", "fluiaPcmStopped")
    AsyncFunction("fluiaStartPcm") { (id: String) in
      try self.checkPermissions()
      guard self.fluiaCapture == nil else { throw AudioRecordingException("Capture already active") }
      let capture = FluiaPcmCapture(id: id, chunk: { [weak self] event in
        self?.sendEvent("fluiaPcmChunk", event)
      }, ended: { [weak self] event in
        self?.sendEvent("fluiaPcmStopped", event)
        if self?.fluiaCapture?.id == id { self?.fluiaCapture = nil }
      })
      self.fluiaCapture = capture
      do { try capture.start() }
      catch { self.fluiaCapture = nil; throw error }
    }.runOnQueue(.main)
    AsyncFunction("fluiaStopPcm") { (id: String) in
      if self.fluiaCapture?.id == id { self.fluiaCapture?.stop(reason: "manual") }
    }.runOnQueue(.main)
`;
function patchStream(source, version) {
  if (version !== '1.1.1') throw new Error('PCM revisado somente para expo-audio 1.1.1.');
  if (source.includes('FLUIA_PCM_STREAM_METHODS')) {
    if (!source.includes(methods) || !source.includes('private var fluiaCapture: FluiaPcmCapture?')) throw new Error('Patch PCM incompleto.');
    return source;
  }
  for (const anchor of ['    Name("ExpoAudio")', '  private var allowsBackgroundRecording = false', '    OnDestroy {', '    OnAppEntersBackground {']) if (source.split(anchor).length !== 2) throw new Error('Fonte nativa divergente para PCM.');
  return source.replace('    Name("ExpoAudio")', '    Name("ExpoAudio")\n' + methods)
    .replace('  private var allowsBackgroundRecording = false', '  private var allowsBackgroundRecording = false\n  private var fluiaCapture: FluiaPcmCapture?')
    .replace('    OnDestroy {', '    OnDestroy {\n      self.fluiaCapture?.stop(reason: "background")\n      self.fluiaCapture = nil')
    .replace('    OnAppEntersBackground {', '    OnAppEntersBackground {\n      self.fluiaCapture?.stop(reason: "background")');
}
function prepareStreamNative() {
  const folder = path.join(root, 'node_modules/expo-audio');
  if (fs.realpathSync(folder) !== folder) throw new Error('Módulo PCM deve pertencer a esta worktree.');
  const version = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8')).version;
  const file = path.join(folder, 'ios/AudioModule.swift');
  const source = fs.readFileSync(file, 'utf8');
  const patched = patchStream(source, version);
  if (source !== patched) fs.writeFileSync(file, patched);
  fs.copyFileSync(path.join(__dirname, 'native/FluiaPcmCapture.swift'), path.join(folder, 'ios/FluiaPcmCapture.swift'));
  return { pcmPrepared: true, version };
}
module.exports = { patchStream, prepareStreamNative };
if (require.main === module) console.info(JSON.stringify(prepareStreamNative()));
