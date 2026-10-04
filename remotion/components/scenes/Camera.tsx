import type { ReactNode } from "react";
import { keyframes } from "../../utils/motion";

export type CameraShot = { t: number; zoom: number; x: number; y: number };

type Props = { t: number; shots: CameraShot[]; width: number; height: number; children: ReactNode };

/** Zoom in / zoom out onto a focus point (x, y in scene pixels), eased between shots. */
export function Camera({ t, shots, width, height, children }: Props) {
  const zoom = keyframes(t, shots.map((s) => ({ t: s.t, v: s.zoom })));
  const fx = keyframes(t, shots.map((s) => ({ t: s.t, v: s.x })));
  const fy = keyframes(t, shots.map((s) => ({ t: s.t, v: s.y })));

  // Keep the focus point centred, but never pan past the scene edges.
  const tx = Math.min(0, Math.max(width - width * zoom, width / 2 - fx * zoom));
  const ty = Math.min(0, Math.max(height - height * zoom, height / 2 - fy * zoom));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
