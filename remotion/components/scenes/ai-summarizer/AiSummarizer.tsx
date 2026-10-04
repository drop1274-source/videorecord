import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, easeOut, typed } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { BEATS, KEY_POINTS, SUMMARY_TEXT, THEME } from "./data";

export function AiSummarizerScreen({ t }: { t: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const url = typed("https://techblog.dev/ai-code-revolution", t, BEATS.urlType, 46);
  const showResult = t >= BEATS.result;
  const summaryText = showResult ? typed(SUMMARY_TEXT, t, BEATS.result, 85) : "";
  const isLoading = t >= BEATS.loading && t < BEATS.result;

  // Button click animation
  const btnScale = interpolate(
    t,
    [BEATS.summarize, BEATS.summarize + 0.08, BEATS.summarize + 0.22],
    [1, 0.92, 1],
    CLAMP,
  );

  // Simulated cursor
  const cursorX = interpolate(
    t,
    [BEATS.urlType - 0.2, BEATS.urlType, BEATS.summarize - 0.15, BEATS.summarize, BEATS.summarize + 0.3],
    [260, 220, 220, 160, 240],
    CLAMP,
  );
  const cursorY = interpolate(
    t,
    [BEATS.urlType - 0.2, BEATS.urlType, BEATS.summarize - 0.15, BEATS.summarize, BEATS.summarize + 0.3],
    [100, 100, 100, 168, 220],
    CLAMP,
  );
  const cursorClick = t >= BEATS.summarize && t < BEATS.summarize + 0.15;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: THEME.bg,
        fontFamily: fonts.sans,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Navbar */}
      <div
        style={{
          height: 48,
          backgroundColor: THEME.card,
          borderBottom: "1px solid rgba(124,92,252,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              color: "#fff",
              boxShadow: "0 0 12px rgba(124,92,252,0.4)",
            }}
          >
            ✦
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", letterSpacing: -0.2 }}>
            AI Article Summarizer
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
              backgroundColor: "rgba(124,92,252,0.15)",
              color: THEME.accentLight,
              border: "1px solid rgba(124,92,252,0.3)",
            }}
          >
            GPT-4o Turbo
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 10, color: THEME.muted, fontWeight: 600 }}>API Status:</span>
          <span style={{ fontSize: 10, color: THEME.success, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: THEME.success, boxShadow: `0 0 6px ${THEME.success}` }} />
            Operational
          </span>
        </div>
      </div>

      {/* Main Dual-Pane Body */}
      <div style={{ flex: 1, display: "flex", padding: 18, gap: 16 }}>
        {/* Left Input Pane */}
        <div
          style={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* URL Input Box */}
          <div
            style={{
              backgroundColor: THEME.card,
              borderRadius: 14,
              padding: "16px 14px",
              border: `1px solid ${t >= BEATS.urlType && t < BEATS.summarize ? THEME.accent : "rgba(124,92,252,0.15)"}`,
              boxShadow: t >= BEATS.urlType && t < BEATS.summarize ? "0 0 20px rgba(124,92,252,0.2)" : "none",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, color: THEME.muted, letterSpacing: 1, marginBottom: 8 }}>
              ARTICLE URL
            </div>
            <div
              style={{
                height: 36,
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                fontSize: 11,
                color: "#FFFFFF",
                fontFamily: fonts.mono,
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {url}
              <span
                style={{
                  width: 2,
                  height: 14,
                  backgroundColor: THEME.accent,
                  opacity: t >= BEATS.urlType && t < BEATS.summarize ? (Math.floor(frame / (fps * 0.35)) % 2 === 0 ? 1 : 0) : 0,
                  marginLeft: 2,
                }}
              />
            </div>
          </div>

          {/* Model Options */}
          <div
            style={{
              backgroundColor: THEME.card,
              borderRadius: 14,
              padding: "14px 14px",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, color: THEME.muted, letterSpacing: 1 }}>
              SUMMARY MODE
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Executive Bullets", "Deep Dive", "Key Takeaways"].map((mode, i) => (
                <div
                  key={mode}
                  style={{
                    flex: 1,
                    padding: "6px 4px",
                    borderRadius: 6,
                    fontSize: 9,
                    fontWeight: 700,
                    textAlign: "center",
                    backgroundColor: i === 0 ? "rgba(124,92,252,0.2)" : "rgba(255,255,255,0.03)",
                    color: i === 0 ? THEME.accentLight : THEME.muted,
                    border: `1px solid ${i === 0 ? THEME.accent : "rgba(255,255,255,0.04)"}`,
                  }}
                >
                  {mode}
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div
            style={{
              height: 42,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${THEME.accent}, #9333EA)`,
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(124,92,252,0.35)",
              transform: `scale(${btnScale})`,
              cursor: "pointer",
            }}
          >
            {isLoading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: 999 }} />
                Extracting & Analyzing...
              </span>
            ) : (
              "✦ Generate Instant Summary"
            )}
          </div>
        </div>

        {/* Right Output Pane */}
        <div
          style={{
            flex: 1,
            backgroundColor: THEME.card,
            borderRadius: 16,
            border: "1px solid rgba(124,92,252,0.15)",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Article Header info */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF" }}>The AI Code Revolution</div>
              <div style={{ fontSize: 9, color: THEME.muted, marginTop: 2 }}>techblog.dev · 8 min read · Published Today</div>
            </div>
            <span style={{ fontSize: 10, color: THEME.accentLight, fontWeight: 700, padding: "3px 10px", borderRadius: 999, backgroundColor: "rgba(124,92,252,0.12)" }}>
              {showResult ? "✓ Ready" : "Awaiting Input"}
            </span>
          </div>

          {/* Loading Progress */}
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "20px 0" }}>
              <div style={{ height: 4, width: "100%", borderRadius: 4, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${interpolate(t, [BEATS.loading, BEATS.result], [10, 100], CLAMP)}%`,
                    background: `linear-gradient(90deg, ${THEME.accent}, #C084FC)`,
                  }}
                />
              </div>
              <div style={{ fontSize: 10, color: THEME.muted, textAlign: "center" }}>Synthesizing key insights with GPT-4...</div>
            </div>
          )}

          {/* Summary Result */}
          {showResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, ...popIn(t, BEATS.result, 0.25) }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: THEME.accentLight, letterSpacing: 1 }}>EXECUTIVE SUMMARY</div>
              <div style={{ fontSize: 12, lineHeight: 1.65, color: THEME.text }}>
                {summaryText}
                {t < BEATS.result + 1.2 && (
                  <span style={{ display: "inline-block", width: 2, height: 12, backgroundColor: THEME.accentLight, marginLeft: 2 }} />
                )}
              </div>

              {/* Key points with animated entry */}
              {t >= BEATS.keyPoints && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: THEME.muted, letterSpacing: 1 }}>KEY TAKEAWAYS</div>
                  {KEY_POINTS.map((point, i) => (
                    <div
                      key={point}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 11,
                        color: "#FFFFFF",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        padding: "7px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.05)",
                        ...popIn(t, BEATS.keyPoints + 0.08 * i, 0.2),
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          backgroundColor: "rgba(74,222,128,0.18)",
                          color: THEME.success,
                          fontSize: 10,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✓
                      </span>
                      {point}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animated Mouse Cursor */}
      {t >= BEATS.urlType - 0.2 && t <= BEATS.result + 0.5 && (
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            pointerEvents: "none",
            zIndex: 100,
            transform: `scale(${cursorClick ? 0.85 : 1})`,
            transition: "transform 0.08s ease",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
