import { Video } from "@remotion/media";
import { staticFile } from "remotion";
import { videoConfig } from "../config";

type Props = {
  width: number;
  height: number;
  /** Vertical focus point in % (like object-position y). */
  focusY: number;
  zoom?: number;
  filter?: string;
};

/**
 * Cover-fits the recording with explicit pixel geometry instead of
 * object-position, so it renders identically in the browser renderer.
 */
export function CoverVideo({ width, height, focusY, zoom = 1, filter }: Props) {
  const { width: srcW, height: srcH } = videoConfig.sourceSize;
  const scale = Math.max(width / srcW, height / srcH) * zoom;
  const round = (n: number) => Math.round(n * 100) / 100;
  const w = round(srcW * scale);
  const h = round(srcH * scale);
  const left = round((width - w) / 2);
  const top = round((height - h) * (focusY / 100));

  return (
    <Video
      muted
      src={staticFile(videoConfig.video)}
      objectFit="fill"
      style={{ position: "absolute", left, top, width: w, height: h, filter }}
    />
  );
}
