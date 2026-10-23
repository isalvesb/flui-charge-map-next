import assert from "node:assert/strict";
import test from "node:test";
import { LiveVoiceSession, type LiveSnapshot, type LiveVoicePorts, type LiveWire } from "../src/features/assistant/voice/liveVoiceSession";
import { createVoiceConnectionStore } from "../src/features/assistant/voice/connectionStore";
import { VoiceCleanupError } from "../src/features/assistant/voice/voiceSession";
import { answerMessage } from "../src/features/assistant/chatEngine";
import { createStation } from "./fixtures";

const tick = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
function fixture(overrides: Partial<LiveVoicePorts> = {}) {
  const states: LiveSnapshot[] = [], answers: string[] = [];
  let partial!: (text: string) => void, final!: (text: string) => void, end!: (reason: string) => void;
  let stops = 0, finishes = 0, captures = 0, canceled = 0;
  const wire: LiveWire = { write: () => {}, finish: () => { finishes++; }, cancel: () => { canceled++; } };
  const ports: LiveVoicePorts = {
    prepare: async () => async (_frame, ended) => { captures++; end = ended; return { stop: async () => { stops++; ended("manual"); }, dispose: async () => { stops++; } }; },
    connect: async (_signal, onPartial, onFinal) => { partial = onPartial; final = onFinal; return wire; },
    changed: state => states.push(state), received: text => answers.push(text), ...overrides,
  };
  return { session: new LiveVoiceSession(ports), states, answers, wire, partial: (text: string) => partial(text), final: (text: string) => final(text), end: (reason: string) => end(reason), counts: () => ({ stops, finishes, captures, canceled }) };
}

test("parciais aparecem separadas; só o resultado final gera uma resposta automática", async () => {
  let draft = "Meu texto digitado", engineCalls = 0;
  const f = fixture({ received: text => {
    engineCalls++;
    const result = answerMessage(text, { stations: [createStation({ id: "near", distanceKm: 1, powerKw: 150 })], batteryPercent: 80, vehicleRangeKm: 300, now: new Date("2026-10-23T18:00:00Z") });
    assert.equal(result.recommendation?.intent, "fastCharge");
  } });
  await f.session.start();
  f.partial("Quero"); f.partial("Quero carregar rápido");
  assert.equal(f.states.at(-1)?.text, "Quero carregar rápido");
  assert.equal(engineCalls, 0);
  await Promise.all([f.session.finish(), f.session.finish()]);
  assert.equal(f.counts().finishes, 1);
  f.final("Quero carregar rápido"); f.final("Duplicada");
  await tick();
  assert.equal(engineCalls, 1);
  assert.equal(draft, "Meu texto digitado");
  assert.equal(f.states.at(-1)?.phase, "success");
});

test("fim por silêncio do Google encerra o microfone antes de entregar a pergunta", async () => {
  const f = fixture(); await f.session.start();
  f.final("Olá"); await tick();
  assert.ok(f.counts().stops > 0);
  assert.deepEqual(f.answers, ["Olá"]);
});

test("cancelamento ignora parciais/final atrasados e permite nova escuta", async () => {
  const f = fixture(); await f.session.start();
  f.partial("Rascunho de voz"); await f.session.cancel();
  f.final("Não deve responder"); f.partial("Antiga"); await tick();
  assert.deepEqual(f.answers, []);
  assert.equal(f.states.at(-1)?.phase, "idle");
  await f.session.start(); f.final("Nova pergunta"); await tick();
  assert.deepEqual(f.answers, ["Nova pergunta"]);
});

test("sair enquanto a conexão abre nunca inicia microfone atrasado", async () => {
  let resolve!: (wire: LiveWire) => void, captures = 0;
  const gate = new Promise<LiveWire>(done => { resolve = done; });
  const f = fixture({ prepare: async () => async () => { captures++; throw new Error(); }, connect: () => gate });
  const starting = f.session.start(); await tick();
  const canceling = f.session.cancel();
  resolve(f.wire); await Promise.all([starting, canceling]);
  assert.equal(captures, 0); assert.deepEqual(f.answers, []);
});

test("interrupção e falha de limpeza não respondem nem retomam escuta sozinhas", async () => {
  const f = fixture(); await f.session.start();
  f.end("background"); await tick();
  assert.deepEqual(f.answers, []); assert.equal(f.counts().captures, 1);
  const blocked = fixture({ prepare: async () => async () => ({ stop: async () => {}, dispose: async () => { throw new VoiceCleanupError("cleanup"); } }) });
  await blocked.session.start(); blocked.final("Não usar"); await tick();
  await blocked.session.start();
  assert.deepEqual(blocked.answers, []); assert.equal(blocked.states.at(-1)?.phase, "error");
});

test("configuração mantém segredo fora do snapshot e apaga só a conexão na memória", () => {
  const store = createVoiceConnectionStore("https://mac:8787");
  assert.throws(() => store.read());
  store.configure("https://mac:8787", "a".repeat(64));
  assert.equal(store.getSnapshot().ready, true);
  assert.equal(JSON.stringify(store.getSnapshot()).includes("a".repeat(64)), false);
  const copy = store.read(); copy.code = "changed";
  assert.equal(store.read().code, "a".repeat(64));
  store.clear(); assert.throws(() => store.read());
  assert.deepEqual(store.getSnapshot(), { ready: false, endpoint: "https://mac:8787" });
  assert.throws(() => store.configure("http://public.example", "a".repeat(64)));
});
