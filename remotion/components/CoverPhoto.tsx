import { Img, staticFile } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";

export function CoverPhoto() {
  const { width, height } = videoConfig;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundColor: "#08090D",
        overflow: "hidden",
        fontFamily: fonts.sans,
      }}
    >
      {/* 1. Deep Ambient Lighting & Glow Gradients */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 18% 25%, rgba(99, 102, 241, 0.22) 0%, transparent 55%), radial-gradient(circle at 85% 70%, rgba(232, 68, 42, 0.22) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* 2. Technical Blueprint Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.8,
        }}
      />

      {/* 3. Blurred Background Developer Workspace Silhouette */}
      <div
        style={{
          position: "absolute",
          left: -40,
          top: -40,
          width: width + 80,
          height: height + 80,
          opacity: 0.35,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("saransh-work.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 45%",
            filter: "blur(42px) saturate(1.35) brightness(0.42)",
            transform: "scale(1.12)",
          }}
        />
      </div>

      {/* 4. Left Content: Giant Bold Typography & Badges */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 72,
          bottom: 72,
          width: 580,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Top Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              backgroundColor: "rgba(232, 68, 42, 0.16)",
              border: "1px solid rgba(232, 68, 42, 0.4)",
              borderRadius: 999,
              padding: "6px 16px",
              boxShadow: "0 0 20px rgba(232, 68, 42, 0.25)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                backgroundColor: "#E8442A",
                boxShadow: "0 0 10px #E8442A",
              }}
            />
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2,
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              PRODUCER &amp; DEV
            </span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 999,
              padding: "6px 14px",
              fontFamily: fonts.mono,
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            3+ YEARS EXPERIENCE
          </div>
        </div>

        {/* Main Headline Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: -3.5,
              lineHeight: 0.94,
              color: "#FFFFFF",
              textTransform: "uppercase",
              textShadow: "0 10px 40px rgba(0,0,0,0.8)",
            }}
          >
            FULL-STACK
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: -3.5,
              lineHeight: 0.94,
              background: "linear-gradient(135deg, #FF6B4A 0%, #FFA800 60%, #FFD600 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              filter: "drop-shadow(0 8px 30px rgba(255,107,74,0.35))",
            }}
          >
            ENGINEER
          </div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.72)",
              marginTop: 14,
              lineHeight: 1.4,
              maxWidth: 480,
            }}
          >
            Production web applications, scalable client architectures, real-time GPS fleet tracking, and AI-powered systems.
          </p>
        </div>

        {/* Mini Project Highlights Showcase Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { icon: "🛍️", label: "E-Commerce", tag: "Trio Enterprises" },
            { icon: "🤖", label: "AI Summarizer", tag: "GPT-4o" },
            { icon: "⚡", label: "Page Builder", tag: "Webflow-like" },
            { icon: "📍", label: "Bus Tracking", tag: "IoT & GPS" },
            { icon: "💼", label: "CRM + ERP", tag: "Enterprise" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 10,
                padding: "6px 12px",
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ fontSize: 13 }}>{item.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#FFFFFF" }}>{item.label}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{item.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Right Content: Floating Cards & Creator Talking Head */}
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 60,
          bottom: 60,
          width: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 15,
        }}
      >
        {/* Background Ambient Glow Behind Creator Portrait */}
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 520,
            borderRadius: 32,
            backgroundColor: "rgba(99, 102, 241, 0.28)",
            filter: "blur(50px)",
            transform: "translateY(10px)",
          }}
        />

        {/* Secondary Warm Glow */}
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 340,
            borderRadius: 32,
            backgroundColor: "rgba(232, 68, 42, 0.25)",
            filter: "blur(40px)",
            transform: "translate(40px, -40px)",
          }}
        />

        {/* Floating Mini Screenshot 1 (CRM Dashboard - Top Right) */}
        <div
          style={{
            position: "absolute",
            right: -24,
            top: 18,
            width: 200,
            height: 125,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.65), 0 0 20px rgba(99,102,241,0.25)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            transform: "rotate(4deg)",
            zIndex: 12,
            backgroundColor: "#1E293B",
          }}
        >
          <Img
            src={staticFile("screens/crm-erp.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              left: 6,
              bottom: 6,
              backgroundColor: "rgba(15,23,42,0.85)",
              backdropFilter: "blur(8px)",
              padding: "2px 8px",
              borderRadius: 6,
              fontSize: 8,
              fontWeight: 800,
              color: "#38BDF8",
            }}
          >
            CRM · ERP
          </div>
        </div>

        {/* Floating Mini Screenshot 2 (E-Commerce - Bottom Left) */}
        <div
          style={{
            position: "absolute",
            left: -48,
            bottom: -12,
            width: 190,
            height: 120,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.65), 0 0 20px rgba(232,68,42,0.2)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            transform: "rotate(-6deg)",
            zIndex: 10,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Img
            src={staticFile("screens/ecommerce.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              left: 6,
              bottom: 6,
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)",
              padding: "2px 8px",
              borderRadius: 6,
              fontSize: 8,
              fontWeight: 800,
              color: "#FBBF24",
            }}
          >
            E-Commerce
          </div>
        </div>

        {/* Creator Developer Card */}
        <div
          style={{
            position: "relative",
            width: 380,
            height: 520,
            borderRadius: 26,
            overflow: "hidden",
            backgroundColor: "#0F1117",
            border: "1.5px solid rgba(255,255,255,0.32)",
            boxShadow: "0 36px 90px rgba(0,0,0,0.75), 0 0 50px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
            zIndex: 20,
          }}
        >
          {/* Developer Photo with Pro Cinematic Filter */}
          <Img
            src={staticFile("saransh-work.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "32% 58%",
              transform: "scale(1.1)",
              filter: "contrast(1.18) saturate(1.24) brightness(1.03)",
            }}
          />

          {/* Top Live Engineering Badge */}
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(10, 12, 18, 0.85)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              borderRadius: 8,
              padding: "4px 10px",
              zIndex: 25,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                backgroundColor: "#22C55E",
                boxShadow: "0 0 10px #22C55E",
              }}
            />
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: 1,
              }}
            >
              DEV SESSION
            </span>
          </div>

          {/* Cinematic Shadow Vignette & Rim Glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(8,9,13,0.9) 0%, rgba(8,9,13,0.18) 45%, transparent 70%), linear-gradient(135deg, rgba(99,102,241,0.15) 0%, transparent 60%)",
            }}
          />

          {/* Lower Nameplate Tag */}
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 16,
              right: 16,
              backgroundColor: "rgba(10, 12, 18, 0.92)",
              backdropFilter: "blur(20px)",
              borderRadius: 14,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: "#FFFFFF", letterSpacing: -0.2 }}>
                  {videoConfig.name}
                </span>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: 4,
                    backgroundColor: "rgba(34,197,94,0.2)",
                    color: "#4ADE80",
                    border: "1px solid rgba(34,197,94,0.35)",
                    letterSpacing: 0.5,
                  }}
                >
                  ● AVAILABLE
                </span>
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginTop: 2 }}>
                {videoConfig.role}
              </div>
            </div>

            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                background: "linear-gradient(135deg, #FF6B4A, #E8442A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "#FFFFFF",
                boxShadow: "0 2px 10px rgba(232, 68, 42, 0.4)",
              }}
            >
              ▶
            </div>
          </div>
        </div>
      </div>

      {/* 6. Viewfinder HUD Overlay */}
      <div style={{ position: "absolute", left: 24, top: 22, pointerEvents: "none", zIndex: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: fonts.mono, fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: "#E8442A", boxShadow: "0 0 8px #E8442A" }} />
          4K 60FPS · CINEMATIC EDIT
        </div>
      </div>

      {/* Viewfinder Corner Brackets */}
      {[
        { left: 16, top: 16, borderLeft: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid rgba(255,255,255,0.4)" },
        { right: 16, top: 16, borderRight: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid rgba(255,255,255,0.4)" },
        { left: 16, bottom: 16, borderLeft: "2px solid rgba(255,255,255,0.4)", borderBottom: "2px solid rgba(255,255,255,0.4)" },
        { right: 16, bottom: 16, borderRight: "2px solid rgba(255,255,255,0.4)", borderBottom: "2px solid rgba(255,255,255,0.4)" },
      ].map((style, i) => (
        <div key={i} style={{ position: "absolute", width: 28, height: 28, pointerEvents: "none", zIndex: 30, ...style }} />
      ))}
    </div>
  );
}
