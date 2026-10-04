import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { CLAMP, POP, springFrom } from "../utils/motion";

type KineticBeat = {
  leftWords: string[];
  rightWords: string[];
  sub: string;
  start: number;
  end: number;
  accent: string;
};

const BEATS: KineticBeat[] = [
  {
    leftWords: ["FULL", "STACK"],
    rightWords: ["CODE", "DEV"],
    sub: "ENGINEER",
    start: 3.2,
    end: 8.0,
    accent: "#6366F1",
  },
  {
    leftWords: ["3+", "YEARS"],
    rightWords: ["PROD", "SCALE"],
    sub: "EXPERIENCE",
    start: 8.2,
    end: 12.0,
    accent: "#3B82F6",
  },
  {
    leftWords: ["E-COM", "APPS"],
    rightWords: ["CRM", "ERP"],
    sub: "ARCHITECTURE",
    start: 14.8,
    end: 18.2,
    accent: "#EC4899",
  },
  {
    leftWords: ["AI", "APPS"],
    rightWords: ["GPT", "MODELS"],
    sub: "INTEGRATION",
    start: 18.3,
    end: 21.5,
    accent: "#8B5CF6",
  },
  {
    leftWords: ["NEXT.JS", "REACT"],
    rightWords: ["CLOUD", "APIS"],
    sub: "FULL-STACK",
    start: 21.6,
    end: 25.2,
    accent: "#10B981",
  },
];

export function BackgroundKineticText({ split }: { split: number }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  // Fade out completely when split view appears (projects taking over)
  if (split >= 0.7) return null;
  const splitFade = 1 - split;

  const activeBeat = BEATS.find((b) => t >= b.start - 0.2 && t <= b.end + 0.3);
  if (!activeBeat) return null;

  const enter = springFrom(frame, fps, activeBeat.start, POP);
  const exit = springFrom(frame, fps, activeBeat.end, POP);
  const opacity = interpolate(enter - exit, [0, 0.4], [0, 0.95], CLAMP) * splitFade;
  const translateY = (1 - enter) * 60 - exit * 50;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 2,
        opacity,
      }}
    >
      {/* Left Typography Block */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 100,
          width: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          transform: `translateY(${translateY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 3,
            color: activeBeat.accent,
            marginBottom: 4,
          }}
        >
          ✦ {activeBeat.sub}
        </span>
        {activeBeat.leftWords.map((w, i) => (
          <div
            key={w}
            style={{
              fontFamily: fonts.sans,
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 0.95,
              color: i === 0 ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)",
              textTransform: "uppercase",
              textShadow: "0 8px 30px rgba(0,0,0,0.6)",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Right Typography Block */}
      <div
        style={{
          position: "absolute",
          right: 50,
          top: 100,
          width: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          transform: `translateY(${translateY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 3,
            color: activeBeat.accent,
            marginBottom: 4,
          }}
        >
          PRODUCTION ✦
        </span>
        {activeBeat.rightWords.map((w, i) => (
          <div
            key={w}
            style={{
              fontFamily: fonts.sans,
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 0.95,
              color: i === 0 ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)",
              textTransform: "uppercase",
              textAlign: "right",
              textShadow: "0 8px 30px rgba(0,0,0,0.6)",
            }}
          >
            {w}
          </div>
        ))}
      </div>
    </div>
  );
}
