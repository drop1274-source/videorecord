import { useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { lerp, springAt, windowEnvelope } from "../utils/timing";

export function LookingFor() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { label, title, start, end } = videoConfig.ending;
  const { enter, exit, value } = windowEnvelope(frame, fps, start, end, 0.7, 0.5);

  if (value <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        right: 64,
        top: 250,
        opacity: value,
        transform: `translateX(${(1 - enter) * 30}px) translateY(${exit * 8}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2.2,
          textTransform: "uppercase",
          color: videoConfig.colors.accent,
          backgroundColor: "rgba(255,255,255,0.92)",
          padding: "4px 8px",
          borderRadius: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: -0.6,
          color: videoConfig.colors.text,
          backgroundColor: "#FFFFFF",
          padding: "10px 18px 12px",
          borderRadius: 12,
          boxShadow: "0 14px 34px rgba(17,17,17,0.22)",
        }}
      >
        {title}
      </div>
    </div>
  );
}

export function LetsTalk() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { text, start } = videoConfig.ending.letsTalk;
  const enter = springAt(frame, fps, start, 0.6);

  if (enter <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: videoConfig.captions.bottom,
        display: "flex",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${lerp(16, 0, enter)}px) scale(${lerp(0.9, 1, enter)})`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: -1.5,
          color: "#FFFFFF",
          backgroundColor: videoConfig.colors.text,
          padding: "10px 32px 14px",
          borderRadius: 999,
          boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
        }}
      >
        {text.replace(/\.$/, "")}
        <span style={{ color: videoConfig.colors.accent }}>.</span>
      </div>
    </div>
  );
}
