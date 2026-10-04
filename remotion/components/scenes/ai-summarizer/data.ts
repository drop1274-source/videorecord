export const THEME = {
  bg: "#0F0F13",
  card: "#1A1A22",
  accent: "#7C5CFC",
  accentLight: "#A78BFA",
  text: "#E8E6F0",
  muted: "#6B6980",
  success: "#4ADE80",
} as const;

/** Word-synced beats for the AI summarizer project (37.75 – 41.05s). */
export const BEATS = {
  start: 37.75,
  urlType: 38.0,
  paste: 38.4,
  summarize: 38.9,
  loading: 39.2,
  result: 39.6,
  keyPoints: 40.0,
  end: 41.05,
} as const;

export const SUMMARY_TEXT =
  "This article explores how large language models are transforming software development by automating code generation, debugging, and documentation tasks.";

export const KEY_POINTS = [
  "LLMs reduce development time by 40%",
  "Code quality improved with AI review",
  "Automated documentation saves hours",
];
