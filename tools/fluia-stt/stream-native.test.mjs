import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const { patchStream } = createRequire(import.meta.url)('./prepare-stream-native.cjs');

test('extensão PCM é idempotente na fonte instalada e recusa versão ou patch parcial', () => {
  const source = readFileSync(new URL('../../node_modules/expo-audio/ios/AudioModule.swift', import.meta.url), 'utf8');
  const patched = patchStream(source, '1.1.1');
  assert.equal(patchStream(patched, '1.1.1'), patched);
  assert.throws(() => patchStream(source, '1.1.2'));
  assert.throws(() => patchStream('FLUIA_PCM_STREAM_METHODS partial', '1.1.1'));
  assert.throws(() => patchStream('unknown module', '1.1.1'));
});
