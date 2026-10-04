import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, easeOut, typed } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { BEATS, LAYERS, SECTIONS, THEME } from "./data";

export function AiPageBuilderScreen({ t }: { t: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prompt = typed("Build a SaaS landing page with hero, features, pricing", t, BEATS.prompt, 38);

  const genProgress = interpolate(t, [BEATS.generating, BEATS.heroRender], [0, 1], { ...CLAMP, easing: easeOut });
  const showCanvas = t >= BEATS.heroRender;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        backgroundColor: THEME.bg,
        fontFamily: fonts.sans,
      }}
    >
      {/* Left Sidebar — Layers */}
      <div
        style={{
          width: 170,
          backgroundColor: THEME.sidebar,
          padding: "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: 1.2, marginBottom: 10 }}>
          LAYERS
        </div>
        {LAYERS.map((layer, i) => (
          <div
            key={layer.name}
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              padding: "5px 8px",
              paddingLeft: 8 + layer.indent * 14,
              borderRadius: 5,
              backgroundColor: i === 0 && t >= BEATS.heroRender ? "rgba(59,130,246,0.2)" : "transparent",
              ...popIn(t, BEATS.heroRender + 0.08 * i, 0.2),
            }}
          >
            {layer.name}
          </div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top toolbar */}
        <div
          style={{
            height: 40,
            borderBottom: "1px solid rgba(17,17,17,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 10,
            backgroundColor: THEME.card,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: THEME.accent }}>✦ AI Page Builder</span>
          <div
            style={{
              flex: 1,
              height: 26,
              borderRadius: 7,
              backgroundColor: "#F3F4F6",
              border: `1px solid ${t >= BEATS.prompt && t < BEATS.generating ? THEME.accent : "rgba(17,17,17,0.08)"}`,
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              fontSize: 10,
              color: THEME.text,
            }}
          >
            {prompt}
            <span
              style={{
                width: 1,
                height: 12,
                backgroundColor: THEME.accent,
                opacity: t >= BEATS.prompt && t < BEATS.generating ? (Math.floor(frame / (fps * 0.4)) % 2 === 0 ? 1 : 0) : 0,
                marginLeft: 1,
              }}
            />
          </div>
          <div
            style={{
              height: 26,
              borderRadius: 7,
              background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentDark})`,
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              transform: `scale(${interpolate(t, [BEATS.generating, BEATS.generating + 0.06, BEATS.generating + 0.18], [1, 0.92, 1], CLAMP)})`,
            }}
          >
            Generate
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, position: "relative", padding: 20, overflow: "hidden" }}>
          {/* Generating indicator */}
          {t >= BEATS.generating && t < BEATS.heroRender + 0.3 && (
            <div
              style={{
                position: "absolute",
                left: 20,
                top: 20,
                width: "calc(100% - 40px)",
                height: 4,
                borderRadius: 4,
                backgroundColor: "rgba(59,130,246,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${genProgress * 100}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${THEME.accent}, #60A5FA)`,
                }}
              />
            </div>
          )}

          {/* Generated sections */}
          {showCanvas && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              {SECTIONS.map((section, i) => {
                const at = BEATS.heroRender + 0.12 * i;
                const isDragging = section.type === "Features" && t >= BEATS.drag;
                const dragY = isDragging ? interpolate(t, [BEATS.drag, BEATS.drag + 0.3], [0, -40], { ...CLAMP, easing: easeOut }) : 0;
                return (
                  <div
                    key={section.type}
                    style={{
                      height: i === 0 ? 120 : 70,
                      borderRadius: 10,
                      backgroundColor: THEME.card,
                      border: `1px solid ${isDragging ? THEME.accent : "rgba(17,17,17,0.08)"}`,
                      boxShadow: isDragging ? "0 12px 32px rgba(59,130,246,0.15)" : "0 2px 8px rgba(17,17,17,0.04)",
                      padding: "12px 16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      transform: `translateY(${dragY}px)`,
                      ...popIn(t, at, 0.3),
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, color: section.color }}>{section.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: THEME.text }}>{section.type} Section</span>
                      <span style={{ fontSize: 9, color: THEME.muted, marginLeft: "auto" }}>AI generated</span>
                    </div>
                    {i === 0 && (
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <div style={{ width: "60%", height: 14, borderRadius: 4, background: "linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 100%)" }} />
                        <div
                          style={{
                            width: 60,
                            height: 24,
                            borderRadius: 6,
                            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentDark})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 8,
                            fontWeight: 800,
                            color: "#fff",
                          }}
                        >
                          Get Started
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
