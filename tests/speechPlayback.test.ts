import assert from "node:assert/strict";
import test from "node:test";
import { createSpeechPlayback, type SpeechPlaybackState } from "../src/features/assistant/speechPlayback";

function fixture(stop: () => Promise<void> = async () => {}) {
  const states: SpeechPlaybackState[] = [];
  const utterances: { text: string; options: Parameters<Parameters<typeof createSpeechPlayback>[0]["speak"]>[1] }[] = [];
  const player = createSpeechPlayback({ stop, speak: (text, options) => { utterances.push({ text, options }); } }, s => states.push(s));
  return { states, utterances, player };
}

test("leitura informa início, conclusão e falha sem perder texto", async () => {
  const f = fixture();
  await f.player.speak("Resposta preservada");
  const speech = f.utterances[0];
  assert.equal(speech.text, "Resposta preservada");
  assert.equal(speech.options.language, "pt-BR");
  assert.equal(speech.options.voice, undefined);
  speech.options.onStart();
  assert.equal(f.states.at(-1), "speaking");
  speech.options.onDone();
  assert.equal(f.states.at(-1), "idle");
  await f.player.speak("Nova resposta");
  f.utterances[1].options.onError(new Error("indisponível"));
  assert.equal(f.states.at(-1), "error");
});

test("eventos de uma leitura antiga não interrompem a próxima", async () => {
  const f = fixture();
  await f.player.speak("Primeira");
  await f.player.speak("Segunda");
  f.utterances[1].options.onStart();
  f.utterances[0].options.onDone();
  f.utterances[0].options.onError(new Error("antiga"));
  assert.equal(f.states.at(-1), "speaking");
});

test("fechar ou desativar voz antes da preparação terminar impede início tardio", async () => {
  let release!: () => void;
  const pending = new Promise<void>(r => { release = r; });
  const f = fixture(() => pending);
  const started = f.player.speak("Não deve tocar");
  f.player.stop();
  release();
  await started;
  assert.equal(f.utterances.length, 0);
  assert.equal(f.states.at(-1), "idle");
});

test("falha ao preparar áudio é capturada e resposta continua disponível", async () => {
  const f = fixture(async () => { throw new Error("áudio indisponível"); });
  await f.player.speak("Texto legível");
  assert.equal(f.utterances.length, 0);
  assert.equal(f.states.at(-1), "error");
  f.player.stop();
});

test("leitura usa identificador da voz selecionada sem alterar texto ou idioma", async () => {
  let options: {voice?:string;language:string}|undefined;
  const player=createSpeechPlayback({stop:async()=>{},speak:(_text,value)=>{options=value;}},()=>{},async()=>"pt-br-test");
  await player.speak("Texto preservado");assert.equal(options?.voice,"pt-br-test");assert.equal(options?.language,"pt-BR");
});
test("cancelar enquanto consulta a voz impede reprodução tardia", async () => {
  let release!:(id:string)=>void;const pending=new Promise<string>(resolve=>{release=resolve;});let count=0;
  const player=createSpeechPlayback({stop:async()=>{},speak:()=>{count++;}},()=>{},()=>pending);
  const speaking=player.speak("Não reproduzir");await Promise.resolve();player.stop();release("pt-br-test");await speaking;assert.equal(count,0);
});
