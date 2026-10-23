import assert from "node:assert/strict";
import test from "node:test";
import { beginIosRecording } from "../src/features/assistant/voice/iosRecorder";

type Load = NonNullable<Parameters<typeof beginIosRecording>[2]>;
function fixture({ granted = true, canAskAgain = false, request = async () => ({ granted: true, canAskAgain: true }), prepare = async () => {}, readFails = false } = {}) {
  const events: string[] = [];
  const modes: { allowsRecording: boolean; playsInSilentMode?: boolean }[] = [];
  let options: Record<string, unknown> = {};
  let listener: (status: { isFinished: boolean; hasError: boolean; url?: string }) => void = () => {};
  class Recorder {
    uri = "file:///cache/recording.wav";
    constructor(config: Record<string, unknown>) { options = config; }
    async prepareToRecordAsync() { events.push("prepare"); await prepare(); }
    record(config: { forDuration: number }) { events.push(`record:${config.forDuration}`); }
    getStatus() { return { isRecording: true }; }
    addListener(_name: string, callback: typeof listener) { listener = callback; return { remove: () => events.push("unsubscribe") }; }
    async stop() { events.push("stop"); }
    release() { events.push("release"); }
  }
  const load = async () => ({
    native: { AudioRecorder: Recorder },
    audio: {
      IOSOutputFormat: { LINEARPCM: "lpcm" }, AudioQuality: { HIGH: 96 },
      getRecordingPermissionsAsync: async () => ({ granted, canAskAgain }),
      requestRecordingPermissionsAsync: request,
      setAudioModeAsync: async (mode: { allowsRecording: boolean; playsInSilentMode?: boolean }) => {
        // ExpoAudio 1.1.1 / AudioUtils.validateAudioMode rejects this combination
        // before creating a recorder. Omitted playsInSilentMode defaults to false.
        if (mode.allowsRecording && !mode.playsInSilentMode) throw new Error("Impossible audio mode on iOS");
        modes.push(mode);
        events.push(mode.allowsRecording ? "mode:record" : "mode:play");
      },
    },
    fs: {
      EncodingType: { Base64: "base64" },
      getInfoAsync: async () => ({ exists: true, size: 32044 }),
      readAsStringAsync: async () => { events.push("read"); if (readFails) throw new Error("read"); return "audio"; },
      deleteAsync: async () => { events.push("delete"); },
    },
  });
  return { load: load as unknown as Load, events, modes, options: () => options, emit: (status: Parameters<typeof listener>[0]) => listener(status) };
}

test("adaptador iOS usa PCM mono com limite nativo e remove arquivo antes de devolver áudio", async () => {
  const f = fixture();
  const recording = await beginIosRecording(new AbortController().signal, () => {}, f.load);
  assert.equal(f.modes.find(mode => mode.allowsRecording)?.playsInSilentMode, true);
  assert.equal(f.options().outputFormat, "lpcm");
  assert.equal(f.options().sampleRate, 16000);
  assert.equal(f.options().numberOfChannels, 1);
  assert.equal(f.options().linearPCMBitDepth, 16);
  assert.ok(f.events.includes("record:30"));
  assert.equal(await recording.finish(), "audio");
  assert.equal(f.events.at(-1), "delete");
  await recording.dispose(); await recording.dispose();
  assert.equal(f.events.filter((event) => event === "release").length, 1);
  assert.ok(f.events.includes("mode:play"));
  assert.equal(f.modes.at(-1)?.allowsRecording, false);
  assert.equal(f.modes.at(-1)?.playsInSilentMode, undefined);
});

test("permissão negada não cria gravador; erro de leitura ainda exclui arquivo", async () => {
  const denied = fixture({ granted: false });
  await assert.rejects(beginIosRecording(new AbortController().signal, () => {}, denied.load), /Microfone não autorizado/);
  assert.equal(denied.events.includes("prepare"), false);
  const failed = fixture({ readFails: true });
  const recording = await beginIosRecording(new AbortController().signal, () => {}, failed.load);
  await assert.rejects(recording.finish());
  assert.equal(failed.events.at(-1), "delete");
  await recording.dispose();
});

test("cancelamento durante preparação nativa libera gravador e apaga arquivo sem gravar", async () => {
  const abort = new AbortController();
  const f = fixture({ prepare: async () => { abort.abort(); } });
  await assert.rejects(beginIosRecording(abort.signal, () => {}, f.load));
  assert.ok(f.events.includes("release"));
  assert.ok(f.events.includes("delete"));
  assert.equal(f.events.some((event) => event.startsWith("record:")), false);
});

test("término nativo no limite transcreve; parada inesperada e erro interrompem", async (t) => {
  let now = 100_000, completed = 0, interrupted = 0;
  t.mock.method(Date, "now", () => now);
  for (const reason of ["limit", "early", "error"] as const) {
    const f = fixture();
    const recording = await beginIosRecording(new AbortController().signal, () => { interrupted++; }, f.load, () => { completed++; });
    now += reason === "limit" ? 30_000 : 2_000;
    f.emit({ isFinished: true, hasError: reason === "error", url: "file:///cache/recording.wav" });
    await recording.dispose();
  }
  assert.equal(completed, 1);
  assert.equal(interrupted, 2);
});

test("somente o diálogo real de permissão recebe exceção de inatividade", async () => {
  const shown: boolean[] = [];
  const f = fixture({ granted: false, canAskAgain: true });
  const recording = await beginIosRecording(new AbortController().signal, () => {}, f.load, () => {}, value => shown.push(value));
  assert.deepEqual(shown, [true, false]);
  await recording.dispose();
  const controller = new AbortController();
  const canceled = fixture({ granted: false, canAskAgain: true, request: async () => { controller.abort(); return { granted: true, canAskAgain: true }; } });
  const canceledShown: boolean[] = [];
  await assert.rejects(beginIosRecording(controller.signal, () => {}, canceled.load, () => {}, value => canceledShown.push(value)));
  assert.deepEqual(canceledShown, [true, false]);
  assert.equal(canceled.events.some(event => event.startsWith("record:")), false);
});
