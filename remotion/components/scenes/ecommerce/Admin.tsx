import { fonts } from "../../../fonts";
import { countUp, inr } from "../../../utils/motion";
import { popIn } from "../shared";
import { BEATS, TRIO } from "./data";

const NAV = ["Dashboard", "Orders", "Products", "Customers", "Shipping", "GST Reports"];

const ORDERS = [
  { id: "#8F2KX", customer: "Saransh K.", amount: "₹1,299", status: "Paid", color: "#1F7A4D", bg: "#E3F4EA" },
  { id: "#8F2KW", customer: "Priya S.", amount: "₹2,148", status: "Shipped", color: "#1F5FBF", bg: "#E4EDFB" },
  { id: "#8F2KV", customer: "Arjun M.", amount: "₹649", status: "Delivered", color: "#5B0F14", bg: "#F6E6E7" },
  { id: "#8F2KU", customer: "Neha R.", amount: "₹3,499", status: "Packed", color: "#8A5A00", bg: "#FBF0D4" },
];

/** Admin management: KPIs counting up and live orders streaming in. */
export function AdminScreen({ t }: { t: number }) {
  const a = BEATS.admin;
  const kpis = [
    { label: "Revenue today", value: inr(countUp(t, a + 0.1, 1.1, 248560)) },
    { label: "Orders", value: String(countUp(t, a + 0.15, 1.1, 128)) },
    { label: "To ship", value: String(countUp(t, a + 0.2, 1.1, 14)) },
    { label: "GST collected", value: inr(countUp(t, a + 0.25, 1.1, 37920)) },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", fontFamily: fonts.sans, backgroundColor: "#F6F2EE" }}>
      <div style={{ width: 150, backgroundColor: TRIO.deep, padding: "18px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
          TRIO <span style={{ color: TRIO.gold }}>Admin</span>
        </div>
        {NAV.map((item) => (
          <div
            key={item}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "7px 10px",
              borderRadius: 7,
              color: item === "Orders" ? TRIO.deep : "rgba(255,255,255,0.72)",
              backgroundColor: item === "Orders" ? TRIO.gold : "transparent",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: TRIO.deep, letterSpacing: -0.3 }}>Orders · Live</div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {kpis.map((k, i) => (
            <div
              key={k.label}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: "10px 12px",
                border: "1px solid rgba(74,13,18,0.08)",
                ...popIn(t, a + i * 0.06),
              }}
            >
              <div style={{ fontSize: 9, color: "#7A6A66", fontWeight: 600 }}>{k.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111", marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, backgroundColor: "#fff", borderRadius: 12, border: "1px solid rgba(74,13,18,0.08)", overflow: "hidden" }}>
          <div style={{ display: "flex", padding: "9px 14px", fontSize: 9, fontWeight: 700, color: "#7A6A66", letterSpacing: 0.6, backgroundColor: "#FBF7F1" }}>
            <span style={{ width: 90 }}>ORDER</span>
            <span style={{ flex: 1 }}>CUSTOMER</span>
            <span style={{ width: 90 }}>AMOUNT</span>
            <span style={{ width: 80 }}>STATUS</span>
          </div>
          {ORDERS.map((o, i) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "11px 14px",
                fontSize: 11,
                borderTop: "1px solid rgba(74,13,18,0.06)",
                ...popIn(t, a + 0.3 + i * 0.14, 0.3),
              }}
            >
              <span style={{ width: 90, fontFamily: fonts.mono, fontWeight: 700 }}>{o.id}</span>
              <span style={{ flex: 1, color: "#333" }}>{o.customer}</span>
              <span style={{ width: 90, fontWeight: 700 }}>{o.amount}</span>
              <span style={{ width: 80 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: o.color, backgroundColor: o.bg, padding: "3px 8px", borderRadius: 999 }}>{o.status}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
