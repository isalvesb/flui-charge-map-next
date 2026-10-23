import test from 'node:test';
import assert from 'node:assert/strict';
import { createPcmSilenceDetector } from './pcm-silence.mjs';

const silence = Buffer.alloc(3200);
const voice = Buffer.alloc(3200);
for (let i = 0; i < voice.length; i += 2) {
  voice.writeInt16LE(2000, i);
}

test('não conclui antes de detectar fala', () => {
  const detector = createPcmSilenceDetector();
  for (let i = 0; i < 20; i++) {
    assert.equal(detector.observe(silence, false), false);
  }
});

test('conclui após um segundo de silêncio PCM', () => {
  const detector = createPcmSilenceDetector();
  detector.observe(voice, true);
  for (let i = 0; i < 9; i++) {
    assert.equal(detector.observe(silence, true), false);
  }
  assert.equal(detector.observe(silence, true), true);
});

test('fala retomada reinicia a contagem', () => {
  const detector = createPcmSilenceDetector();
  detector.observe(voice, true);
  for (let i = 0; i < 5; i++) {
    detector.observe(silence, true);
  }
  assert.equal(detector.observe(voice, true), false);
  for (let i = 0; i < 9; i++) {
    assert.equal(detector.observe(silence, true), false);
  }
  assert.equal(detector.observe(silence, true), true);
});
