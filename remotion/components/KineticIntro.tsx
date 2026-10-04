import { useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { windowEnvelope } from "../utils/timing";
import { MaskText } from "./kinetic/MaskText";

/**
 * Big kinetic text lines that appear during key moments in the speech,
 * using the MaskText "rise from behind" animation (Framer Motion style).
 *
 * Each line is synced to a specific caption timestamp from the audio.
 */
const LINES = [
  {
    text: "Full-Stack Engineer",
    start: 3.5,
    end: 7.0,
    top: 120,
    fontSize: 38,
    color: "#FFFFFF",
  },
  {
    text: "3 Years of Experience",
    start: 4.8,
    end: 7.0,
    top: 172,
    fontSize: 24,
    color: videoConfig.colors.accent,
  },
  {
    text: "E-Commerce · CRM · ERP",
    start: 15.2,
    end: 18.0,
    top: 130,
    fontSize: 30,
    color: "#FFFFFF",
  },
  {
    text: "AI Integrations",
    start: 17.9,
    end: 20.0,
    top: 175,
    fontSize: 26,
    color: videoConfig.colors.accent,
  },
  {
    text: "Mobile Apps · Dashboards",
    start: 20.3,
    end: 23.0,
    top: 130,
    fontSize: 28,
    color: "#FFFFFF",
  },
  {
    text: "Custom Web Applications",
    start: 23.2,
    end: 25.3,
    top: 170,
    fontSize: 26,
    color: videoConfig.colors.accent,
  },
] as const;

export function KineticIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Only show kinetic text when NOT in split view (projects visible)
  // These lines appear during the intro portion of the video (0-25s approx)
  const firstProjectStart = videoConfig.projects[0].start;
  if (t > firstProjectStart) return null;

  return (
    <>
      {LINES.map((line) => {
        const { value } = windowEnvelope(frame, fps, line.start, line.end, 0.5, 0.4);
        if (value <= 0.001) return null;

        return (
          <div
            key={`${line.text}-${line.start}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: line.top,
              display: "flex",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <MaskText
              text={line.text}
              start={line.start}
              exitAt={line.end - 0.3}
              stagger={0.05}
              style={{
                fontFamily: fonts.sans,
                fontSize: line.fontSize,
                fontWeight: 800,
                letterSpacing: -1,
                color: line.color,
                textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        );
      })}
    </>
  );
}
