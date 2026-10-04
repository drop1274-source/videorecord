import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { lerp } from "../utils/timing";
import { CoverVideo } from "./CoverVideo";

type Props = { split: number };

export function TalkingHead({ split }: Props) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const full = videoConfig.layout.faceFull;
  const card = videoConfig.layout.faceCard;
  const { full: fullFocus, card: cardFocus } = videoConfig.layout.faceFocusY;

  const left = lerp(full.x, card.x, split);
  const top = lerp(full.y, card.y, split);
  const w = lerp(full.width, card.width, split);
  const h = lerp(full.height, card.height, split);
  const radius = lerp(full.radius, card.radius, split);
  const focusY = lerp(fullFocus, cardFocus, split);

  // Slow push-in across the video, relaxed while in split view.
  const push = interpolate(frame, [0, durationInFrames], [1.0, 1.07]);
  const zoom = lerp(push, 1, split);
  const intro = interpolate(frame, [0, 0.9 * fps], [0.94, 1], { extrapolateRight: "clamp" });

  // Subtle organic handheld camera movement
  const handheldY = Math.sin(frame / 38) * 1.8;
  const handheldX = Math.cos(frame / 46) * 1.2;

  return (
    <div
      style={{
        position: "absolute",
        left: left + handheldX,
        top: top + handheldY,
        width: w,
        height: h,
        borderRadius: radius,
        overflow: "hidden",
        backgroundColor: "#000",
        transform: `scale(${intro})`,
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "0 32px 85px rgba(0,0,0,0.55), 0 0 50px rgba(99,102,241,0.18), inset 0 1px 0 rgba(255,255,255,0.25)",
        zIndex: 5,
      }}
    >
      <CoverVideo width={w} height={h} focusY={focusY} zoom={zoom} filter={videoConfig.grade} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "38%",
          backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.45))",
        }}
      />
      {/* Top subtle gloss highlight */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        }}
      />
    </div>
  );
}
