import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../../../fonts";
import { caretOn, CLAMP, typed } from "../../../utils/motion";
import { Caret, popIn, SCENE } from "../shared";
import { BEATS, PRODUCTS, TRIO } from "./data";

/** The real trioenterprises.in homepage, with the search being typed in live. */
export function HomeScreen({ t }: { t: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = SCENE.height / 900;
  const query = typed(BEATS.query, t, BEATS.typeStart, 11);

  return (
    <>
      <Img
        src={staticFile("screens/ecommerce.png")}
        style={{ position: "absolute", left: -20, top: 0, width: 1440 * s, height: SCENE.height }}
      />
      {t >= BEATS.typeStart - 0.3 ? (
        <div
          style={{
            position: "absolute",
            left: 470 * s - 20,
            top: 52 * s,
            width: 445 * s,
            height: 30 * s,
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            fontFamily: fonts.sans,
            fontSize: 10,
            fontWeight: 500,
            color: "#222",
          }}
        >
          {query}
          <Caret on={caretOn(frame, fps)} color={TRIO.maroon} height="11px" />
        </div>
      ) : null}
    </>
  );
}

export function TrioHeader({ t, cartCount, query }: { t: number; cartCount: number; query: string }) {
  const bump = interpolate(t, [BEATS.addToCart, BEATS.addToCart + 0.12, BEATS.addToCart + 0.3], [1, 1.25, 1], CLAMP);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SCENE.width,
        height: 46,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid rgba(74,13,18,0.12)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        fontFamily: fonts.sans,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: TRIO.maroon, letterSpacing: -0.2 }}>
          TRIO <span style={{ color: TRIO.gold }}>ENTERPRISES</span>
        </span>
        <span style={{ fontSize: 7, fontWeight: 700, color: TRIO.gold, letterSpacing: 1.2, marginTop: 3 }}>
          ETHNIC CRAFT GUILD
        </span>
      </div>
      <div
        style={{
          flex: 1,
          height: 26,
          borderRadius: 999,
          border: "1px solid rgba(17,17,17,0.12)",
          display: "flex",
          alignItems: "center",
          padding: "0 4px 0 12px",
          fontSize: 10,
          color: "#222",
          justifyContent: "space-between",
        }}
      >
        <span>{query}</span>
        <span
          style={{
            backgroundColor: TRIO.maroon,
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          Search
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          backgroundColor: TRIO.maroon,
          color: "#fff",
          borderRadius: 8,
          padding: "5px 10px",
          fontSize: 9,
          fontWeight: 700,
          transform: `scale(${bump})`,
        }}
      >
        CART
        <span
          style={{
            backgroundColor: TRIO.gold,
            color: TRIO.deep,
            borderRadius: 999,
            minWidth: 15,
            height: 15,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
          }}
        >
          {cartCount}
        </span>
      </div>
    </div>
  );
}

/** Search results with products — cursor adds the first one to the cart. */
export function ResultsScreen({ t }: { t: number }) {
  const added = t >= BEATS.addToCart;
  const toast = interpolate(t, [BEATS.addToCart, BEATS.addToCart + 0.25, BEATS.cartClick - 0.1, BEATS.cartClick + 0.1], [0, 1, 1, 0], CLAMP);

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: TRIO.cream, fontFamily: fonts.sans }}>
      <TrioHeader t={t} cartCount={added ? 1 : 0} query={BEATS.query} />
      <div style={{ position: "absolute", left: 24, top: 62, fontSize: 11, color: "#6B5B57" }}>
        Results for <b style={{ color: TRIO.deep }}>&ldquo;{BEATS.query}&rdquo;</b> · 4 handcrafted items
      </div>
      {PRODUCTS.map((p, i) => {
        const x = 24 + i * 189;
        const isFirst = i === 0;
        return (
          <div
            key={p.name}
            style={{
              position: "absolute",
              left: x,
              top: 88,
              width: 177,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 6px 18px rgba(74,13,18,0.08)",
              border: "1px solid rgba(74,13,18,0.08)",
              ...popIn(t, BEATS.results + 0.08 * i),
            }}
          >
            <Img src={staticFile(p.image)} style={{ width: 177, height: 150, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "10px 10px 12px" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: TRIO.gold, letterSpacing: 1 }}>{p.category}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TRIO.deep, marginTop: 3 }}>{p.name}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#111", marginTop: 4 }}>{p.price}</div>
              <div
                style={{
                  marginTop: 8,
                  height: 26,
                  borderRadius: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  backgroundColor: isFirst && added ? "#1F7A4D" : TRIO.gold,
                  color: isFirst && added ? "#fff" : TRIO.deep,
                }}
              >
                {isFirst && added ? "ADDED ✓" : "ADD TO CART"}
              </div>
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 54,
          opacity: toast,
          transform: `translateY(${(1 - toast) * -10}px)`,
          backgroundColor: TRIO.deep,
          color: "#fff",
          fontSize: 10,
          fontWeight: 600,
          padding: "8px 12px",
          borderRadius: 8,
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        Zardosi Peacock Patch added to cart
      </div>
    </div>
  );
}
