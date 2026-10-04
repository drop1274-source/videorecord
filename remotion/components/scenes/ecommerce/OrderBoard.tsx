import type { CSSProperties, ReactNode } from "react";
import { interpolate } from "remotion";
import { fonts } from "../../../fonts";
import { CLAMP, easeOut, typed } from "../../../utils/motion";
import { popIn } from "../shared";
import { BEATS, TRIO } from "./data";

/** Card rects inside the order board — also used by the camera to zoom onto each one. */
export const BOARD = {
  backEnd: { x: 24, y: 24, w: 360, h: 220 },
  payments: { x: 408, y: 24, w: 360, h: 220 },
  shipping: { x: 24, y: 264, w: 360, h: 204 },
  gst: { x: 408, y: 264, w: 360, h: 204 },
} as const;

type Rect = (typeof BOARD)[keyof typeof BOARD];

function Card({ rect, t, at, dark, children }: { rect: Rect; t: number; at: number; dark?: boolean; children: ReactNode }) {
  const active = t >= at;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: 14,
        padding: 16,
        boxSizing: "border-box",
        backgroundColor: dark ? "#14100F" : "#FFFFFF",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(74,13,18,0.1)",
        boxShadow: active ? "0 14px 34px rgba(42,7,9,0.14)" : "none",
        ...popIn(t, at - 0.15),
      }}
    >
      {children}
    </div>
  );
}

const tag = (color: string, bg: string): CSSProperties => ({
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: 1,
  color,
  backgroundColor: bg,
  padding: "3px 7px",
  borderRadius: 5,
});

const LOGS = [
  { text: "POST /api/orders", color: "#F5C451" },
  { text: "→ validate cart · stock reserved", color: "#A7A29F" },
  { text: "db.orders.insert({ total: 1299 })", color: "#E9E4E1" },
  { text: "201 Created  order_8F2KX", color: "#5FD38D" },
  { text: "queue → email.confirmation ✓", color: "#A7A29F" },
];

const TRACK = ["Ordered", "Packed", "Shipped", "Delivered"];

const GST_ROWS: [string, string][] = [
  ["Taxable value", "₹1,100.85"],
  ["CGST @ 9%", "₹99.08"],
  ["SGST @ 9%", "₹99.07"],
];

export function OrderBoardScreen({ t }: { t: number }) {
  const paid = t >= BEATS.paid;
  const trackFill = interpolate(t, [BEATS.shipping + 0.05, BEATS.shipping + 0.45], [0, 2 / 3], { ...CLAMP, easing: easeOut });

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: "#F3EEE8", fontFamily: fonts.sans }}>
      <Card rect={BOARD.backEnd} t={t} at={BEATS.backEnd} dark>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={tag("#F5C451", "rgba(245,196,81,0.14)")}>BACK-END · API</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: "#7D7774" }}>node · postgres</span>
        </div>
        <div style={{ marginTop: 14, fontFamily: fonts.mono, fontSize: 11, lineHeight: 1.75 }}>
          {LOGS.map((l, i) => (
            <div key={l.text} style={{ color: l.color, whiteSpace: "nowrap" }}>
              {typed(l.text, t, BEATS.backEnd + 0.12 + i * 0.16, 90)}
            </div>
          ))}
        </div>
      </Card>

      <Card rect={BOARD.payments} t={t} at={BEATS.payments}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={tag(TRIO.maroon, "rgba(91,15,20,0.08)")}>PAYMENTS</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#3366FF" }}>Razorpay · UPI</span>
        </div>
        <div style={{ marginTop: 18, fontSize: 10, color: "#7A6A66" }}>Amount payable</div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, color: "#111" }}>₹1,299.00</div>
        <div
          style={{
            marginTop: 18,
            height: 44,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 800,
            color: "#fff",
            backgroundColor: paid ? "#1F7A4D" : TRIO.maroon,
          }}
        >
          {paid ? "✓ Payment successful" : "Pay ₹1,299"}
        </div>
      </Card>

      <Card rect={BOARD.shipping} t={t} at={BEATS.shipping}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={tag("#1F5FBF", "rgba(31,95,191,0.08)")}>SHIPPING</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: "#7A6A66" }}>AWB SR-48213097</span>
        </div>
        <div style={{ position: "relative", marginTop: 34, height: 60 }}>
          <div style={{ position: "absolute", left: 12, right: 12, top: 9, height: 3, backgroundColor: "#E7E1DB", borderRadius: 3 }} />
          <div
            style={{
              position: "absolute",
              left: 12,
              top: 9,
              height: 3,
              width: `calc((100% - 24px) * ${trackFill})`,
              backgroundColor: "#1F5FBF",
              borderRadius: 3,
            }}
          />
          {TRACK.map((step, i) => {
            const reached = trackFill >= i / 3 - 0.001 && t >= BEATS.shipping;
            return (
              <div
                key={step}
                style={{
                  position: "absolute",
                  left: `calc(12px + (100% - 24px) * ${i / 3})`,
                  top: 0,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    backgroundColor: reached ? "#1F5FBF" : "#fff",
                    border: `2px solid ${reached ? "#1F5FBF" : "#D9D1C9"}`,
                    color: "#fff",
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {reached ? "✓" : ""}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: reached ? "#111" : "#9A8F89" }}>{step}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, fontSize: 11, color: "#4B3B37" }}>
          Out for delivery via <b>Delhivery</b> · ETA 2 days
        </div>
      </Card>

      <Card rect={BOARD.gst} t={t} at={BEATS.gst}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={tag("#8A5A00", "rgba(201,162,39,0.16)")}>GST INVOICE</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: "#7A6A66" }}>GSTIN 07AAJFT1234K1Z5</span>
        </div>
        <div style={{ marginTop: 14 }}>
          {GST_ROWS.map(([k, v], i) => (
            <div
              key={k}
              style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#4B3B37", marginTop: 8, ...popIn(t, BEATS.gst + 0.08 * i, 0.25) }}
            >
              <span>{k}</span>
              <span style={{ fontFamily: fonts.mono, fontWeight: 700, color: "#111" }}>{v}</span>
            </div>
          ))}
          <div style={{ height: 1, backgroundColor: "rgba(74,13,18,0.12)", margin: "12px 0 8px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, ...popIn(t, BEATS.gst + 0.3, 0.25) }}>
            <span>Invoice total</span>
            <span style={{ fontFamily: fonts.mono }}>₹1,299.00</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
