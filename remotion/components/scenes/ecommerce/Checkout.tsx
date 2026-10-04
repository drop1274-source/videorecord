import { Img, interpolate, staticFile } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, typed } from "../../../utils/motion";
import { popIn } from "../shared";
import { BEATS, TRIO } from "./data";
import { TrioHeader } from "./Storefront";

const FIELDS = [
  { label: "Full name", value: "Saransh Kumar" },
  { label: "Phone", value: "+91 98765 43210" },
  { label: "Address", value: "14, Connaught Place, New Delhi 110001" },
];

const ROWS: [string, string][] = [
  ["Subtotal", "₹1,299"],
  ["Shipping", "FREE"],
  ["GST (incl.)", "₹198"],
];

/** Front-end: the checkout page filling itself in, then "Place order". */
export function CheckoutScreen({ t }: { t: number }) {
  const pressed = interpolate(t, [BEATS.placeOrder, BEATS.placeOrder + 0.08, BEATS.placeOrder + 0.2], [1, 0.94, 1], CLAMP);

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: TRIO.cream, fontFamily: fonts.sans }}>
      <TrioHeader t={t} cartCount={1} query={BEATS.query} />
      <div style={{ position: "absolute", left: 24, top: 60, fontSize: 18, fontWeight: 800, color: TRIO.deep, letterSpacing: -0.4 }}>
        Checkout
      </div>

      <div
        style={{
          position: "absolute",
          left: 24,
          top: 94,
          width: 456,
          height: 78,
          borderRadius: 12,
          backgroundColor: "#fff",
          border: "1px solid rgba(74,13,18,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 12px",
          ...popIn(t, BEATS.frontEnd),
        }}
      >
        <Img src={staticFile("products/zardosi-patch.jpg")} style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TRIO.deep }}>Zardosi Peacock Patch</div>
          <div style={{ fontSize: 10, color: "#7A6A66", marginTop: 3 }}>Gold zari · Qty 1</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 800 }}>₹1,299</div>
      </div>

      {FIELDS.map((f, i) => {
        const at = BEATS.frontEnd + 0.1 + i * 0.22;
        return (
          <div key={f.label} style={{ position: "absolute", left: 24, top: 188 + i * 52, width: 456, ...popIn(t, at, 0.25) }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#7A6A66", letterSpacing: 0.6 }}>{f.label.toUpperCase()}</div>
            <div
              style={{
                marginTop: 4,
                height: 28,
                borderRadius: 7,
                backgroundColor: "#fff",
                border: `1px solid ${t > at && t < at + 0.5 ? TRIO.gold : "rgba(74,13,18,0.12)"}`,
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                fontSize: 11,
                color: "#222",
              }}
            >
              {typed(f.value, t, at + 0.05, 60)}
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 500,
          top: 94,
          width: 268,
          borderRadius: 12,
          backgroundColor: "#fff",
          border: "1px solid rgba(74,13,18,0.08)",
          padding: 16,
          ...popIn(t, BEATS.frontEnd + 0.1),
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: TRIO.deep, marginBottom: 10 }}>Order summary</div>
        {ROWS.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#4B3B37", marginTop: 7 }}>
            <span>{k}</span>
            <span style={{ fontWeight: 600, color: v === "FREE" ? "#1F7A4D" : "#222" }}>{v}</span>
          </div>
        ))}
        <div style={{ height: 1, backgroundColor: "rgba(74,13,18,0.1)", margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800 }}>
          <span>Total</span>
          <span>₹1,299</span>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 34,
            borderRadius: 8,
            backgroundColor: TRIO.maroon,
            color: "#fff",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${pressed})`,
          }}
        >
          PLACE ORDER →
        </div>
      </div>
    </div>
  );
}
