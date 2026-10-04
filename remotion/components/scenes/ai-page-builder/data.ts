export const THEME = {
  bg: "#F9FAFB",
  sidebar: "#111827",
  accent: "#3B82F6",
  accentDark: "#1D4ED8",
  green: "#10B981",
  text: "#111827",
  muted: "#6B7280",
  card: "#FFFFFF",
} as const;

/** Word-synced beats for the AI Page Builder project (41.05 – 43.4s). */
export const BEATS = {
  start: 41.05,
  prompt: 41.3,
  generating: 41.7,
  heroRender: 42.0,
  sectionRender: 42.4,
  drag: 42.8,
  end: 43.4,
} as const;

export const SECTIONS = [
  { type: "Hero", icon: "◆", color: "#3B82F6" },
  { type: "Features", icon: "⬡", color: "#10B981" },
  { type: "Pricing", icon: "◈", color: "#F59E0B" },
  { type: "Contact", icon: "◉", color: "#EF4444" },
] as const;

export const LAYERS = [
  { name: "Hero Section", indent: 0 },
  { name: "Heading", indent: 1 },
  { name: "CTA Button", indent: 1 },
  { name: "Features Grid", indent: 0 },
  { name: "Feature Card ×3", indent: 1 },
  { name: "Pricing", indent: 0 },
] as const;
