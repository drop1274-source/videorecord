import { interpolate } from "remotion";
import { CLAMP, easeInOut } from "../../utils/motion";

export type CursorStop = { t: number; x: number; y: number; click?: boolean };

type Props = { t: number; path: CursorStop[]; dark?: boolean };

/** macOS-style pointer gliding between points, with a ripple on clicks. */
export function Cursor({ t, path, dark = false }: Props) {
  if (t < path[0].t - 0.2) return null;

  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (t >= a.t && t <= b.t) {
      const p = interpolate(t, [a.t, b.t], [0, 1], { ...CLAMP, easing: easeInOut });
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p;
      break;
    }
    if (t > b.t) {
      x = b.x;
      y = b.y;
    }
  }

  const clicks = path.filter((s) => s.click);
  const press = clicks.reduce((m, s) => Math.max(m, interpolate(t, [s.t, s.t + 0.08, s.t + 0.2], [0, 1, 0], CLAMP)), 0);
  const fill = dark ? "#FFFFFF" : "#111111";
  const stroke = dark ? "#111111" : "#FFFFFF";

  return (
    <>
      {clicks.map((s) => {
        const r = interpolate(t, [s.t, s.t + 0.5], [0, 1], CLAMP);
        if (r <= 0 || r >= 1) return null;
        return (
          <div
            key={s.t}
            style={{
              position: "absolute",
              left: s.x - 22,
              top: s.y - 22,
              width: 44,
              height: 44,
              borderRadius: 999,
              border: "2px solid rgba(232,68,42,0.9)",
              transform: `scale(${0.3 + r * 1.1})`,
              opacity: 1 - r,
            }}
          />
        );
      })}
      <svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x - 3,
          top: y - 2,
          transform: `scale(${1 - press * 0.18})`,
          transformOrigin: "3px 2px",
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))",
        }}
        aria-hidden
      >
        <path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill={fill} stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
}
