"use client";

import { Player } from "@remotion/player";
import { IntroVideo } from "@/remotion/IntroVideo";
import { videoConfig } from "@/remotion/config";

const durationInFrames = Math.floor(
  (videoConfig.fallbackDurationSec + videoConfig.outro.durationSec) * videoConfig.fps,
);

export function VideoPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/50">
      <Player
        component={IntroVideo}
        inputProps={{ videoDurationSec: videoConfig.fallbackDurationSec }}
        durationInFrames={durationInFrames}
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
