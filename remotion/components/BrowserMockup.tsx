import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { fonts } from "../fonts";
import { lerp, windowEnvelope } from "../utils/timing";
import { AiPageBuilderScreen } from "./scenes/ai-page-builder/AiPageBuilder";
import { AiSummarizerScreen } from "./scenes/ai-summarizer/AiSummarizer";
import { CrmErpScreen } from "./scenes/crm-erp/CrmErp";
import { EcommerceScene } from "./scenes/ecommerce/EcommerceScene";
import { SchoolBusScreen } from "./scenes/school-bus/SchoolBus";
import { SCENE } from "./scenes/shared";

const BAR_HEIGHT = 40;

type Props = { split: number };

/** Maps project ids to their interactive scene components. */
function ProjectScene({ id, t }: { id: string; t: number }) {
  switch (id) {
    case "ecommerce":
      return <EcommerceScene t={t} />;
    case "ai-products":
      return <AiSummarizerScreen t={t} />;
    case "ai-page-builder":
      return <AiPageBuilderScreen t={t} />;
    case "school-bus":
      return <SchoolBusScreen t={t} />;
    case "crm-erp":
      return <CrmErpScreen t={t} />;
    default:
      return null;
  }
}

export function BrowserMockup({ split }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const box = videoConfig.layout.browser;

  if (split <= 0.001) return null;

  const states = videoConfig.projects.map((project) => ({
    project,
    ...windowEnvelope(frame, fps, project.start, project.end, 0.6, 0.5),
  }));

  const t = frame / fps;

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
        {states.map(({ project, enter, exit, value }) => {
          if (value <= 0.001) return null;

          /** Does this project have an interactive scene? */
          const hasScene = ["ecommerce", "ai-products", "ai-page-builder", "school-bus", "crm-erp"].includes(project.id);

          return (
            <div
              key={project.id}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: value,
                transform: `translateY(${(1 - enter) * 28 - exit * 28}px) scale(${lerp(1.02, 1, enter)})`,
                overflow: "hidden",
              }}
            >
              {hasScene ? (
                <ProjectScene id={project.id} t={t} />
              ) : (
                <Img
                  src={staticFile(project.screenshot)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
