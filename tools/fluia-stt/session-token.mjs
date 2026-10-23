import { randomBytes } from 'node:crypto';

// Controlled Mac restart only: pass the existing capability through an anonymous
// stdin pipe, never through command arguments, URLs, public env or another file.
export async function sessionToken({ resume = false, hasLedger = false, input = process.stdin, timeoutMs = 2000 } = {}) {
  if (!resume) return randomBytes(32).toString('hex');
  const invalid = () => new Error('Não foi possível retomar a sessão temporária.');
  if (!hasLedger || input.isTTY) throw invalid();
  let timer;
  try {
    const read = (async () => {
      let text = '';
      for await (const chunk of input) {
        text += chunk.toString();
        if (Buffer.byteLength(text) > 65) throw invalid();
      }
      const token = text.trim();
      if (!/^[a-f0-9]{64}$/.test(token)) throw invalid();
      return token;
    })();
    return await Promise.race([read, new Promise((_resolve, reject) => {
      timer = setTimeout(() => { input.destroy?.(); reject(invalid()); }, timeoutMs);
    })]);
  } finally { clearTimeout(timer); }
}
