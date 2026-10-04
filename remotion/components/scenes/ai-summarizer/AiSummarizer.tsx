import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, easeOut, typed } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { BEATS, KEY_POINTS, SUMMARY_TEXT, THEME } from "./data";

function ProgressBar({ t }: { t: number }) {
  const progress = interpolate(t, [BEATS.loading, BEATS.result], [0, 1], { ...CLAMP, easing: easeOut });
  return (
    <div
      style={{
        width: "100%",
        height: 4,
        borderRadius: 4,
        backgroundColor: "rgba(124,92,252,0.15)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          borderRadius: 4,
          background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.accentLight})`,
        }}
      />
    </div>
  );
}

export function AiSummarizerScreen({ t }: { t: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const url = typed("https://techblog.dev/ai-code-revolution", t, BEATS.urlType, 42);
  const showResult = t >= BEATS.result;
  const summaryText = showResult ? typed(SUMMARY_TEXT, t, BEATS.result, 80) : "";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: THEME.bg,
        fontFamily: fonts.sans,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SCENE.width,
          height: 44,
          backgroundColor: THEME.card,
          borderBottom: `1px solid rgba(124,92,252,0.12)`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 800, color: THEME.accentLight, letterSpacing: -0.3 }}>
          ✦ AI Summarizer
        </span>
        <span style={{ fontSize: 10, color: THEME.muted }}>Powered by GPT-4</span>
      </div>

      {/* URL Input */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          width: SCENE.width - 160,
          ...popIn(t, BEATS.start),
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: THEME.muted, letterSpacing: 1, marginBottom: 8 }}>
          PASTE ARTICLE URL
        </div>
        <div
          style={{
            height: 38,
            borderRadius: 10,
            backgroundColor: THEME.card,
            border: `1px solid ${t >= BEATS.urlType && t < BEATS.summarize ? THEME.accent : "rgba(124,92,252,0.15)"}`,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            fontSize: 12,
            color: THEME.text,
            fontFamily: fonts.mono,
          }}
        >
          {url}
          <span
            style={{
              width: 1.5,
              height: 14,
              backgroundColor: THEME.accent,
              opacity: t >= BEATS.urlType && t < BEATS.summarize ? (Math.floor(frame / (fps * 0.4)) % 2 === 0 ? 1 : 0) : 0,
              marginLeft: 1,
            }}
          />
        </div>
      </div>

      {/* Summarize Button */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 148,
          ...popIn(t, BEATS.paste + 0.1),
        }}
      >
        <div
          style={{
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.accentLight})`,
            color: "#fff",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 28px",
            boxShadow: `0 8px 24px rgba(124,92,252,0.3)`,
            transform: `scale(${interpolate(t, [BEATS.summarize, BEATS.summarize + 0.08, BEATS.summarize + 0.2], [1, 0.93, 1], CLAMP)})`,
          }}
        >
          Summarize →
        </div>
      </div>

      {/* Loading bar */}
      {t >= BEATS.loading && t < BEATS.result + 0.5 && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 204,
            width: SCENE.width - 160,
            ...popIn(t, BEATS.loading),
          }}
        >
          <ProgressBar t={t} />
          <div style={{ fontSize: 10, color: THEME.muted, marginTop: 6 }}>
            {showResult ? "Analysis complete ✓" : "Analyzing article..."}
          </div>
        </div>
      )}

      {/* Summary result */}
      {showResult && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 236,
            width: SCENE.width - 160,
            ...popIn(t, BEATS.result),
          }}
        >
          <div
            style={{
              backgroundColor: THEME.card,
              borderRadius: 14,
              padding: "16px 18px",
              border: `1px solid rgba(124,92,252,0.12)`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: THEME.accent, letterSpacing: 1, marginBottom: 8 }}>
              SUMMARY
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.6, color: THEME.text }}>{summaryText}</div>
          </div>
        </div>
      )}

      {/* Key Points */}
      {t >= BEATS.keyPoints && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 370,
            width: SCENE.width - 160,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: THEME.muted, letterSpacing: 1 }}>KEY POINTS</div>
          {KEY_POINTS.map((point, i) => (
            <div
              key={point}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 11,
                color: THEME.text,
                ...popIn(t, BEATS.keyPoints + 0.08 * i, 0.25),
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  backgroundColor: "rgba(74,222,128,0.12)",
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
  );
}
