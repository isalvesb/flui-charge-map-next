import assert from "node:assert/strict";
import test from "node:test";
import { prepareZephyrAudio } from "../src/features/assistant/voice/zephyrAudio";
import type { SpeechOptions } from "../src/features/assistant/speechPlayback";

type Load = NonNullable<Parameters<typeof prepareZephyrAudio>[3]>;
function fixture() {
  const events: string[] = [], files = new Set<string>();
  let listener: (value: Record<string, unknown>) => void = () => {};
  const options: SpeechOptions = { language: "pt-BR", onStart: () => events.push("start"), onDone: () => events.push("done"), onStopped: () => events.push("stopped"), onError: () => events.push("error") };
  const dependencies = {
    audio: {
      setAudioModeAsync: async (mode: { allowsRecording: boolean; playsInSilentMode: boolean; shouldPlayInBackground: boolean }) => { assert.deepEqual(mode, { allowsRecording: false, playsInSilentMode: true, shouldPlayInBackground: false }); events.push("mode"); },
      createAudioPlayer: () => ({
        play: () => events.push("play"), pause: () => events.push("pause"), remove: () => events.push("remove"),
        addListener: (_event: string, callback: typeof listener) => { listener = callback; return { remove: () => events.push("unsubscribe") }; },
      }),
    },
    fs: {
      cacheDirectory: "file:///cache/", EncodingType: { Base64: "base64" },
      makeDirectoryAsync: async () => {}, readDirectoryAsync: async () => [],
      writeAsStringAsync: async (uri: string) => { files.add(uri); events.push("write"); },
      deleteAsync: async (uri: string) => { files.delete(uri); events.push("delete"); },
    },
  };
  return { dependencies, load: (async () => dependencies) as unknown as Load, events, files, options, emit: (status: Record<string, unknown>) => listener(status) };
}
const flush = () => new Promise<void>(resolve => setImmediate(resolve));

test("MP3 usa cache próprio, avisa início audível e remove áudio na conclusão", async () => {
  const f = fixture(); const prepared = await prepareZephyrAudio("test", new AbortController().signal, f.options, f.load);
  assert.equal(f.events.includes("start"), false); prepared.start();
  f.emit({ playing: true }); assert.equal(f.events.at(-1), "start");
  f.emit({ didJustFinish: true }); await flush();
  assert.equal(f.files.size, 0); assert.equal(f.events.at(-1), "done"); assert.ok(f.events.includes("remove"));
});

test("cancelar remove player e arquivo, sem conclusão ou callback tardio", async () => {
  const f = fixture(), controller = new AbortController();
  const prepared = await prepareZephyrAudio("test", controller.signal, f.options, f.load); prepared.start();
  controller.abort(); await prepared.stop(); f.emit({ playing: true, didJustFinish: true });
  assert.equal(f.files.size, 0); assert.equal(f.events.includes("start"), false); assert.equal(f.events.includes("done"), false);
});

test("cancelamento durante escrita apaga arquivo e não abre player", async () => {
  const f = fixture(), controller = new AbortController();
  f.dependencies.fs.writeAsStringAsync = async uri => { f.files.add(uri); controller.abort(); };
  await assert.rejects(prepareZephyrAudio("test", controller.signal, f.options, f.load));
  assert.equal(f.files.size, 0); assert.equal(f.events.includes("mode"), false);
});

test("falha nativa remove arquivo e reporta erro mantendo texto disponível", async () => {
  const f = fixture(); const prepared = await prepareZephyrAudio("test", new AbortController().signal, f.options, f.load); prepared.start();
  f.emit({ playbackState: "error" }); await flush();
  assert.equal(f.files.size, 0); assert.equal(f.events.at(-1), "error");
});

test("interrupção externa libera áudio e informa parada sem reiniciar", async () => {
  const f = fixture(); const prepared = await prepareZephyrAudio("test", new AbortController().signal, f.options, f.load); prepared.start();
  f.emit({ playing: true }); f.emit({ playing: false, isBuffering: false, timeControlStatus: "paused" }); await flush();
  assert.equal(f.files.size, 0); assert.equal(f.events.at(-1), "stopped"); assert.equal(f.events.filter(event => event === "play").length, 1);
});
