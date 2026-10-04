import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { videoConfig } from "../config";
import { captions } from "../utils/captions";
import { getSplitBlocks, toFrame } from "../utils/timing";

type Props = { videoEndSec: number };

type Interval = { start: number; end: number };

/** Words closer than 0.8s are treated as one continuous stretch of speech. */
const speech: Interval[] = captions.reduce<Interval[]>((acc, word) => {
  const start = word.startMs / 1000;
  const end = word.endMs / 1000;
  const last = acc[acc.length - 1];
  if (last && start - last.end < 0.8) last.end = Math.max(last.end, end);
  else acc.push({ start, end });
  return acc;
}, []);

function speechAmount(t: number) {
  return speech.reduce((max, { start, end }) => {
    const v = interpolate(t, [start - 0.35, start, end + 0.1, end + 0.6], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.max(max, v);
  }, 0);
}

function sfxTimes() {
  const times = new Set<number>([videoConfig.lowerThird.start, videoConfig.ending.start]);
  for (const block of getSplitBlocks()) {
    times.add(block.start);
    times.add(block.end);
  }
  return [...times].map((t) => Math.max(0, t - 0.3));
}

export function Soundtrack({ videoEndSec }: Props) {
  const { fps, durationInFrames } = useVideoConfig();
  const { audio } = videoConfig;
  const { open, underSpeech, outro } = audio.musicVolume;
  const endSec = durationInFrames / fps;

  const musicVolume = (f: number) => {
    const t = f / fps;
    const base = t > videoEndSec - 0.2 ? outro : open;
    const ducked = base + (underSpeech - base) * speechAmount(t);
    const fadeIn = interpolate(t, [0, 0.6], [0.4, 1], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(t, [endSec - 1.4, endSec], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return ducked * fadeIn * fadeOut;
  };

  return (
    <>
      <Sequence durationInFrames={toFrame(videoEndSec, fps)} name="Voice (enhanced)">
        <Audio src={staticFile(audio.voice)} volume={1.85} />
      </Sequence>
      <Audio src={staticFile(audio.music)} volume={musicVolume} name="Music" />
      {sfxTimes().map((t) => (
        <Sequence key={t} from={toFrame(t, fps)} durationInFrames={toFrame(1, fps)} name="Whoosh">
          <Audio src={staticFile(audio.whoosh)} volume={audio.sfxVolume} />
        </Sequence>
      ))}
      <Sequence from={toFrame(videoEndSec - 0.05, fps)} name="Outro hit">
        <Audio src={staticFile(audio.outroHit)} volume={0.55} />
      </Sequence>
    </>
  );
}
