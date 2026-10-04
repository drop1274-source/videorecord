import { useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { windowEnvelope } from "../utils/timing";

export function LowerThird() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start, end } = videoConfig.lowerThird;
  const { enter, exit, value } = windowEnvelope(frame, fps, start, end, 0.8, 0.6);

  if (value <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 292,
        opacity: value,
        transform: `translate(${(1 - enter) * -24}px, ${(1 - enter) * -8 + exit * -6}px)`,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: "14px 20px 13px",
        boxShadow: "0 10px 30px rgba(17,17,17,0.14), 0 1px 3px rgba(17,17,17,0.08)",
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 0.5,
          color: videoConfig.colors.text,
          textTransform: "uppercase",
          lineHeight: 1.1,
        }}
      >
        {videoConfig.name}
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 14, color: "#6B6B6B", marginTop: 6, lineHeight: 1.1 }}>
        {videoConfig.role}
      </div>
    </div>
  );
}
