import { interpolate } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, countUp, easeOut, inr } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { ACTIVITIES, BEATS, NAV, PIPELINE, THEME } from "./data";

export function CrmErpScreen({ t }: { t: number }) {
  const dealMoveX = interpolate(t, [BEATS.dealMove, BEATS.dealMove + 0.35], [0, 1], { ...CLAMP, easing: easeOut });

  const kpis = [
    { label: "Revenue", value: inr(countUp(t, BEATS.kpis, 1.2, 1248000)), color: THEME.green },
    { label: "Active Deals", value: String(countUp(t, BEATS.kpis + 0.05, 1.2, 30)), color: THEME.accent },
    { label: "Won This Month", value: String(countUp(t, BEATS.kpis + 0.1, 1.2, 8)), color: THEME.blue },
    { label: "Pending Invoices", value: String(countUp(t, BEATS.kpis + 0.15, 1.2, 5)), color: THEME.orange },
  ];

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
      {/* Sidebar */}
      <div
        style={{
          width: 140,
          backgroundColor: THEME.sidebar,
          padding: "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: -0.2 }}>
          <span style={{ color: THEME.accent }}>CRM</span> · ERP
        </div>
        {NAV.map((item) => (
          <div
            key={item}
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "6px 10px",
              borderRadius: 6,
              color: item === "Dashboard" ? "#fff" : "rgba(255,255,255,0.6)",
              backgroundColor: item === "Dashboard" ? "rgba(99,102,241,0.25)" : "transparent",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: 16, overflow: "hidden" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: THEME.text, letterSpacing: -0.3, marginBottom: 12 }}>
          Dashboard
        </div>

        {/* KPIs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {kpis.map((k, i) => (
            <div
              key={k.label}
              style={{
                flex: 1,
                backgroundColor: THEME.card,
                borderRadius: 10,
                padding: "10px 12px",
                border: "1px solid rgba(15,23,42,0.06)",
                boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
                ...popIn(t, BEATS.kpis + 0.06 * i),
              }}
            >
              <div style={{ fontSize: 8, fontWeight: 700, color: THEME.muted, letterSpacing: 0.8 }}>{k.label.toUpperCase()}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: k.color, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        {t >= BEATS.pipeline && (
          <div
            style={{
              backgroundColor: THEME.card,
              borderRadius: 12,
              padding: "12px 14px",
              border: "1px solid rgba(15,23,42,0.06)",
              marginBottom: 12,
              ...popIn(t, BEATS.pipeline),
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 800, color: THEME.text, marginBottom: 10 }}>Sales Pipeline</div>
            <div style={{ display: "flex", gap: 6, height: 90 }}>
              {PIPELINE.map((stage, i) => {
                const barH = interpolate(t, [BEATS.pipeline + 0.1 * i, BEATS.pipeline + 0.1 * i + 0.4], [0, 1], {
                  ...CLAMP,
                  easing: easeOut,
                });
                const isMoving = stage.stage === "Qualified" && dealMoveX > 0 && dealMoveX < 1;
                return (
                  <div
                    key={stage.stage}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 4,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 800, color: stage.color }}>{stage.deals}</div>
                    <div
                      style={{
                        width: "80%",
                        height: `${barH * (20 + stage.deals * 4)}px`,
                        borderRadius: 6,
                        backgroundColor: stage.color,
                        opacity: isMoving ? 0.7 : 0.85,
                        transition: "none",
                      }}
                    />
                    <div
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        color: THEME.muted,
                        textAlign: "center",
                        lineHeight: 1.2,
                      }}
                    >
                      {stage.stage}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Feed + Quick stats */}
        <div style={{ display: "flex", gap: 10 }}>
          {/* Activity */}
          {t >= BEATS.recentActivity && (
            <div
              style={{
                flex: 1,
                backgroundColor: THEME.card,
                borderRadius: 12,
                padding: "12px 14px",
                border: "1px solid rgba(15,23,42,0.06)",
                ...popIn(t, BEATS.recentActivity),
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: THEME.text, marginBottom: 8 }}>Recent Activity</div>
              {ACTIVITIES.map((a, i) => (
                <div
                  key={a.text}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginTop: 6,
                    fontSize: 10,
                    ...popIn(t, BEATS.recentActivity + 0.1 * i, 0.2),
                  }}
                >
                  <span style={{ fontSize: 12 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: THEME.text, lineHeight: 1.3 }}>{a.text}</div>
                    <div style={{ fontSize: 8, color: THEME.muted, marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick stats panel */}
          {t >= BEATS.invoices && (
            <div
              style={{
                width: 200,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  backgroundColor: THEME.card,
                  borderRadius: 10,
                  padding: "10px 12px",
                  border: "1px solid rgba(15,23,42,0.06)",
                  ...popIn(t, BEATS.invoices),
                }}
              >
                <div style={{ fontSize: 8, fontWeight: 700, color: THEME.muted, letterSpacing: 0.8 }}>INVOICES</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: THEME.text, marginTop: 4 }}>
                  {inr(countUp(t, BEATS.invoices, 0.8, 384500))}
                </div>
                <div style={{ fontSize: 9, color: THEME.green, fontWeight: 700, marginTop: 2 }}>↑ 12% this week</div>
              </div>
              {t >= BEATS.inventory && (
                <div
                  style={{
                    backgroundColor: THEME.card,
                    borderRadius: 10,
                    padding: "10px 12px",
                    border: "1px solid rgba(15,23,42,0.06)",
                    ...popIn(t, BEATS.inventory),
                  }}
                >
                  <div style={{ fontSize: 8, fontWeight: 700, color: THEME.muted, letterSpacing: 0.8 }}>INVENTORY</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: THEME.text, marginTop: 4 }}>
                    {countUp(t, BEATS.inventory, 0.8, 2847)} items
                  </div>
                  <div style={{ fontSize: 9, color: THEME.orange, fontWeight: 700, marginTop: 2 }}>3 low-stock alerts</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
