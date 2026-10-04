import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { BrowserMockup } from "./components/BrowserMockup";
import { CalloutCard } from "./components/CalloutCard";
import { Captions } from "./components/Captions";
import { LetsTalk, LookingFor } from "./components/Ending";
import { FrameOverlay } from "./components/FrameOverlay";
import { KineticIntro } from "./components/KineticIntro";
import { LowerThird } from "./components/LowerThird";
import { OutroCard } from "./components/OutroCard";
import { Soundtrack } from "./components/Soundtrack";
import { TalkingHead } from "./components/TalkingHead";
import { videoConfig } from "./config";
import { getSplitAmount } from "./utils/timing";

export type IntroVideoProps = { videoDurationSec?: number };

export function IntroVideo({ videoDurationSec = videoConfig.fallbackDurationSec }: IntroVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const split = getSplitAmount(frame, fps);

  const { start: bwStart, end: bwEnd } = videoConfig.ending.blackAndWhite;
  const mono = interpolate(t, [bwStart, bwEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeFromBlack = interpolate(t, [0, 0.4], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          filter: mono > 0 ? `grayscale(${mono}) contrast(${1 + mono * 0.12})` : undefined,
        }}
      >
        <Backdrop split={split} />
        <TalkingHead split={split} />
        <BrowserMockup split={split} />
        {videoConfig.projects.map((project) => (
          <CalloutCard key={project.id} project={project} />
        ))}
        <LowerThird />
        <KineticIntro />
        <LookingFor />
        <FrameOverlay split={split} videoEndSec={videoDurationSec} />
        <Captions />
        <LetsTalk />
      </AbsoluteFill>
      <OutroCard videoEndSec={videoDurationSec} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeFromBlack, pointerEvents: "none" }} />
      <Soundtrack videoEndSec={videoDurationSec} />
    </AbsoluteFill>
  );
}
