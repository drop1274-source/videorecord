import { useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig, type Project } from "../config";
import { fonts } from "../fonts";
import { lerp, windowEnvelope } from "../utils/timing";

type Props = { project: Project };

export function CalloutCard({ project }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { enter, exit, value } = windowEnvelope(frame, fps, project.start + 0.35, project.end - 0.15, 0.5, 0.4);
  const pos = videoConfig.layout.callout;

  if (value <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        opacity: value,
        transform: `translateY(${(1 - enter) * 14 + exit * 10}px) scale(${lerp(0.9, 1, enter)})`,
        transformOrigin: "left bottom",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: "11px 16px 12px",
        boxShadow: "0 14px 34px rgba(17,17,17,0.16), 0 1px 3px rgba(17,17,17,0.08)",
        border: "1px solid rgba(17,17,17,0.05)",
        maxWidth: 360,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: videoConfig.colors.accent,
        }}
      >
        {project.label}
      </div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: -0.4,
          color: videoConfig.colors.text,
          marginTop: 4,
          lineHeight: 1.15,
        }}
      >
        {project.title}
      </div>
    </div>
  );
}
