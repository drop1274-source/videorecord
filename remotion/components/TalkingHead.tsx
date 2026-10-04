import { OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { lerp } from "../utils/timing";

type Props = { split: number };

export function TalkingHead({ split }: Props) {
  const { width, height } = useVideoConfig();
  const card = videoConfig.layout.faceCard;
  const { full: fullFocus, card: cardFocus } = videoConfig.layout.faceFocusY;

  const left = lerp(0, card.x, split);
  const top = lerp(0, card.y, split);
  const w = lerp(width, card.width, split);
  const h = lerp(height, card.height, split);
  const radius = lerp(0, card.radius, split);
  const focusY = lerp(fullFocus, cardFocus, split);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: w,
        height: h,
        borderRadius: radius,
        overflow: "hidden",
        backgroundColor: "#000",
        boxShadow: `0 ${24 * split}px ${60 * split}px rgba(17,17,17,${0.18 * split}), 0 ${2 * split}px ${6 * split}px rgba(17,17,17,${0.08 * split})`,
      }}
    >
      <OffthreadVideo
        src={staticFile(videoConfig.video)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${focusY}%` }}
      />
    </div>
  );
}
