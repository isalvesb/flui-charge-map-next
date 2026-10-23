import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { patchAudioModule } = createRequire(import.meta.url)('./prepare-native.cjs');
// Read the installed, pinned SDK module; test both pristine and patched sources.
const installed = fs.readFileSync(new URL('../../node_modules/expo-audio/ios/AudioModule.swift', import.meta.url), 'utf8');

test('correção preserva compatibilidade e rejeita versões/fontes não revisadas', () => {
  assert.throws(() => patchAudioModule(installed, '1.1.2'));
  assert.throws(() => patchAudioModule('different source', '1.1.1'));
  assert.throws(() => patchAudioModule('FLUIA_STT_NO_AUTO_RESUME incomplete', '1.1.1'));
});
test('interrupção e segundo plano desarmam gravação; novas chamadas exigem permissão de sessão', () => {
  const result = patchAudioModule(installed, '1.1.1');
  assert.equal(result.split('// FLUIA_STT_NO_AUTO_RESUME').length - 1, 2);
  assert.equal(result.split('// FLUIA_STT_RECORD_GUARD').length - 1, 1);
  assert.equal(patchAudioModule(result, '1.1.1'), result);
  for (const method of ['handleInterruptionBegan', 'pauseAllRecorders']) {
    const body = result.slice(result.indexOf(`private func ${method}(`)).split('\n  private func ')[0];
    assert.ok(body.indexOf('recorder.allowsRecording = false') < body.indexOf('recorder.stopRecording()'));
    assert.match(body, /hasError.*true/);
    assert.doesNotMatch(body, /recorder.pauseRecording/);
  }
});
