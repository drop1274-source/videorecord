import { interpolate } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, countUp, easeOut, inr } from "../../../utils/motion";
import { popIn, SCENE } from "../shared";
import { ACTIVITIES, BEATS, NAV, PIPELINE, THEME } from "./data";

export function CrmErpScreen({ t }: { t: number }) {
  const dealMoveProgress = interpolate(t, [BEATS.dealMove, BEATS.dealMove + 0.45], [0, 1], { ...CLAMP, easing: easeOut });
  const showToast = t >= BEATS.dealMove + 0.15;

  const kpis = [
    { label: "Revenue", value: inr(countUp(t, BEATS.kpis, 1.2, 1248000)), change: "+18.4%", color: THEME.green },
    { label: "Active Deals", value: String(countUp(t, BEATS.kpis + 0.05, 1.2, 30)), change: "8 High Priority", color: THEME.accent },
    { label: "Won Deals", value: String(countUp(t, BEATS.kpis + 0.1, 1.2, 8)), change: "₹38.5L Value", color: THEME.blue },
    { label: "Invoices Due", value: String(countUp(t, BEATS.kpis + 0.15, 1.2, 5)), change: "3 Overdue", color: THEME.orange },
  ];

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
      {/* Sidebar */}
      <div
        style={{
          width: 150,
          backgroundColor: THEME.sidebar,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${THEME.accent}, #4338CA)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#fff",
              fontWeight: 900,
            }}
          >
            ✦
          </div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#fff", letterSpacing: -0.2 }}>
            <span style={{ color: THEME.accent }}>CRM</span>·ERP
          </div>
        </div>

        {NAV.map((item) => (
          <div
            key={item}
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "7px 10px",
              borderRadius: 7,
              color: item === "Dashboard" ? "#fff" : "rgba(255,255,255,0.6)",
              backgroundColor: item === "Dashboard" ? "rgba(99,102,241,0.3)" : "transparent",
              border: item === "Dashboard" ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{item === "Dashboard" ? "⊞" : item === "Deals" ? "◈" : item === "Invoices" ? "📄" : "•"}</span>
            {item}
          </div>
        ))}

        <div style={{ marginTop: "auto", padding: "10px 8px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
          <div style={{ fontSize: 8, color: THEME.green, fontWeight: 800 }}>● 14 TEAM ONLINE</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Bangalore HQ</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: THEME.text, letterSpacing: -0.3 }}>
              Executive Overview
            </div>
            <div style={{ fontSize: 9, color: THEME.muted, marginTop: 1 }}>Live metrics updated 2s ago</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 9, padding: "4px 10px", borderRadius: 6, backgroundColor: "rgba(99,102,241,0.1)", color: THEME.accent, fontWeight: 800 }}>
              Q4 FY26
            </span>
            <span style={{ fontSize: 9, padding: "4px 10px", borderRadius: 6, backgroundColor: "#FFFFFF", color: THEME.text, fontWeight: 700, border: "1px solid rgba(15,23,42,0.08)" }}>
              Export PDF
            </span>
          </div>
        </div>

        {/* KPIs row */}
        <div style={{ display: "flex", gap: 10 }}>
          {kpis.map((k, i) => (
            <div
              key={k.label}
              style={{
                flex: 1,
                backgroundColor: THEME.card,
                borderRadius: 12,
                padding: "11px 13px",
                border: "1px solid rgba(15,23,42,0.06)",
                boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
                ...popIn(t, BEATS.kpis + 0.05 * i),
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: THEME.muted, letterSpacing: 0.8 }}>
                  {k.label.toUpperCase()}
                </span>
                <span style={{ fontSize: 8, fontWeight: 700, color: k.color }}>{k.change}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: k.color, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Area */}
        {t >= BEATS.pipeline && (
          <div
            style={{
              backgroundColor: THEME.card,
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(15,23,42,0.06)",
              boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
              position: "relative",
              ...popIn(t, BEATS.pipeline, 0.25),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: THEME.text }}>Active Sales Pipeline (Kanban Flow)</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: THEME.muted }}>Total Pipeline Value: ₹48.2 Lakhs</span>
            </div>

            <div style={{ display: "flex", gap: 8, height: 96, alignItems: "flex-end" }}>
              {PIPELINE.map((stage, i) => {
                const barH = interpolate(t, [BEATS.pipeline + 0.08 * i, BEATS.pipeline + 0.08 * i + 0.35], [0, 1], {
                  ...CLAMP,
                  easing: easeOut,
                });
                return (
                  <div
                    key={stage.stage}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 800, color: stage.color }}>{stage.deals}</span>
                    <div
                      style={{
                        width: "82%",
                        height: `${barH * (22 + stage.deals * 4.5)}px`,
                        borderRadius: 6,
                        backgroundColor: stage.color,
                        opacity: 0.85,
                        boxShadow: `0 4px 12px ${stage.color}35`,
                      }}
                    />
                    <span style={{ fontSize: 8, fontWeight: 800, color: THEME.muted, textAlign: "center" }}>
                      {stage.stage}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Animated Dragging Deal Card */}
            {dealMoveProgress > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: 170 + dealMoveProgress * 125,
                  top: 55 - Math.sin(dealMoveProgress * Math.PI) * 16,
                  padding: "6px 10px",
                  borderRadius: 8,
                  backgroundColor: "#FFFFFF",
                  border: `1.5px solid ${THEME.accent}`,
                  boxShadow: "0 8px 24px rgba(99,102,241,0.25)",
                  fontSize: 9,
                  fontWeight: 800,
                  color: THEME.text,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  zIndex: 20,
                }}
              >
                <span>📦</span>
                <span>Tata Steel Deal (₹4.5L)</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom Section: Activity Feed & Invoices */}
        <div style={{ display: "flex", gap: 10, flex: 1 }}>
          {/* Activity Feed */}
          {t >= BEATS.recentActivity && (
            <div
              style={{
                flex: 1,
                backgroundColor: THEME.card,
                borderRadius: 12,
                padding: "12px 14px",
                border: "1px solid rgba(15,23,42,0.06)",
                ...popIn(t, BEATS.recentActivity, 0.2),
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, color: THEME.text, marginBottom: 8 }}>Audit Trail</div>
              {ACTIVITIES.slice(0, 3).map((a, i) => (
                <div
                  key={a.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 6,
                    fontSize: 9,
                    ...popIn(t, BEATS.recentActivity + 0.08 * i, 0.2),
                  }}
                >
                  <span style={{ fontSize: 11 }}>{a.icon}</span>
                  <span style={{ color: THEME.text, fontWeight: 600, flex: 1 }}>{a.text}</span>
                  <span style={{ fontSize: 8, color: THEME.muted }}>{a.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Invoice & Inventory widget */}
          {t >= BEATS.invoices && (
            <div
              style={{
                width: 220,
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
                <div style={{ fontSize: 8, fontWeight: 800, color: THEME.muted, letterSpacing: 0.8 }}>REVENUE RECONCILED</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: THEME.text, marginTop: 2 }}>
                  {inr(countUp(t, BEATS.invoices, 0.8, 384500))}
                </div>
                <div style={{ fontSize: 8, color: THEME.green, fontWeight: 700 }}>↑ 12% faster GST settlement</div>
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
                  <div style={{ fontSize: 8, fontWeight: 800, color: THEME.muted, letterSpacing: 0.8 }}>INVENTORY SYNC</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: THEME.text, marginTop: 2 }}>
                    {countUp(t, BEATS.inventory, 0.8, 2847)} SKUs Live
                  </div>
                  <div style={{ fontSize: 8, color: THEME.accent, fontWeight: 700 }}>● Multi-warehouse linked</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Deal Toast */}
        {showToast && (
          <div
            style={{
              position: "absolute",
              right: 18,
              bottom: 18,
              backgroundColor: "rgba(15, 23, 42, 0.94)",
              color: "#FFFFFF",
              borderRadius: 10,
              padding: "10px 16px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 10,
              fontWeight: 700,
              zIndex: 30,
              ...popIn(t, BEATS.dealMove + 0.15, 0.25),
            }}
          >
            <span style={{ fontSize: 12 }}>🎉</span>
            <span>Deal advanced to Proposal: ₹4,50,000!</span>
          </div>
        )}
      </div>
    </div>
  );
}
