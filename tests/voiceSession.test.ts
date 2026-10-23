import assert from "node:assert/strict";
import test from "node:test";
import { appendTranscript, VoiceError, VoiceSession, type Recording, type VoiceSnapshot } from "../src/features/assistant/voice/voiceSession";
import { AbortController as NativeAbortController } from "abort-controller";
import { transcribeAudio, validateSttEndpoint } from "../src/features/assistant/voice/transcribe";
import { answerMessage } from "../src/features/assistant/chatEngine";
import { createStation } from "./fixtures";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}
function setup(overrides: Partial<ConstructorParameters<typeof VoiceSession>[0]> = {}) {
  const states: VoiceSnapshot[] = [], received: string[] = [];
  let disposed = 0, sent = 0;
  const recording: Recording = { finish: async () => "fake-wav", dispose: async () => { disposed++; } };
  const session = new VoiceSession({ begin: async () => recording, transcribe: async () => { sent++; return "Quero carregar rápido"; }, changed: (state) => states.push(state), received: (text) => received.push(text), ...overrides });
  return { session, states, received, recording, counts: () => ({ disposed, sent }) };
}

test("transcrição preenche rascunho revisável e só o envio explícito usa o motor existente", async () => {
  const context = { stations: [createStation({ id: "near", distanceKm: 1, powerKw: 150 })], vehicleRangeKm: 300, batteryPercent: 80, now: new Date("2026-10-23T15:00:00Z") };
  let draft = "", sends = 0;
  const fixture = setup({ received: (text) => { draft = appendTranscript(draft, text); } });
  await fixture.session.start();
  assert.equal(draft, "");
  await fixture.session.finish();
  assert.equal(sends, 0);
  assert.equal(draft, "Quero carregar rápido");
  assert.deepEqual(fixture.states.map((s) => s.phase), ["requesting", "recording", "processing", "success"]);
  // The UI's unchanged sendMessage calls this same engine after user review.
  draft = "Tenho pouca bateria";
  sends++;
  assert.equal(answerMessage(draft, context).recommendation?.intent, "lowBattery");
  assert.equal(sends, 1);
  assert.deepEqual(fixture.counts(), { disposed: 1, sent: 1 });
});

test("preserva texto digitado antes e durante uma transcrição", () => {
  assert.equal(appendTranscript("Anotei: ", "Preciso de café"), "Anotei: Preciso de café");
  assert.equal(appendTranscript("  ", " Olá "), "Olá");
});

test("cancelar gravando descarta áudio sem chamada de rede; pode gravar novamente", async () => {
  const f = setup();
  await f.session.start();
  await f.session.cancel();
  assert.deepEqual(f.counts(), { disposed: 1, sent: 0 });
  assert.deepEqual(f.received, []);
  await f.session.start();
  await f.session.finish();
  assert.equal(f.received.length, 1);
});

test("cancelar durante permissão aguarda preparação e impede duas capturas", async () => {
  const gate = deferred<Recording>();
  let begun = 0;
  const f = setup({ begin: async () => { begun++; return gate.promise; } });
  const start = f.session.start();
  const cancel = f.session.cancel();
  await f.session.start();
  assert.equal(begun, 1);
  gate.resolve(f.recording);
  await Promise.all([start, cancel]);
  assert.equal(f.counts().disposed, 1);
  assert.equal(f.states.at(-1)?.phase, "idle");
  assert.equal(f.states.some((state) => state.phase === "recording"), false);
});

test("resposta atrasada após cancelamento não preenche o texto", async () => {
  const response = deferred<string>();
  const f = setup({ transcribe: () => response.promise });
  await f.session.start();
  const finish = f.session.finish();
  await Promise.resolve();
  await f.session.cancel();
  response.resolve("Texto que chegou tarde");
  await finish;
  assert.deepEqual(f.received, []);
  assert.equal(f.states.at(-1)?.phase, "idle");
});

test("duplo toque em parar não duplica transcrição", async () => {
  const f = setup();
  await f.session.start();
  await Promise.all([f.session.finish(), f.session.finish()]);
  assert.equal(f.counts().sent, 1);
});

test("permissão negada, silêncio e rede falha exibem erro e permitem retomar", async () => {
  for (const failAt of ["permission", "empty", "network"]) {
    let failed = false;
    const f = setup({
      begin: async () => { if (failAt === "permission" && !failed) { failed = true; throw new VoiceError("Microfone não autorizado"); } return f.recording; },
      transcribe: async () => { if (!failed) { failed = true; if (failAt === "empty") return " "; throw new Error("offline"); } return "Olá"; },
    });
    await f.session.start();
    await f.session.finish();
    assert.equal(f.states.at(-1)?.phase, "error");
    assert.deepEqual(f.received, []);
    await f.session.start();
    await f.session.finish();
    assert.equal(f.states.at(-1)?.phase, "success");
  }
});

