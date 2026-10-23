import { checkCanceled } from "./cancellation";
import { VoiceCleanupError, VoiceError, type VoicePhase } from "./voiceSession";

export type LiveSnapshot = { phase: VoicePhase; text: string; message: string };
export type PcmFrame = { content: string; sequence: number };
export type PcmCapture = { stop: () => Promise<void>; dispose: () => Promise<void> };
export type CaptureFactory = (frame: (value: PcmFrame) => void, ended: (reason: string) => void) => Promise<PcmCapture>;
export type LiveWire = { write: (frame: PcmFrame) => void; finish: () => void; cancel: () => void };
export type LiveVoicePorts = {
  prepare: (signal: AbortSignal) => Promise<CaptureFactory>;
  connect: (signal: AbortSignal, partial: (text: string) => void, final: (text: string) => void, failed: (error: Error) => void) => Promise<LiveWire>;
  changed: (snapshot: LiveSnapshot) => void;
  received: (text: string) => void;
};
type Run = {
  abort: AbortController; ready: Promise<void>; capture?: PcmCapture; wire?: LiveWire;
  finishing?: Promise<void>; completing?: Promise<void>; cleanup?: Promise<boolean>;
  phase: VoicePhase; text: string; timer?: ReturnType<typeof setTimeout>;
};

// One explicit opening/tap owns one capture, cloud stream and final answer.
export class LiveVoiceSession {
  private active?: Run;
  private blocked = false;
  constructor(private ports: LiveVoicePorts) {}
  private publish(run: Run, phase: VoicePhase, message = "") {
    run.phase = phase;
    if (this.active === run && !run.abort.signal.aborted) this.ports.changed({ phase, text: run.text, message });
  }
  async start() {
    if (this.active) return;
    if (this.blocked) { this.ports.changed({ phase: "error", text: "", message: "Reinicie o app do experimento para liberar o áudio antes de ouvir novamente." }); return; }
    const run: Run = { abort: new AbortController(), ready: Promise.resolve(), phase: "requesting", text: "" };
    this.active = run;
    this.publish(run, "requesting");
    run.ready = Promise.resolve().then(async () => {
      try {
        const capture = await this.ports.prepare(run.abort.signal);
        checkCanceled(run.abort.signal);
        run.wire = await this.ports.connect(run.abort.signal,
          text => { if (this.active === run && !run.abort.signal.aborted) { run.text = text; this.publish(run, run.phase); } },
          text => { void this.complete(run, text); }, error => { void this.fail(run, error); });
        checkCanceled(run.abort.signal);
        run.capture = await capture(frame => {
          if (this.active !== run || run.abort.signal.aborted) return;
          try { run.wire?.write(frame); } catch (error) { void this.fail(run, error); }
        }, reason => {
          if (this.active !== run || run.abort.signal.aborted) return;
          if (["manual", "limit"].includes(reason)) void this.finish();
          else void this.fail(run, reason === "cleanup" ? new VoiceCleanupError("Reinicie o app para liberar o áudio.") : new VoiceError("A escuta foi interrompida. Toque na Orb para tentar novamente."));
        });
        checkCanceled(run.abort.signal);
        if (!run.completing && !run.finishing) {
          this.publish(run, "recording");
          run.timer = setTimeout(() => { void this.finish(); }, 30_000);
        }
      } catch (error) { void this.fail(run, error); }
    });
    await run.ready;
  }
  finish(): Promise<void> {
    const run = this.active;
    if (!run || run.abort.signal.aborted || run.completing) return Promise.resolve();
    return run.finishing ??= (async () => {
      this.publish(run, "processing"); clearTimeout(run.timer);
      try {
        await run.ready;
        checkCanceled(run.abort.signal);
        await run.capture?.stop();
        checkCanceled(run.abort.signal);
        run.wire?.finish();
      } catch (error) { void this.fail(run, error); }
    })();
  }
  private complete(run: Run, text: string): Promise<void> {
    if (this.active !== run || run.abort.signal.aborted) return Promise.resolve();
    return run.completing ??= (async () => {
      this.publish(run, "processing"); clearTimeout(run.timer);
      await run.ready;
      if (this.active !== run || run.abort.signal.aborted) return;
      if (!text.trim()) { await this.fail(run, new VoiceError("Não reconheci a fala. Toque na Orb e tente novamente.")); return; }
      const cleaned = await this.cleanup(run);
      if (this.active !== run || run.abort.signal.aborted) return;
      this.active = undefined;
      if (!cleaned) { this.ports.changed({ phase: "error", text: run.text, message: "Reinicie o app para liberar o áudio." }); return; }
      this.ports.changed({ phase: "success", text: text.trim(), message: "" });
      this.ports.received(text.trim());
    })();
  }
  private async fail(run: Run, error: unknown) {
    if (this.active !== run || run.abort.signal.aborted) return;
    if (error instanceof VoiceCleanupError) this.blocked = true;
    run.abort.abort(); clearTimeout(run.timer); run.wire?.cancel();
    await run.ready;
    const cleaned = await this.cleanup(run);
    if (this.active !== run) return;
    this.active = undefined;
    this.ports.changed({ phase: "error", text: run.text, message: !cleaned || this.blocked ? "Reinicie o app para liberar o áudio." : error instanceof VoiceError ? error.message : "A conexão de voz falhou. Confira a conexão nas Configurações." });
  }
  async cancel() {
    const run = this.active;
    if (!run) return;
    run.abort.abort(); clearTimeout(run.timer); run.wire?.cancel();
    await run.ready;
    const cleaned = await this.cleanup(run);
    if (this.active !== run) return;
    this.active = undefined;
    this.ports.changed({ phase: cleaned ? "idle" : "error", text: "", message: cleaned ? "" : "Reinicie o app para liberar o áudio." });
  }
  private cleanup(run: Run) {
    clearTimeout(run.timer);
    return run.cleanup ??= (async () => {
      try { await run.capture?.dispose(); run.wire?.cancel(); return true; }
      catch { this.blocked = true; run.wire?.cancel(); return false; }
    })();
  }
}
