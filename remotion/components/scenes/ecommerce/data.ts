export const TRIO = {
  maroon: "#5B0F14",
  deep: "#2A0709",
  gold: "#C9A227",
  cream: "#FBF7F1",
} as const;

/** Word-synced beats (seconds) taken from captions.json. */
export const BEATS = {
  start: 25.3, // "But the project that shaped me…"
  typeStart: 26.7,
  query: "zardosi patch",
  searchClick: 28.2,
  results: 29.2, // "I built end-to-end"
  addToCart: 30.4,
  cartClick: 31.3,
  frontEnd: 32.1, // "front-end"
  placeOrder: 32.85,
  backEnd: 33.2, // "back-end"
  payments: 34.2, // "payments"
  paid: 34.45,
  shipping: 34.7, // "shipping"
  gst: 35.2, // "GST"
  admin: 36.0, // "admin management"
  end: 37.75,
} as const;

export const STEPS = [
  { label: "Front-end", at: BEATS.frontEnd },
  { label: "Back-end", at: BEATS.backEnd },
  { label: "Payments", at: BEATS.payments },
  { label: "Shipping", at: BEATS.shipping },
  { label: "GST", at: BEATS.gst },
  { label: "Admin", at: BEATS.admin },
] as const;

export const PRODUCTS = [
  { name: "Zardosi Peacock Patch", category: "PATCHES", price: "₹1,299", image: "products/zardosi-patch.jpg" },
  { name: "Hammered Copper Bottle", category: "BOTTLE", price: "₹899", image: "products/copper-bottle.jpg" },
  { name: "Velvet Pooja Aasan", category: "POOJA ARTICLES", price: "₹649", image: "products/pooja-aasan.jpg" },
  { name: "Handloom Gamcha", category: "TOWEL / GAMCHA", price: "₹349", image: "products/gamcha-towel.jpg" },
] as const;
