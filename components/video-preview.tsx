"use client";

import { Player } from "@remotion/player";
import { IntroVideo } from "@/remotion/IntroVideo";
import { videoConfig } from "@/remotion/config";

export function VideoPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-black shadow-xl">
      <Player
        component={IntroVideo}
        durationInFrames={Math.floor(videoConfig.fallbackDurationSec * videoConfig.fps)}
        compositionWidth={videoConfig.width}
        compositionHeight={videoConfig.height}
        fps={videoConfig.fps}
        controls
        acknowledgeRemotionLicense
        style={{ width: "100%", aspectRatio: `${videoConfig.width} / ${videoConfig.height}` }}
      />
    </div>
  );
}
