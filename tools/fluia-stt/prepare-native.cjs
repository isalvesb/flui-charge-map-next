const fs = require('node:fs');
const path = require('node:path');

const paused = `      if recorder.isRecording {
        recorder.pauseRecording()
      }`;
const stopped = `      // FLUIA_STT_NO_AUTO_RESUME: stop on interruption or background.
      if recorder.allowsRecording {
        recorder.allowsRecording = false
        recorder.stopRecording()
        recorder.emit(event: "recordingStatusUpdate", arguments: [
          "id": recorder.id,
          "isFinished": true,
          "hasError": true,
          "error": "Recording interrupted",
          "url": nil
        ])
      }`;
const start = `      Function("record") { (recorder: AudioRecorder, options: RecordOptions?) in
        try checkPermissions()
`;
const guarded = `${start}        // FLUIA_STT_RECORD_GUARD: preparation may have been interrupted.
        guard recorder.allowsRecording else {
          throw NSError(domain: "FluiaVoice", code: 1, userInfo: [NSLocalizedDescriptionKey: "Start a new recording after interruption"])
        }
`;

function patchAudioModule(source, version) {
  if (version !== '1.1.1') throw new Error('A correção foi revisada somente para expo-audio 1.1.1.');
  const count = (text) => source.split(text).length - 1;
  if (source.includes('FLUIA_STT_')) {
    if (count(stopped) !== 2 || count(guarded) !== 1 || count(paused) !== 0) throw new Error('Correção nativa incompleta ou alterada.');
    return source;
  }
  if (count(paused) !== 2 || count(start) !== 1) throw new Error('Fonte nativa diferente da versão revisada.');
  return source.split(paused).join(stopped).replace(start, guarded);
}

function prepareNative() {
  const root = path.resolve(__dirname, '../..');
  const folder = path.join(root, 'node_modules/expo-audio');
  if (fs.realpathSync(folder) !== folder) throw new Error('O módulo de áudio deve pertencer a esta worktree.');
  const version = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8')).version;
  const file = path.join(folder, 'ios/AudioModule.swift');
  const source = fs.readFileSync(file, 'utf8');
  const result = patchAudioModule(source, version);
  if (result !== source) fs.writeFileSync(file, result);
  return { changed: result !== source, version, interruptionAndBackgroundGuarded: true };
}

module.exports = { patchAudioModule, prepareNative };
if (require.main === module) console.info(JSON.stringify(prepareNative()));
