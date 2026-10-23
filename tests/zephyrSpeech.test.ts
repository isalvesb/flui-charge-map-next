import assert from "node:assert/strict";
import test from "node:test";
import { createZephyrSpeechEngine, synthesizeZephyr, ZEPHYR_VOICE, type PreparedSpeech } from "../src/features/assistant/voice/zephyrSpeech";
import { createSpeechPlayback, type SpeechOptions } from "../src/features/assistant/speechPlayback";

const connection = { endpoint: "https://192.168.0.130:8787", code: "a".repeat(64) };
const audio = Buffer.from("ID3-test").toString("base64");
const options = (events: string[]): SpeechOptions => ({ language: "pt-BR", onStart: () => events.push("start"), onDone: () => events.push("done"), onStopped: () => events.push("stopped"), onError: () => events.push("error") });
function fixture() {
  const events: string[] = [];
  let callbacks: SpeechOptions;
  const dependencies = {
    connection: () => connection as typeof connection | null,
    synthesize: async () => audio as string | null,
    prepare: async (_audio: string, _signal: AbortSignal, value: SpeechOptions): Promise<PreparedSpeech> => {
      callbacks = value; events.push("prepare"); return { start: () => { events.push("play"); value.onStart(); }, stop: async () => { events.push("release"); } };
    },
  };
  const engine = createZephyrSpeechEngine({ stop: async () => { events.push("device-stop"); }, speak: () => { events.push("device-speak"); } }, dependencies);
  return { engine, dependencies, events, callbacks: () => callbacks, options: options(events) };
}

test("Zephyr lê uma vez, informa início real e espera liberação antes da próxima captura", async () => {
  const f = fixture();
  await f.engine.speak("Resposta calculada", f.options);
  assert.deepEqual(f.events, ["prepare", "play", "start"]);
  f.callbacks().onDone(); assert.equal(f.events.at(-1), "done");
  await f.engine.stop();
  assert.ok(f.events.includes("release"));
  f.callbacks().onStart(); assert.equal(f.events.at(-1), "release");
});

test("voz do iPhone permanece sem sessão ou backend sem Zephyr", async () => {
  const f = fixture(); f.dependencies.connection = () => null;
  await f.engine.speak("Local", f.options);
  f.dependencies.connection = () => connection;
  f.dependencies.synthesize = async () => null;
  await f.engine.speak("Backend antigo", f.options);
  assert.deepEqual(f.events, ["device-speak", "device-speak"]);
});

test("cancelar durante síntese ignora áudio tardio sem reprodução ou fallback", async () => {
  const f = fixture(); let finish!: (audio: string) => void;
  f.dependencies.synthesize = () => new Promise(resolve => { finish = resolve; });
  const speaking = f.engine.speak("Não tocar", f.options);
  await f.engine.stop(); finish(audio); await speaking;
  assert.deepEqual(f.events, ["device-stop"]);
});

test("cancelar durante preparação espera e libera player antes de devolver controle", async () => {
  const f = fixture(); let finish!: () => void;
  f.dependencies.prepare = async () => {
    await new Promise<void>(resolve => { finish = resolve; });
    return { start: () => { f.events.push("late-play"); }, stop: async () => { f.events.push("release"); } };
  };
  const speaking = f.engine.speak("Não tocar", f.options); await Promise.resolve();
  let stopped = false;
  const stop = f.engine.stop().then(() => { stopped = true; });
  await Promise.resolve(); assert.equal(stopped, false);
  finish(); await speaking; await stop;
  assert.ok(f.events.includes("release")); assert.equal(f.events.includes("late-play"), false);
});

test("falha de síntese preserva mensagem, sem repetição Google nem outra voz", async () => {
  const f = fixture(); let calls = 0;
  f.dependencies.synthesize = async () => { calls++; throw new Error(); };
  await f.engine.speak("Texto continua visível", f.options);
  assert.equal(calls, 1); assert.deepEqual(f.events, ["error"]);
});

test("transporte consulta capacidade, usa token só no cabeçalho e não muda o texto", async () => {
  const requests: { url: string; options: RequestInit }[] = [];
  const request = (async (url: string, options: RequestInit) => {
    requests.push({ url, options });
    return new Response(JSON.stringify(requests.length === 1 ? { synthesis: { voice: ZEPHYR_VOICE } } : { audioContent: audio, encoding: "MP3", voice: ZEPHYR_VOICE }));
  }) as typeof fetch;
  assert.equal(await synthesizeZephyr("Olá, motorista.", connection, new AbortController().signal, request), audio);
  assert.deepEqual(requests.map(item => item.url), [connection.endpoint + "/health", connection.endpoint + "/synthesize"]);
  assert.equal(JSON.parse(requests[1].options.body as string).text, "Olá, motorista.");
  assert.equal((requests[1].options.headers as Record<string, string>).Authorization, `Bearer ${connection.code}`);
});

test("backend antigo não recebe texto nem reserva síntese", async () => {
  let calls = 0;
  const request = (async () => { calls++; return new Response(JSON.stringify({ streaming: true })); }) as typeof fetch;
  assert.equal(await synthesizeZephyr("Resposta", connection, new AbortController().signal, request), null);
  assert.equal(calls, 1);
});

test("transporte rejeita host público, falhas Google e respostas incorretas sem retry", async () => {
  await assert.rejects(synthesizeZephyr("Resposta", { ...connection, endpoint: "https://example.com" }, new AbortController().signal));
  for (const body of [{ audioContent: audio, encoding: "WAV", voice: ZEPHYR_VOICE }, { audioContent: "invalid", encoding: "MP3", voice: ZEPHYR_VOICE }, { code: "TTS_LIMIT" }]) {
    let calls = 0;
    const request = (async () => new Response(JSON.stringify(++calls === 1 ? { synthesis: { voice: ZEPHYR_VOICE } } : body), { status: calls === 2 && "code" in body ? 429 : 200 })) as typeof fetch;
    await assert.rejects(synthesizeZephyr("Resposta", connection, new AbortController().signal, request));
    assert.equal(calls, 2);
  }
});

test("speechPlayback captura rejeição assíncrona do motor sem promessa perdida", async () => {
  const events: string[] = [];
  const playback = createSpeechPlayback({ stop: async () => {}, speak: async () => { throw new Error(); } }, state => events.push(state));
  await playback.speak("Texto preservado"); assert.deepEqual(events, ["idle", "error"]);
});
