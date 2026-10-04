import type { Caption } from "@remotion/captions";
import rawCaptions from "../captions.json";
import { videoConfig } from "../config";

export type CaptionPage = {
  startMs: number;
  endMs: number;
  words: Caption[];
};

export const captions: Caption[] = (rawCaptions as Caption[])
  .map((c) => ({ ...c, text: c.text.trim() }))
  .filter((c) => c.text.length > 0);

const endsSentence = (text: string) => /[.!?,]$/.test(text);

/** Groups words into short pages (3–5 words), breaking on pauses and punctuation. */
export function buildPages(
  words: Caption[] = captions,
  maxWords = videoConfig.captions.maxWordsPerPage,
  pauseMs = videoConfig.captions.breakOnPauseMs,
): CaptionPage[] {
  const pages: CaptionPage[] = [];
  let current: Caption[] = [];

  const flush = () => {
    if (current.length === 0) return;
    pages.push({ startMs: current[0].startMs, endMs: current[current.length - 1].endMs, words: current });
    current = [];
  };

  words.forEach((word, i) => {
    const prev = words[i - 1];
    if (prev && current.length > 0 && word.startMs - prev.endMs > pauseMs) flush();
    current.push(word);
    const minReached = current.length >= Math.min(3, maxWords);
    if (current.length >= maxWords || (minReached && endsSentence(word.text))) flush();
  });
  flush();

  // Hold each page on screen until the next one starts (or a short tail).
  return pages.map((page, i) => {
    const next = pages[i + 1];
    const holdUntil = page.endMs + videoConfig.captions.tailMs;
    return { ...page, endMs: next ? Math.min(next.startMs, holdUntil) : holdUntil };
  });
}
