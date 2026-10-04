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
    interpolate(sinceStart, [0, 120], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(untilEnd, [0, 120], [0, 1], { extrapolateRight: "clamp" }),
  );
  const lift = interpolate(sinceStart, [0, 160], [10, 0], { extrapolateRight: "clamp" });

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
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(10, 12, 18, 0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 999,
          padding: "10px 24px 11px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: fonts.sans,
          fontSize: videoConfig.captions.fontSize,
          lineHeight: 1.25,
          letterSpacing: -0.3,
          whiteSpace: "nowrap",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 16px 36px rgba(0,0,0,0.45), 0 0 20px rgba(0,0,0,0.25)",
        }}
      >
        {/* Subtle glowing live speech indicator */}
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            backgroundColor: "#22C55E",
            boxShadow: "0 0 8px #22C55E",
            display: "inline-block",
            marginRight: 4,
          }}
        />

        {page.words.map((word, i) => {
          const isActive = i === activeIndex;
          const wordElapsed = Math.max(0, (timeMs - word.startMs) / 1000);
          const wordDuration = Math.max(0.1, (word.endMs - word.startMs) / 1000);

          // Kinetic spring bounce for active word
          const activeBounce = isActive
            ? interpolate(wordElapsed, [0, 0.08, 0.2], [1, 1.16, 1.08], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;

          return (
            <span
              key={`${word.startMs}-${i}`}
              style={{
                display: "inline-block",
                color: isActive ? "#FDE047" : "rgba(255, 255, 255, 0.48)",
                fontWeight: isActive ? 900 : 600,
                transform: `scale(${activeBounce})`,
                transformOrigin: "center bottom",
                transition: "color 0.08s ease",
                textShadow: isActive
                  ? "0 0 16px rgba(253, 224, 71, 0.6), 0 2px 8px rgba(0,0,0,0.8)"
                  : "0 2px 4px rgba(0,0,0,0.5)",
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
