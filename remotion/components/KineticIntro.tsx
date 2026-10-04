import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { CLAMP, POP, springFrom } from "../utils/motion";
import { windowEnvelope } from "../utils/timing";

type Badge = {
  icon: string;
  tag: string;
  title: string;
  sub: string;
  side: "left" | "right";
  top: number;
  start: number;
  end: number;
  accent: string;
};

const BADGES: Badge[] = [
  {
    icon: "⚡",
    tag: "EXPERTISE",
    title: "Full-Stack Engineer",
    sub: "3+ Years Production Experience",
    side: "right",
    top: 220,
    start: 3.4,
    end: 8.5,
    accent: "#6366F1",
  },
  {
    icon: "🛍️",
    tag: "PRODUCTION APP",
    title: "End-to-End E-Commerce",
    sub: "Payments · Logistics · GST",
    side: "right",
    top: 180,
    start: 14.8,
    end: 18.0,
    accent: "#EC4899",
  },
  {
    icon: "🤖",
    tag: "INNOVATION",
    title: "AI Integrations",
    sub: "GPT-4 · Automation · Workflows",
    side: "left",
    top: 280,
    start: 17.8,
    end: 21.2,
    accent: "#8B5CF6",
  },
  {
    icon: "📍",
    tag: "REAL-TIME",
    title: "IoT & Map Tracking",
    sub: "Live GPS & Fleet Operations",
    side: "right",
    top: 260,
    start: 20.6,
    end: 23.5,
    accent: "#3B82F6",
  },
  {
    icon: "💼",
    tag: "ENTERPRISE",
    title: "Custom CRM & ERP",
    sub: "Scalable Client Dashboards",
    side: "left",
    top: 200,
    start: 23.2,
    end: 25.3,
    accent: "#10B981",
  },
];

export function KineticIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Only show intro kinetic badges before project showcase
  const firstProjectStart = videoConfig.projects[0].start;
  if (t > firstProjectStart) return null;

  return (
    <>
      {BADGES.map((b) => {
        const { enter, exit, value } = windowEnvelope(frame, fps, b.start, b.end, 0.45, 0.35);
        if (value <= 0.001) return null;

        const isLeft = b.side === "left";
        const slideX = isLeft ? (1 - enter) * -40 + exit * -30 : (1 - enter) * 40 + exit * 30;
        const scale = interpolate(enter, [0, 1], [0.92, 1], CLAMP);

        return (
          <div
            key={`${b.title}-${b.start}`}
            style={{
              position: "absolute",
              left: isLeft ? 54 : undefined,
              right: !isLeft ? 54 : undefined,
              top: b.top,
              width: 300,
              opacity: value,
              transform: `translateX(${slideX}px) scale(${scale})`,
              transformOrigin: isLeft ? "left center" : "right center",
              backgroundColor: "rgba(15, 17, 26, 0.88)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: 16,
              padding: "16px 18px",
              border: `1px solid rgba(255, 255, 255, 0.12)`,
              boxShadow: `0 20px 48px rgba(0,0,0,0.5), 0 0 30px ${b.accent}22, inset 0 1px 0 rgba(255,255,255,0.18)`,
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: `${b.accent}20`,
                border: `1px solid ${b.accent}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: `0 4px 14px ${b.accent}30`,
                flexShrink: 0,
              }}
            >
              {b.icon}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  color: b.accent,
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                {b.tag}
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: -0.2,
                  lineHeight: 1.2,
                }}
              >
                {b.title}
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 3,
                  fontWeight: 500,
                }}
              >
                {b.sub}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
