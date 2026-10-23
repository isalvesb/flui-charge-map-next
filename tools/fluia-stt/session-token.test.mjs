import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable, PassThrough } from 'node:stream';
import { sessionToken } from './session-token.mjs';

test('início normal cria código novo e reinício explícito preserva código só pelo pipe', async () => {
  const first = await sessionToken();
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.notEqual(first, await sessionToken());
  const existing = 'b'.repeat(64);
  assert.equal(await sessionToken({ resume: true, hasLedger: true, input: Readable.from([existing.slice(0, 32), existing.slice(32)]) }), existing);
});

test('retomada recusa ausência de ledger e entradas inválidas sem expor o conteúdo', async () => {
  await assert.rejects(sessionToken({ resume: true, input: Readable.from(['b'.repeat(64)]) }), /sessão temporária/);
  for (const content of ['', 'invalid-private-input', 'b'.repeat(66)]) {
    await assert.rejects(sessionToken({ resume: true, hasLedger: true, input: Readable.from([content]) }), error => {
      assert.equal(error.message, 'Não foi possível retomar a sessão temporária.'); return true;
    });
  }
});

test('pipe sem EOF expira em vez de bloquear o início do intermediário', async () => {
  const input = new PassThrough();
  await assert.rejects(sessionToken({ resume: true, hasLedger: true, input, timeoutMs: 10 }), /sessão temporária/);
  assert.equal(input.destroyed, true);
});
