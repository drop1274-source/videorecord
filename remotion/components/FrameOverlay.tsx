import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";

type Props = { split: number; videoEndSec: number };

const CORNER = 34;
const INSET = 22;

const svgUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const GRAIN = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 -0.35"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

const VIGNETTE = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><defs><radialGradient id="v" cx="50%" cy="46%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`,
);

function timecode(frame: number, fps: number) {
  const totalSec = Math.floor(frame / fps);
  const ff = String(Math.floor((frame % fps) / 2)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  return `00:${mm}:${ss}:${ff}`;
}

/** Camera viewfinder corners, REC badge, vignette and film grain. */
export function FrameOverlay({ split, videoEndSec }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const hudIn = interpolate(t, [0.2, 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hudOut = interpolate(t, [videoEndSec - 0.8, videoEndSec - 0.2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hud = hudIn * hudOut * (1 - split * 0.65);
  const recOn = Math.floor(t * 1.6) % 2 === 0;
  const grainX = -((frame * 53) % 300);
  const grainY = -((frame * 89) % 260);

  const corner = (pos: React.CSSProperties, borders: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: CORNER,
        height: CORNER,
        borderColor: "rgba(255,255,255,0.75)",
        borderStyle: "solid",
        borderWidth: 0,
        ...borders,
        ...pos,
      }}
    />
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img src={VIGNETTE} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />
      <Img
        src={GRAIN}
        style={{ position: "absolute", left: grainX, top: grainY, width: 1600, height: 1000, opacity: 0.08 }}
      />
      <AbsoluteFill style={{ opacity: hud }}>
        {corner({ left: INSET, top: INSET }, { borderLeftWidth: 2, borderTopWidth: 2 })}
        {corner({ right: INSET, top: INSET }, { borderRightWidth: 2, borderTopWidth: 2 })}
        {corner({ left: INSET, bottom: INSET }, { borderLeftWidth: 2, borderBottomWidth: 2 })}
        {corner({ right: INSET, bottom: INSET }, { borderRightWidth: 2, borderBottomWidth: 2 })}
        <div
          style={{
            position: "absolute",
            right: INSET + 16,
            top: INSET + 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: fonts.mono,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              backgroundColor: videoConfig.colors.accent,
              opacity: recOn ? 1 : 0.25,
              boxShadow: recOn ? `0 0 10px ${videoConfig.colors.accent}` : "none",
            }}
          />
          REC
          <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>{timecode(frame, fps)}</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: INSET + 16,
            top: INSET + 12,
            fontFamily: fonts.mono,
            fontSize: 12,
            letterSpacing: 1.5,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          CAM A · {videoConfig.name.toUpperCase()}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
