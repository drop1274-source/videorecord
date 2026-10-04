import { interpolate } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, easeOut } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { BEATS, STOPS, STUDENTS, THEME } from "./data";

function MapView({ t }: { t: number }) {
  const busProgress = interpolate(t, [BEATS.busMove, BEATS.end], [0.35, 0.65], { ...CLAMP, easing: easeOut });
  const pulse = Math.sin(t * 6) * 0.5 + 0.5;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SCENE.width - 220,
        height: SCENE.height,
        backgroundColor: "#E8F0FE",
        overflow: "hidden",
      }}
    >
      {/* Map grid lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`h-${i}`}
          style={{
            position: "absolute",
            left: 0,
            top: i * 48,
            width: "100%",
            height: 1,
            backgroundColor: "rgba(37,99,235,0.06)",
          }}
        />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={`v-${i}`}
          style={{
            position: "absolute",
            left: i * 48,
            top: 0,
            height: "100%",
            width: 1,
            backgroundColor: "rgba(37,99,235,0.06)",
          }}
        />
      ))}

      {/* Road path */}
      <svg width={SCENE.width - 220} height={SCENE.height} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d="M 60 420 Q 180 380 240 280 Q 300 180 420 160 Q 500 140 520 80"
          fill="none"
          stroke="rgba(37,99,235,0.2)"
          strokeWidth={4}
          strokeDasharray="8 6"
        />
        <path
          d={`M 60 420 Q 180 380 240 280 Q 300 180 420 160 Q 500 140 520 80`}
          fill="none"
          stroke={THEME.accent}
          strokeWidth={4}
          strokeDasharray={`${busProgress * 600} 600`}
        />
      </svg>

      {/* Bus dot */}
      <div
        style={{
          position: "absolute",
          left: 60 + busProgress * 460,
          top: 420 - busProgress * 340,
          width: 28,
          height: 28,
          borderRadius: 999,
          backgroundColor: THEME.orange,
          border: "3px solid #fff",
          boxShadow: `0 0 ${12 + pulse * 8}px rgba(249,115,22,${0.3 + pulse * 0.2})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          transform: "translate(-50%, -50%)",
        }}
      >
        🚌
      </div>

      {/* Stop markers */}
      {STOPS.map((stop, i) => {
        const x = 60 + (i / (STOPS.length - 1)) * 460;
        const y = 420 - (i / (STOPS.length - 1)) * 340;
        const isCompleted = stop.status === "completed" || stop.status === "departed";
        return (
          <div
            key={stop.name}
            style={{
              position: "absolute",
              left: x - 6,
              top: y - 6,
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: isCompleted ? THEME.green : stop.status === "current" ? THEME.accent : "#CBD5E1",
              border: "2px solid #fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              ...popIn(t, BEATS.mapLoad + 0.06 * i, 0.2),
            }}
          />
        );
      })}

      {/* ETA badge */}
      {t >= BEATS.eta && (
        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            backgroundColor: THEME.card,
            borderRadius: 12,
            padding: "10px 14px",
            boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
            border: "1px solid rgba(37,99,235,0.1)",
            ...popIn(t, BEATS.eta),
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 700, color: THEME.muted, letterSpacing: 1 }}>ESTIMATED ARRIVAL</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: THEME.accent, marginTop: 4, fontFamily: fonts.mono }}>
            8:05 AM
          </div>
          <div style={{ fontSize: 10, color: THEME.muted, marginTop: 2 }}>12 mins away</div>
        </div>
      )}
    </div>
  );
}

export function SchoolBusScreen({ t }: { t: number }) {
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
      <MapView t={t} />

      {/* Right sidebar */}
      <div
        style={{
          width: 220,
          backgroundColor: THEME.card,
          borderLeft: "1px solid rgba(15,23,42,0.08)",
          padding: "14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🚌</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: THEME.text }}>Bus #12A</div>
            <div style={{ fontSize: 9, color: THEME.green, fontWeight: 700 }}>● LIVE</div>
          </div>
        </div>

        {/* Route stops */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: THEME.muted, letterSpacing: 1, marginBottom: 6 }}>ROUTE</div>
          {STOPS.map((stop, i) => (
            <div
              key={stop.name}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                paddingBottom: 8,
                marginBottom: i < STOPS.length - 1 ? 0 : 0,
                ...popIn(t, BEATS.mapLoad + 0.05 * i, 0.2),
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 14 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    backgroundColor:
                      stop.status === "completed" || stop.status === "departed"
                        ? THEME.green
                        : stop.status === "current"
                          ? THEME.accent
                          : "#E2E8F0",
                    border: stop.status === "current" ? `2px solid rgba(37,99,235,0.3)` : "none",
                  }}
                />
                {i < STOPS.length - 1 && (
                  <div
                    style={{
                      width: 1.5,
                      height: 18,
                      backgroundColor:
                        stop.status === "completed" || stop.status === "departed" ? THEME.green : "#E2E8F0",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: stop.status === "current" ? 800 : 600,
                    color: stop.status === "current" ? THEME.accent : THEME.text,
                  }}
                >
                  {stop.name}
                </div>
                <div style={{ fontSize: 9, color: THEME.muted }}>{stop.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notification popup */}
        {t >= BEATS.notification && (
          <div
            style={{
              backgroundColor: "rgba(37,99,235,0.06)",
              borderRadius: 10,
              padding: "10px 12px",
              border: "1px solid rgba(37,99,235,0.12)",
              ...popIn(t, BEATS.notification),
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, color: THEME.accent }}>🔔 NOTIFICATION</div>
            <div style={{ fontSize: 10, color: THEME.text, marginTop: 4, lineHeight: 1.4 }}>
              Bus approaching Market Circle. Aarav&apos;s stop is next!
            </div>
          </div>
        )}

        {/* Students */}
        {t >= BEATS.statusUpdate && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: THEME.muted, letterSpacing: 1, marginBottom: 6 }}>
              STUDENTS
            </div>
            {STUDENTS.map((s, i) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 6,
                  ...popIn(t, BEATS.statusUpdate + 0.1 * i, 0.2),
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    backgroundColor: THEME.accent,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: THEME.text }}>{s.name}</div>
                  <div style={{ fontSize: 8, color: THEME.muted }}>{s.stop}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
