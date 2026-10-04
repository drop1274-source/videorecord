import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { lerp, springAt } from "../utils/timing";

type Props = { videoEndSec: number };

/** Pure black & white end card: letterbox bars close, title + name reveal, fade out. */
export function OutroCard({ videoEndSec }: Props) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const endSec = durationInFrames / fps;
  const start = videoEndSec - 0.45;

  if (t < start - 0.6) return null;

  const bars = interpolate(t, [start - 0.6, start + 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - (1 - x) ** 3,
  });
  const black = interpolate(t, [start, start + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const title = springAt(frame, fps, start + 0.3, 0.9);
  const line = springAt(frame, fps, start + 0.55, 0.8);
  const meta = springAt(frame, fps, start + 0.8, 0.8);
  const fadeOut = interpolate(t, [endSec - 0.7, endSec], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const barHeight = lerp(0, 360, bars);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: barHeight, backgroundColor: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: barHeight, backgroundColor: "#000" }} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: black }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 22,
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -4,
            color: "#FFFFFF",
            opacity: title,
            transform: `translateY(${lerp(30, 0, title)}px) scale(${lerp(1.08, 1, title)})`,
            filter: `blur(${lerp(10, 0, title)}px)`,
            lineHeight: 1,
          }}
        >
          {videoConfig.outro.headline}
        </div>
        <div style={{ width: lerp(0, 220, line), height: 2, backgroundColor: "#FFFFFF", opacity: 0.85 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: meta,
            transform: `translateY(${lerp(12, 0, meta)}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#FFFFFF",
            }}
          >
            {videoConfig.name}
          </div>
          <div style={{ fontFamily: fonts.mono, fontSize: 15, letterSpacing: 2, color: "rgba(255,255,255,0.6)" }}>
            {videoConfig.role} · {videoConfig.outro.contact}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
