import { Easing, interpolate, spring } from "remotion";

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Framer Motion's default spring feel (stiffness 170 / damping ~18), frame-accurate for rendering. */
export const POP = { damping: 16, stiffness: 170, mass: 0.7 } as const;
export const SOFT = { damping: 22, stiffness: 120, mass: 0.8 } as const;

export function springFrom(frame: number, fps: number, startSec: number, config: typeof POP | typeof SOFT = POP) {
  return spring({ frame: frame - Math.round(startSec * fps), fps, config });
}

/** 0 → 1 over [start, start + dur] seconds. */
export function progress(t: number, start: number, dur: number, easing = easeOut) {
  return interpolate(t, [start, start + dur], [0, 1], { ...CLAMP, easing });
}

export type Stop = { t: number; v: number };

/** Piecewise eased keyframes — used for camera zoom/pan moves. */
export function keyframes(t: number, stops: Stop[]) {
  if (t <= stops[0].t) return stops[0].v;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t <= b.t) return interpolate(t, [a.t, b.t], [a.v, b.v], { ...CLAMP, easing: easeInOut });
  }
  return stops[stops.length - 1].v;
}

export function typed(text: string, t: number, start: number, charsPerSec = 22) {
  const n = Math.floor(Math.max(0, t - start) * charsPerSec);
  return text.slice(0, Math.min(text.length, n));
}

export function countUp(t: number, start: number, dur: number, to: number) {
  return Math.round(to * progress(t, start, dur));
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Blinking text caret, visible while typing and for a moment after. */
export function caretOn(frame: number, fps: number) {
  return Math.floor(frame / (fps * 0.45)) % 2 === 0;
}
