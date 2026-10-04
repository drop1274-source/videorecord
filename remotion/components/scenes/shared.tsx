import type { CSSProperties, ReactNode } from "react";
import { interpolate } from "remotion";
import { CLAMP, easeOut } from "../../utils/motion";

/** Inner size of the browser mockup's page area. */
export const SCENE = { width: 792, height: 520 } as const;

/** Visibility of a sub-screen within [start, end], with a quick cross-fade on both edges. */
export function phase(t: number, start: number, end: number, fade = 0.28) {
  const enter = interpolate(t, [start, start + fade], [0, 1], { ...CLAMP, easing: easeOut });
  const exit = interpolate(t, [end - fade * 0.5, end + fade * 0.5], [0, 1], CLAMP);
  return { enter, exit, visible: t > start - 0.01 && t < end + fade, opacity: Math.min(enter, 1 - exit) };
}

type ScreenProps = { t: number; start: number; end: number; children: ReactNode; style?: CSSProperties };

/** A full-scene sub-screen that pops in (scale + fade) and fades out. */
export function Screen({ t, start, end, children, style }: ScreenProps) {
  const p = phase(t, start, end);
  if (!p.visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SCENE.width,
        height: SCENE.height,
        overflow: "hidden",
        opacity: p.opacity,
        transform: `scale(${1.035 - p.enter * 0.035})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Pop-in for a single element: rises 14px and fades in from `at`. */
export function popIn(t: number, at: number, dur = 0.35): CSSProperties {
  const p = interpolate(t, [at, at + dur], [0, 1], { ...CLAMP, easing: easeOut });
  return { opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + p * 0.04})` };
}

export function Caret({ on, color = "currentColor", height = "1em" }: { on: boolean; color?: string; height?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 1.5,
        height,
        marginLeft: 1,
        backgroundColor: color,
        opacity: on ? 1 : 0,
        verticalAlign: "text-bottom",
      }}
    />
  );
}