test("erro ao excluir arquivo não provoca rejeição sem tratamento nem sucesso falso", async () => {
  const f = setup({ begin: async () => ({ finish: async () => "wav", dispose: async () => { throw new Error("disk"); } }) });
  await f.session.start();
  await f.session.finish();
  assert.equal(f.states.at(-1)?.phase, "error");
  assert.deepEqual(f.received, []);
  await f.session.start();
  assert.equal(f.states.at(-1)?.phase, "error");
  assert.equal(f.states.filter(s => s.phase === "recording").length, 1);
});

test("cancelar durante leitura nativa aguarda limpeza antes de permitir nova captura", async () => {
  const gate = deferred<string>();
  let begun = 0;
  const f = setup({ begin: async () => { begun++; return { finish: () => gate.promise, dispose: async () => {} }; } });
  await f.session.start();
  const finishing = f.session.finish();
  const canceling = f.session.cancel();
  await f.session.start();
  assert.equal(begun, 1);
  gate.resolve("wav");
  await Promise.all([finishing, canceling]);
  assert.equal(f.counts().sent, 0);
  await f.session.start();
  assert.equal(begun, 2);
  await f.session.cancel();
});

test("resposta da captura anterior não altera sessão nova nem apaga seu áudio", async () => {
  const response = deferred<string>();
  let transcriptions = 0, cleaned = 0;
  const f = setup({
    begin: async () => ({ finish: async () => "wav", dispose: async () => { cleaned++; } }),
    transcribe: async () => ++transcriptions === 1 ? response.promise : "Nova transcrição",
  });
  await f.session.start();
  const old = f.session.finish();
  while (transcriptions === 0) await Promise.resolve();
  await f.session.cancel();
  await f.session.start();
  response.resolve("Antiga");
  await old;
  assert.equal(f.states.at(-1)?.phase, "recording");
  assert.equal(cleaned, 1);
  await f.session.finish();
  assert.deepEqual(f.received, ["Nova transcrição"]);
  assert.equal(cleaned, 2);
});

test("término nativo de 30 s e toque em Parar resultam numa única transcrição", async () => {
  let completed!: () => void;
  const f = setup({ begin: async (_signal, _interrupted, limit) => { completed = limit; return f.recording; } });
  await f.session.start();
  completed();
  await f.session.finish();
  assert.equal(f.counts().sent, 1);
  assert.equal(f.counts().disposed, 1);
});

test("cliente aceita o AbortController real do RN 0.81, sem throwIfAborted", async () => {
  const controller = new NativeAbortController();
  const signal = controller.signal as unknown as AbortSignal;
  assert.equal(typeof (signal as {throwIfAborted?: unknown}).throwIfAborted, "undefined");
  const request: typeof fetch = async () => new Response(JSON.stringify({ text: "Quero café" }));
  assert.equal(await transcribeAudio("https://mac", "a".repeat(64), "wav", signal, request), "Quero café");
  controller.abort();
  await assert.rejects(transcribeAudio("https://mac", "a".repeat(64), "wav", signal, request), { name: "AbortError" });
});

test("cliente exige HTTPS e rejeita credenciais em URL e código inválido antes de enviar", async () => {
  for (const url of ["http://mac:8787", "https://user:secret@mac", "https://mac?token=x", "https://mac#token", "https://mac/transcribe", "https://public.example.com", "https://8.8.8.8", "https://172.32.0.1"]) assert.throws(() => validateSttEndpoint(url), VoiceError);
  assert.equal(validateSttEndpoint("https://mac:8787/"), "https://mac:8787");
  assert.equal(validateSttEndpoint("https://192.168.0.130:8787"), "https://192.168.0.130:8787");
  assert.equal(validateSttEndpoint("https://flui-mac.local:8787"), "https://flui-mac.local:8787");
  await assert.rejects(transcribeAudio("https://mac", "", "audio", new AbortController().signal), /código de sessão/);
});

test("cliente transmite com sessão, respeita cancelamento e traduz erros sem expor resposta", async () => {
  let calls = 0;
  const request: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(url, "https://mac:8787/transcribe");
    assert.equal((init?.headers as Record<string, string>).Authorization, `Bearer ${"a".repeat(64)}`);
    assert.equal(JSON.parse(init!.body as string).content, "wav");
    return new Response(JSON.stringify({ text: " Bom dia " }), { status: 200 });
  };
  assert.equal(await transcribeAudio("https://mac:8787", "a".repeat(64), "wav", new AbortController().signal, request), "Bom dia");
  const controller = new AbortController(); controller.abort();
  await assert.rejects(transcribeAudio("https://mac:8787", "a".repeat(64), "wav", controller.signal, request));
  assert.equal(calls, 1);
  for (const [status, code, message] of [[401, "UNAUTHORIZED", /Código de sessão/], [422, "NO_SPEECH", /Não reconheci/], [429, "SESSION_LIMIT", /limite/], [502, "CLOUD_AUTH", /Google Cloud/]] as const) {
    await assert.rejects(transcribeAudio("https://mac", "a".repeat(64), "wav", new AbortController().signal, async () => new Response(JSON.stringify({ code, secret: "not for UI" }), { status })), message);
  }
});
