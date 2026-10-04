import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { lerp, windowEnvelope } from "../utils/timing";

const BAR_HEIGHT = 40;

type Props = { split: number };

export function BrowserMockup({ split }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = videoConfig.layout.browser;

  if (split <= 0.001) return null;

  const states = videoConfig.projects.map((project) => ({
    project,
    ...windowEnvelope(frame, fps, project.start, project.end, 0.6, 0.5),
  }));

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        opacity: split,
        transform: `translateX(${lerp(140, 0, split)}px) scale(${lerp(0.95, 1, split)})`,
        transformOrigin: "left center",
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(17,17,17,0.08)",
        boxShadow: "0 24px 60px rgba(17,17,17,0.14), 0 2px 6px rgba(17,17,17,0.06)",
      }}
    >
      <div
        style={{
          height: BAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          backgroundColor: "#F1F1EF",
          borderBottom: "1px solid rgba(17,17,17,0.07)",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 11, height: 11, borderRadius: 999, backgroundColor: c }} />
        ))}
        <div
          style={{
            position: "relative",
            marginLeft: 16,
            flex: 1,
            maxWidth: 420,
            height: 24,
            borderRadius: 7,
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(17,17,17,0.06)",
          }}
        >
          {states.map(({ project, value }) => (
            <span
              key={project.id}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.mono,
                fontSize: 12,
                color: "#555",
                opacity: value,
              }}
            >
              {project.url}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: box.height - BAR_HEIGHT, backgroundColor: "#FFFFFF" }}>
        {states.map(({ project, enter, exit, value }) =>
          value <= 0.001 ? null : (
            <Img
              key={project.id}
              src={staticFile(project.screenshot)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
                opacity: value,
                transform: `translateY(${(1 - enter) * 28 - exit * 28}px) scale(${lerp(1.02, 1, enter)})`,
              }}
            />
          ),
        )}
      </div>
    </div>
  );
}
