import { parseMedia } from "@remotion/media-parser";
import { Composition, staticFile } from "remotion";
import { IntroVideo } from "./IntroVideo";
import { videoConfig } from "./config";

export function RemotionRoot() {
  return (
    <Composition
      id="IntroVideo"
      component={IntroVideo}
      width={videoConfig.width}
      height={videoConfig.height}
      fps={videoConfig.fps}
      durationInFrames={Math.ceil(videoConfig.fallbackDurationSec * videoConfig.fps)}
      calculateMetadata={async () => {
        const { slowDurationInSeconds } = await parseMedia({
          src: staticFile(videoConfig.video),
          fields: { slowDurationInSeconds: true },
          acknowledgeRemotionLicense: true,
        });
        return { durationInFrames: Math.floor(slowDurationInSeconds * videoConfig.fps) };
      }}
    />
  );
}
