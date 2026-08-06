let muted = false;

export function setMuted(value: boolean): void {
  muted = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("tadading.muted", value ? "1" : "0");
  }
}

export function loadMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("tadading.muted") === "1";
}

/** Short synthesized "ta-da-ding" using Web Audio API. */
export function playTaDaDing(): void {
  if (muted || typeof window === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.3);
  });

  window.setTimeout(() => {
    void ctx.close();
  }, 900);
}
