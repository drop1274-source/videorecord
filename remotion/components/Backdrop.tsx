import { useVideoConfig } from "remotion";
import { lerp } from "../utils/timing";
import { CoverVideo } from "./CoverVideo";

type Props = { split: number };

/** Blurred, darkened copy of the recording behind everything — classic "framed" edit. */
export function Backdrop({ split }: Props) {
  const { width, height } = useVideoConfig();
  const darkness = lerp(0.45, 0.66, split);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width, height, overflow: "hidden", backgroundColor: "#0B0B0C" }}>
      <div style={{ position: "absolute", left: -60, top: -60, width: width + 120, height: height + 120 }}>
        <CoverVideo
          width={width + 120}
          height={height + 120}
          focusY={55}
          filter="blur(28px) saturate(1.35) brightness(0.85)"
        />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width, height, backgroundColor: `rgba(10,10,12,${darkness})` }} />
    </div>
  );
}
