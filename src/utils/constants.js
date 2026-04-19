// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const colors = {
  primary: "#6d22ed",
  primaryDim: "#6100e0",
  primaryContainer: "#af8dff",
  onPrimary: "#f8f0ff",
  onPrimaryContainer: "#2c006e",
  secondary: "#7543a8",
  secondaryContainer: "#e4c6ff",
  onSecondaryContainer: "#5f2c92",
  tertiary: "#9d365b",
  tertiaryContainer: "#ff8eaf",
  surface: "#f6f6fa",
  surfaceContainer: "#e7e8ed",
  surfaceContainerLow: "#f0f0f5",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerHigh: "#e1e2e7",
  onSurface: "#2d2f32",
  onSurfaceVariant: "#5a5b5f",
  outline: "#75777a",
  outlineVariant: "#acadb1",
  error: "#b41340",
  errorDim: "#a70138",
  errorContainer: "#f74b6d",
  onError: "#ffefef",
};

export const CATEGORIES = [
  "Food & Dining", "Travel", "Groceries", "Entertainment",
  "Transport", "Utilities", "Subscriptions", "Health", "Other",
];

export const CATEGORY_ICONS = {
  "Food & Dining": "🍽️",
  "Travel": "✈️",
  "Groceries": "🛒",
  "Entertainment": "🎭",
  "Transport": "🚗",
  "Utilities": "⚡",
  "Subscriptions": "📱",
  "Health": "🏥",
  "Other": "📦",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const uid = () => Math.random().toString(36).slice(2, 10);
