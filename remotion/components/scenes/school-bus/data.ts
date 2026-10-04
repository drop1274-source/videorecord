export const THEME = {
  bg: "#F0F4FF",
  sidebar: "#0F172A",
  accent: "#2563EB",
  orange: "#F97316",
  green: "#22C55E",
  red: "#EF4444",
  text: "#0F172A",
  muted: "#64748B",
  card: "#FFFFFF",
} as const;

/** Word-synced beats for the School Bus Tracking project (43.4 – 46.2s). */
export const BEATS = {
  start: 43.4,
  mapLoad: 43.6,
  busMove: 44.0,
  notification: 44.5,
  eta: 45.0,
  statusUpdate: 45.5,
  end: 46.2,
} as const;

export const STOPS = [
  { name: "Green Valley School", time: "7:30 AM", status: "departed" as const },
  { name: "Sector 12 Stop", time: "7:42 AM", status: "completed" as const },
  { name: "Market Circle", time: "7:55 AM", status: "current" as const },
  { name: "Ashok Nagar", time: "8:05 AM", status: "upcoming" as const },
  { name: "DLF Phase 3", time: "8:15 AM", status: "upcoming" as const },
] as const;

export const STUDENTS = [
  { name: "Aarav K.", stop: "Market Circle", avatar: "A" },
  { name: "Priya S.", stop: "Ashok Nagar", avatar: "P" },
  { name: "Rahul M.", stop: "DLF Phase 3", avatar: "R" },
] as const;
