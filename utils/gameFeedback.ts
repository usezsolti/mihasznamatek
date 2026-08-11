/** Könnyű játék-feedback: Web Audio bippek (nincs külön hangfájl). */

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    if (!sharedCtx) sharedCtx = new AC();
    if (sharedCtx.state === 'suspended') {
        void sharedCtx.resume();
    }
    return sharedCtx;
}

function beep(freq: number, durationMs: number, type: OscillatorType = 'sine', gain = 0.08) {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);
    osc.start(now);
    osc.stop(now + durationMs / 1000);
}

export function playCorrectSound() {
    beep(523.25, 90, 'sine', 0.07);
    window.setTimeout(() => beep(659.25, 120, 'sine', 0.07), 80);
}

export function playWrongSound() {
    beep(196, 180, 'triangle', 0.09);
}

export function playStreakSound() {
    beep(523.25, 70, 'square', 0.05);
    window.setTimeout(() => beep(659.25, 70, 'square', 0.05), 70);
    window.setTimeout(() => beep(783.99, 140, 'square', 0.06), 140);
}

export function playLifeLostSound() {
    beep(150, 220, 'sawtooth', 0.05);
}

export type MascotMood = 'idle' | 'happy' | 'sad';

/** Streak mérföldkövekhez járó bónusz XP */
export function streakBonusXp(streak: number): number {
    if (streak === 3) return 5;
    if (streak === 5) return 15;
    if (streak === 8) return 25;
    if (streak > 0 && streak % 10 === 0) return 30;
    return 0;
}

export const SPRINT_SECONDS = 90;
