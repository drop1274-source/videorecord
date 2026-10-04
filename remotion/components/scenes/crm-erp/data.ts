export const THEME = {
  bg: "#F8FAFC",
  sidebar: "#1E293B",
  accent: "#6366F1",
  green: "#22C55E",
  orange: "#F59E0B",
  red: "#EF4444",
  blue: "#3B82F6",
  text: "#0F172A",
  muted: "#64748B",
  card: "#FFFFFF",
} as const;

/** Word-synced beats for the CRM-ERP project (46.2 – 51.0s). */
export const BEATS = {
  start: 46.2,
  dashLoad: 46.4,
  kpis: 46.7,
  pipeline: 47.3,
  dealMove: 47.8,
  recentActivity: 48.3,
  invoices: 49.0,
  inventory: 49.6,
  end: 51.0,
} as const;

export const PIPELINE = [
  { stage: "Lead", deals: 12, value: "₹4.2L", color: "#94A3B8" },
  { stage: "Qualified", deals: 8, value: "₹3.1L", color: "#6366F1" },
  { stage: "Proposal", deals: 5, value: "₹2.8L", color: "#F59E0B" },
  { stage: "Negotiation", deals: 3, value: "₹1.9L", color: "#3B82F6" },
  { stage: "Won", deals: 2, value: "₹1.4L", color: "#22C55E" },
] as const;

export const ACTIVITIES = [
  { text: "Rajesh sent proposal to Acme Corp", time: "2m ago", icon: "📄" },
  { text: "New lead: Priya from TechStart", time: "8m ago", icon: "🆕" },
  { text: "Invoice #INV-892 paid — ₹45,000", time: "15m ago", icon: "💰" },
  { text: "Follow-up call scheduled with UrbanCraft", time: "22m ago", icon: "📞" },
] as const;

export const NAV = ["Dashboard", "Contacts", "Deals", "Invoices", "Inventory", "Reports"] as const;
