import { checkCanceled } from "./cancellation";
export type VoicePhase = "idle" | "requesting" | "recording" | "processing" | "canceling" | "success" | "error";
export type VoiceSnapshot = { phase: VoicePhase; message: string };
export type Recording = { finish: () => Promise<string>; dispose: () => Promise<void> };
export type VoicePorts = {
  begin: (signal: AbortSignal, interrupted: () => void, completed: () => void) => Promise<Recording>;
  transcribe: (content: string, signal: AbortSignal) => Promise<string>;
  changed: (state: VoiceSnapshot) => void;
  received: (text: string) => void;
};
export class VoiceError extends Error {}
export class VoiceCleanupError extends VoiceError {}
export const voiceBusy = (phase: VoicePhase) => ["requesting", "recording", "processing", "canceling"].includes(phase);
export const appendTranscript = (draft: string, transcript: string) => draft.trim() ? `${draft.trimEnd()} ${transcript.trim()}` : transcript.trim();
const cleanupMessage = "Não foi possível liberar o microfone ou apagar o áudio temporário. Reinicie o app do experimento antes de gravar novamente. O teclado continua disponível.";

type Run = {
  controller: AbortController;
  ready: Promise<void>;
  recording?: Recording;
  capture?: Promise<string>;
  finishing?: Promise<void>;
  canceling?: Promise<void>;
  cleanup?: Promise<boolean>;
  timer?: ReturnType<typeof setTimeout>;
  completed: boolean;
};

// A run owns its recorder, timer and cleanup. A late response cannot alter a new run.
export class VoiceSession {
  private active?: Run;
  private cleanupBlocked = false;
  constructor(private ports: VoicePorts) {}

  async start() {
    if (this.active) return;
    if (this.cleanupBlocked) {
      this.ports.changed({ phase: "error", message: cleanupMessage });
      return;
    }
    const run: Run = { controller: new AbortController(), ready: Promise.resolve(), completed: false };
    this.active = run;
    this.ports.changed({ phase: "requesting", message: "Preparando microfone…" });
    run.ready = Promise.resolve().then(async () => {
      try {
        run.recording = await this.ports.begin(run.controller.signal,
          () => { void this.cancel("Gravação interrompida. Tente novamente."); },
          () => { run.completed = true; if (run.recording) void this.finish(); });
        if (run.controller.signal.aborted) return;
        this.ports.changed({ phase: "recording", message: "Gravando · até 30 s. Toque em Parar para transcrever." });
        run.timer = setTimeout(() => { void this.finish(); }, 30_000);
        if (run.completed) void this.finish();
      } catch (error) {
        if (error instanceof VoiceCleanupError) this.cleanupBlocked = true;
        if (!run.controller.signal.aborted) {
          const cleaned = await this.cleanup(run);
          if (this.active !== run || run.controller.signal.aborted) return;
          this.active = undefined;
          this.ports.changed({ phase: "error", message: !cleaned || this.cleanupBlocked ? cleanupMessage : error instanceof VoiceError ? error.message : "Não foi possível iniciar o microfone. Continue pelo teclado." });
        }
      }
    });
    await run.ready;
  }

  finish(): Promise<void> {
    const run = this.active;
    if (!run?.recording || run.controller.signal.aborted) return Promise.resolve();
    if (run.finishing) return run.finishing;
    clearTimeout(run.timer);
    this.ports.changed({ phase: "processing", message: "Transcrevendo no Google Cloud…" });
    run.capture = Promise.resolve().then(() => run.recording!.finish());
    run.finishing = this.complete(run);
    return run.finishing;
  }

  private async complete(run: Run) {
    let text = "", failure: unknown;
    try {
      const content = await run.capture!;
      checkCanceled(run.controller.signal);
      text = (await this.ports.transcribe(content, run.controller.signal)).trim();
      checkCanceled(run.controller.signal);
      if (!text) throw new VoiceError("Não reconheci fala. Tente novamente, falando perto do microfone.");
    } catch (error) { failure = error; }
    const cleaned = await this.cleanup(run);
    if (this.active !== run || run.controller.signal.aborted) return;
    this.active = undefined;
    if (!cleaned || failure) {
      this.ports.changed({ phase: "error", message: !cleaned ? cleanupMessage : failure instanceof VoiceError ? failure.message : "Falha na transcrição. Verifique a conexão e tente novamente." });
      return;
    }
    this.ports.received(text);
    this.ports.changed({ phase: "success", message: "Transcrição pronta. Revise o texto e toque em Enviar." });
  }

  cancel(message = "Gravação cancelada."): Promise<void> {
    const run = this.active;
    if (!run) return Promise.resolve();
    if (run.canceling) return run.canceling;
    run.controller.abort();
    clearTimeout(run.timer);
    this.ports.changed({ phase: "canceling", message: "Cancelando…" });
    run.canceling = (async () => {
      await run.ready;
      // Wait for native stop/read, not for a network response that may arrive late.
      await run.capture?.catch(() => {});
      const cleaned = await this.cleanup(run);
      if (this.active !== run) return;
      this.active = undefined;
      this.ports.changed(cleaned && !this.cleanupBlocked ? { phase: "idle", message } : { phase: "error", message: cleanupMessage });
    })();
    return run.canceling;
  }

  private cleanup(run: Run): Promise<boolean> {
    clearTimeout(run.timer);
    return run.cleanup ??= (async () => {
      try { await run.recording?.dispose(); return true; }
      catch { this.cleanupBlocked = true; return false; }
    })();
  }
}
