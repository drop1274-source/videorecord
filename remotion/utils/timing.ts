import { interpolate, spring } from "remotion";
import { videoConfig, type Project } from "../config";

export const SMOOTH = { damping: 200, mass: 0.9 } as const;

export const toFrame = (seconds: number, fps: number) => Math.round(seconds * fps);

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export function springAt(frame: number, fps: number, startSec: number, durationSec = 0.7) {
  return spring({
    frame: frame - toFrame(startSec, fps),
    fps,
    config: SMOOTH,
    durationInFrames: Math.max(1, Math.round(durationSec * fps)),
  });
}

/** 0 → 1 → 0 envelope for a [start, end] window, driven by springs on both edges. */
export function windowEnvelope(
  frame: number,
  fps: number,
  startSec: number,
  endSec: number,
  inSec = 0.7,
  outSec = 0.6,
) {
  const enter = springAt(frame, fps, startSec, inSec);
  const exit = springAt(frame, fps, endSec, outSec);
  return { enter, exit, value: interpolate(enter - exit, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
}

export type SplitBlock = { start: number; end: number };

/** Adjacent projects are merged so the layout stays in split view between them. */
export function getSplitBlocks(projects: Project[] = videoConfig.projects, mergeGap = 0.6): SplitBlock[] {
  const sorted = [...projects].sort((a, b) => a.start - b.start);
  const blocks: SplitBlock[] = [];
  for (const p of sorted) {
    const last = blocks[blocks.length - 1];
    if (last && p.start - last.end <= mergeGap) {
      last.end = Math.max(last.end, p.end);
    } else {
      blocks.push({ start: p.start, end: p.end });
    }
  }
  return blocks;
}

export function getSplitAmount(frame: number, fps: number) {
  const { inSec, outSec } = videoConfig.transitions;
  return getSplitBlocks().reduce(
    (sum, block) => sum + windowEnvelope(frame, fps, block.start, block.end, inSec, outSec).value,
    0,
  );
}
