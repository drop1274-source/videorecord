import { useMemo } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { buildPages } from "../utils/captions";

export function Captions() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pages = useMemo(() => buildPages(), []);
  const timeMs = (frame / fps) * 1000;

  if (timeMs >= videoConfig.ending.letsTalk.start * 1000) return null;

  const page = pages.find((p) => timeMs >= p.startMs && timeMs < p.endMs);
  if (!page) return null;

  const sinceStart = timeMs - page.startMs;
  const untilEnd = page.endMs - timeMs;
  const opacity = Math.min(
    interpolate(sinceStart, [0, 140], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(untilEnd, [0, 120], [0, 1], { extrapolateRight: "clamp" }),
  );
  const lift = interpolate(sinceStart, [0, 180], [8, 0], { extrapolateRight: "clamp" });

  const activeIndex = page.words.reduce((idx, w, i) => (timeMs >= w.startMs ? i : idx), -1);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: videoConfig.captions.bottom,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${lift}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(17,17,17,0.78)",
          borderRadius: 999,
          padding: "10px 26px 12px",
          display: "flex",
          gap: 11,
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: videoConfig.captions.fontSize,
          lineHeight: 1.2,
          letterSpacing: -0.3,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        }}
      >
        {page.words.map((word, i) => {
          const isActive = i === activeIndex;
          return (
            <span
              key={`${word.startMs}-${i}`}
              style={{
                display: "inline-block",
                color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.42)",
                fontWeight: isActive ? 800 : 600,
                transform: `scale(${isActive ? 1.04 : 1})`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
