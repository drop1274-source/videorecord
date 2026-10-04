import type { CSSProperties } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, POP, springFrom } from "../../utils/motion";

type Props = {
  text: string;
  /** Second at which the first word starts rising. */
  start: number;
  /** Delay between words (seconds). */
  stagger?: number;
  /** Second at which the words slide back out of view. */
  exitAt?: number;
  style?: CSSProperties;
  wordStyle?: (index: number) => CSSProperties | undefined;
};

/**
 * Each word rises from behind an invisible mask (overflow hidden), like the
 * classic Framer Motion "staggerChildren + y: 100% → 0" text reveal.
 */
export function MaskText({ text, start, stagger = 0.06, exitAt, style, wordStyle }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", columnGap: "0.26em", ...style }}>
      {words.map((word, i) => {
        const enter = springFrom(frame, fps, start + i * stagger, POP);
        const exit = exitAt === undefined ? 0 : springFrom(frame, fps, exitAt + i * stagger * 0.6, POP);
        const y = (1 - enter) * 110 - exit * 110;
        const rotate = (1 - enter) * 6;
        const opacity = interpolate(enter - exit, [0, 0.35], [0, 1], CLAMP);
        return (
          <span
            key={`${word}-${i}`}
            style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${y}%) rotate(${rotate}deg)`,
                transformOrigin: "left bottom",
                opacity,
                ...wordStyle?.(i),
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </span>
  );
}
