import { interpolate } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, easeOut } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { BEATS, STOPS, STUDENTS, THEME } from "./data";

function MapView({ t }: { t: number }) {
  const busProgress = interpolate(t, [BEATS.busMove, BEATS.end], [0.35, 0.65], { ...CLAMP, easing: easeOut });
  const pulse = Math.sin(t * 7) * 0.5 + 0.5;

  const busX = 60 + busProgress * 460;
  const busY = 420 - busProgress * 340;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SCENE.width - 230,
        height: SCENE.height,
        backgroundColor: "#EBF3FF",
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

      {/* Top Map HUD */}
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 14,
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 10,
            fontWeight: 800,
            color: THEME.accent,
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "#22C55E", boxShadow: "0 0 6px #22C55E" }} />
          GPS ACTIVE
        </div>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 10,
            fontWeight: 700,
            color: THEME.text,
            boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
            fontFamily: fonts.mono,
          }}
        >
          ⚡ 38 KM/H
        </div>
        <div
          style={{
            backgroundColor: "rgba(34,197,94,0.12)",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 10,
            fontWeight: 800,
            color: "#16A34A",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          🟢 TRAFFIC CLEAR
        </div>
      </div>

      {/* Road path */}
      <svg width={SCENE.width - 230} height={SCENE.height} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* Background track */}
        <path
          d="M 60 420 Q 180 380 240 280 Q 300 180 420 160 Q 500 140 520 80"
          fill="none"
          stroke="rgba(37,99,235,0.25)"
          strokeWidth={6}
          strokeDasharray="10 8"
        />
        {/* Active completed route */}
        <path
          d="M 60 420 Q 180 380 240 280 Q 300 180 420 160 Q 500 140 520 80"
          fill="none"
          stroke={THEME.accent}
          strokeWidth={6}
          strokeDasharray={`${busProgress * 620} 620`}
        />
      </svg>

      {/* Pulsing Radar Wave around Bus */}
      <div
        style={{
          position: "absolute",
          left: busX,
          top: busY,
          width: 54 + pulse * 24,
          height: 54 + pulse * 24,
          borderRadius: 999,
          backgroundColor: `rgba(249,115,22,${0.25 - pulse * 0.15})`,
          border: `1.5px solid rgba(249,115,22,${0.6 - pulse * 0.4})`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Bus Marker */}
      <div
        style={{
          position: "absolute",
          left: busX,
          top: busY,
          width: 32,
          height: 32,
          borderRadius: 999,
          backgroundColor: THEME.orange,
          border: "3px solid #FFFFFF",
          boxShadow: `0 4px 16px rgba(249,115,22,0.5)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          transform: "translate(-50%, -50%)",
          zIndex: 5,
        }}
      >
        🚌
      </div>

      {/* Route Stop markers */}
      {STOPS.map((stop, i) => {
        const x = 60 + (i / (STOPS.length - 1)) * 460;
        const y = 420 - (i / (STOPS.length - 1)) * 340;
        const isCompleted = stop.status === "completed" || stop.status === "departed";
        return (
          <div
            key={stop.name}
            style={{
              position: "absolute",
              left: x - 7,
              top: y - 7,
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: isCompleted ? THEME.green : stop.status === "current" ? THEME.accent : "#CBD5E1",
              border: "2px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 4,
              ...popIn(t, BEATS.mapLoad + 0.06 * i, 0.2),
            }}
          />
        );
      })}

      {/* Floating ETA badge */}
      {t >= BEATS.eta && (
        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 18,
            backgroundColor: THEME.card,
            borderRadius: 14,
            padding: "12px 16px",
            boxShadow: "0 12px 32px rgba(15,23,42,0.15)",
            border: "1px solid rgba(37,99,235,0.12)",
            zIndex: 10,
            ...popIn(t, BEATS.eta, 0.25),
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 800, color: THEME.muted, letterSpacing: 1 }}>ESTIMATED ARRIVAL</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: THEME.accent, marginTop: 4, fontFamily: fonts.mono }}>
            8:05 AM
          </div>
          <div style={{ fontSize: 10, color: THEME.muted, marginTop: 2, fontWeight: 600 }}>12 mins · 2.4 km away</div>
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

      {/* Right Sidebar — Route & Passengers */}
      <div
        style={{
          width: 230,
          backgroundColor: THEME.card,
          borderLeft: "1px solid rgba(15,23,42,0.08)",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(15,23,42,0.06)", paddingBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🚌</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: THEME.text }}>Fleet Bus #12A</div>
              <div style={{ fontSize: 9, color: THEME.green, fontWeight: 800 }}>● EN ROUTE</div>
            </div>
          </div>
          <span style={{ fontSize: 10, fontFamily: fonts.mono, color: THEME.muted, fontWeight: 700 }}>38/40 Seats</span>
        </div>

        {/* Route stops */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: THEME.muted, letterSpacing: 1, marginBottom: 6 }}>
            ROUTE SCHEDULE
          </div>
          {STOPS.map((stop, i) => (
            <div
              key={stop.name}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                paddingBottom: 7,
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
                      height: 16,
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
                <div style={{ fontSize: 8, color: THEME.muted }}>{stop.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notification Popup */}
        {t >= BEATS.notification && (
          <div
            style={{
              backgroundColor: "rgba(37,99,235,0.06)",
              borderRadius: 10,
              padding: "10px 12px",
              border: "1px solid rgba(37,99,235,0.15)",
              boxShadow: "0 4px 12px rgba(37,99,235,0.08)",
              ...popIn(t, BEATS.notification, 0.25),
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, color: THEME.accent, display: "flex", alignItems: "center", gap: 4 }}>
              🔔 PARENT ALERT
            </div>
            <div style={{ fontSize: 10, color: THEME.text, marginTop: 4, lineHeight: 1.35, fontWeight: 500 }}>
              Bus approaching Market Circle. Aarav&apos;s stop is next!
            </div>
          </div>
        )}

        {/* Students Check-in status */}
        {t >= BEATS.statusUpdate && (
          <div style={{ marginTop: "auto" }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: THEME.muted, letterSpacing: 1, marginBottom: 6 }}>
              STUDENT BOARDING
            </div>
            {STUDENTS.map((s, i) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 5,
                  padding: "4px 6px",
                  borderRadius: 6,
                  backgroundColor: "#F8FAFC",
                  ...popIn(t, BEATS.statusUpdate + 0.08 * i, 0.2),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 999,
                      backgroundColor: THEME.accent,
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: THEME.text }}>{s.name}</div>
                    <div style={{ fontSize: 8, color: THEME.muted }}>{s.stop}</div>
                  </div>
                </div>
                <span style={{ fontSize: 8, fontWeight: 700, color: THEME.green }}>✓ Boarded</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
