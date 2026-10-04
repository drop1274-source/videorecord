import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, easeOut, typed } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { BEATS, LAYERS, SECTIONS, THEME } from "./data";

export function AiPageBuilderScreen({ t }: { t: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prompt = typed("Build a modern SaaS landing page with hero, features, pricing", t, BEATS.prompt, 42);

  const genProgress = interpolate(t, [BEATS.generating, BEATS.heroRender], [0, 1], { ...CLAMP, easing: easeOut });
  const showCanvas = t >= BEATS.heroRender;

  // Cursor movement
  const cursorX = interpolate(
    t,
    [BEATS.prompt - 0.2, BEATS.prompt, BEATS.generating - 0.15, BEATS.generating, BEATS.generating + 0.3],
    [320, 380, 520, 710, 680],
    CLAMP,
  );
  const cursorY = interpolate(
    t,
    [BEATS.prompt - 0.2, BEATS.prompt, BEATS.generating - 0.15, BEATS.generating, BEATS.generating + 0.3],
    [60, 20, 20, 20, 120],
    CLAMP,
  );
  const isClicking = t >= BEATS.generating && t < BEATS.generating + 0.16;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        backgroundColor: THEME.bg,
        fontFamily: fonts.sans,
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar — Webflow Layers Tree */}
      <div
        style={{
          width: 175,
          backgroundColor: THEME.sidebar,
          padding: "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 6px" }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: 1.2 }}>
            PAGE DOM
          </span>
          <span style={{ fontSize: 9, color: THEME.accent, fontWeight: 700 }}>✦ AI Auto-Layout</span>
        </div>

        {LAYERS.map((layer, i) => (
          <div
            key={layer.name}
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: i === 0 && showCanvas ? "#FFFFFF" : "rgba(255,255,255,0.72)",
              padding: "5px 8px",
              paddingLeft: 8 + layer.indent * 12,
              borderRadius: 6,
              backgroundColor: i === 0 && showCanvas ? "rgba(59,130,246,0.3)" : "transparent",
              border: i === 0 && showCanvas ? "1px solid rgba(59,130,246,0.5)" : "1px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 6,
              ...popIn(t, BEATS.heroRender + 0.06 * i, 0.2),
            }}
          >
            <span style={{ fontSize: 9, opacity: 0.6 }}>{layer.indent === 0 ? "▣" : "↳"}</span>
            {layer.name}
          </div>
        ))}

        <div style={{ marginTop: "auto", padding: "10px 8px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>DESIGN SYSTEM</div>
          <div style={{ fontSize: 9, color: "#fff", fontWeight: 700, marginTop: 2 }}>Tailwind CSS · Radix UI</div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Control Bar */}
        <div
          style={{
            height: 44,
            borderBottom: "1px solid rgba(17,17,17,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
            backgroundColor: THEME.card,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: THEME.accent }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: THEME.text }}>Webflow AI</span>
          </div>

          {/* AI Prompt Input Bar */}
          <div
            style={{
              flex: 1,
              height: 28,
              borderRadius: 8,
              backgroundColor: "#F3F4F6",
              border: `1px solid ${t >= BEATS.prompt && t < BEATS.generating ? THEME.accent : "rgba(17,17,17,0.1)"}`,
              boxShadow: t >= BEATS.prompt && t < BEATS.generating ? "0 0 12px rgba(59,130,246,0.18)" : "none",
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              fontSize: 10,
              color: THEME.text,
              fontFamily: fonts.mono,
            }}
          >
            <span style={{ color: THEME.muted, marginRight: 6 }}>✦</span>
            {prompt}
            <span
              style={{
                width: 1.5,
                height: 12,
                backgroundColor: THEME.accent,
                opacity: t >= BEATS.prompt && t < BEATS.generating ? (Math.floor(frame / (fps * 0.35)) % 2 === 0 ? 1 : 0) : 0,
                marginLeft: 1,
              }}
            />
          </div>

          {/* Generate Button */}
          <div
            style={{
              height: 28,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentDark})`,
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              gap: 4,
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              transform: `scale(${isClicking ? 0.9 : 1})`,
              transition: "transform 0.08s ease",
            }}
          >
            ✦ Generate
          </div>
        </div>

        {/* Viewport Canvas */}
        <div style={{ flex: 1, position: "relative", padding: 18, backgroundColor: "#F8FAFC", overflow: "hidden" }}>
          {/* Generating Loading Line */}
          {t >= BEATS.generating && t < BEATS.heroRender + 0.25 && (
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 14,
                width: "calc(100% - 36px)",
                height: 3,
                borderRadius: 3,
                backgroundColor: "rgba(59,130,246,0.12)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${genProgress * 100}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: `linear-gradient(90deg, ${THEME.accent}, #93C5FD)`,
                }}
              />
            </div>
          )}

          {/* Generated Sections Preview */}
          {showCanvas && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SECTIONS.map((section, i) => {
                const at = BEATS.heroRender + 0.12 * i;
                const isDragging = section.type === "Features" && t >= BEATS.drag;
                const dragY = isDragging
                  ? interpolate(t, [BEATS.drag, BEATS.drag + 0.3], [0, -35], { ...CLAMP, easing: easeOut })
                  : 0;

                return (
                  <div
                    key={section.type}
                    style={{
                      borderRadius: 12,
                      backgroundColor: THEME.card,
                      border: `1px solid ${isDragging ? THEME.accent : "rgba(17,17,17,0.08)"}`,
                      boxShadow: isDragging ? "0 16px 36px rgba(59,130,246,0.2)" : "0 2px 8px rgba(17,17,17,0.04)",
                      padding: "14px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      transform: `translateY(${dragY}px)`,
                      ...popIn(t, at, 0.25),
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, color: section.color }}>{section.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: THEME.text }}>{section.type} Section</span>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: THEME.accent, backgroundColor: "rgba(59,130,246,0.08)", padding: "2px 8px", borderRadius: 4 }}>
                        &lt;{section.type} /&gt;
                      </span>
                    </div>

                    {i === 0 && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                        <div style={{ width: "65%", height: 16, borderRadius: 4, background: "linear-gradient(90deg, #E2E8F0 0%, #F1F5F9 100%)" }} />
                        <div
                          style={{
                            padding: "6px 14px",
                            borderRadius: 6,
                            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentDark})`,
                            fontSize: 9,
                            fontWeight: 800,
                            color: "#fff",
                            boxShadow: "0 2px 6px rgba(59,130,246,0.25)",
                          }}
                        >
                          Get Started →
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

      {/* Mouse Cursor */}
      {t >= BEATS.prompt - 0.2 && t <= BEATS.generating + 0.4 && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            pointerEvents: "none",
            zIndex: 100,
            transform: `scale(${isClicking ? 0.85 : 1})`,
            transition: "transform 0.08s ease",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
