import { parseMedia } from "@remotion/media-parser";
import { Composition, staticFile } from "remotion";
import { IntroVideo, type IntroVideoProps } from "./IntroVideo";
import { videoConfig } from "./config";

const totalFrames = (videoSec: number) => Math.floor((videoSec + videoConfig.outro.durationSec) * videoConfig.fps);

export function RemotionRoot() {
  return (
    <Composition
      id="IntroVideo"
      component={IntroVideo}
      width={videoConfig.width}
      height={videoConfig.height}
      fps={videoConfig.fps}
      durationInFrames={totalFrames(videoConfig.fallbackDurationSec)}
      defaultProps={{ videoDurationSec: videoConfig.fallbackDurationSec } satisfies IntroVideoProps}
      calculateMetadata={async () => {
        const { slowDurationInSeconds } = await parseMedia({
          src: staticFile(videoConfig.video),
          fields: { slowDurationInSeconds: true },
          acknowledgeRemotionLicense: true,
        });
        return {
          durationInFrames: totalFrames(slowDurationInSeconds),
          props: { videoDurationSec: slowDurationInSeconds },
        };
      }}
    />
  );
}
