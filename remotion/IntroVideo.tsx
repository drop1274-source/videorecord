import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BrowserMockup } from "./components/BrowserMockup";
import { CalloutCard } from "./components/CalloutCard";
import { Captions } from "./components/Captions";
import { LetsTalk, LookingFor } from "./components/Ending";
import { LowerThird } from "./components/LowerThird";
import { TalkingHead } from "./components/TalkingHead";
import { videoConfig } from "./config";
import { getSplitAmount } from "./utils/timing";

export function IntroVideo() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const split = getSplitAmount(frame, fps);

  return (
    <AbsoluteFill style={{ backgroundColor: videoConfig.colors.background }}>
      <TalkingHead split={split} />
      <BrowserMockup split={split} />
      {videoConfig.projects.map((project) => (
        <CalloutCard key={project.id} project={project} />
      ))}
      <LowerThird />
      <LookingFor />
      <Captions />
      <LetsTalk />
    </AbsoluteFill>
  );
}
