import { colors } from "../utils/constants";

// ─── PAYSPLIT LOGO SVG ────────────────────────────────────────────────────────
export const PaySplitLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="url(#psGrad)" />
    {/* Vertical divider */}
    <rect x="18.5" y="9" width="3" height="22" rx="1.5" fill="white" />
    {/* Top bill (left) */}
    <rect x="8" y="12" width="9" height="4" rx="2" fill="white" fillOpacity="0.9" />
    {/* Bottom bill (right) */}
    <rect x="23" y="24" width="9" height="4" rx="2" fill="white" fillOpacity="0.9" />
    {/* Left arrow */}
    <path d="M11 14 L8 14 L10 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Right arrow */}
    <path d="M29 26 L32 26 L30 28.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <defs>
      <linearGradient id="psGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6d22ed" />
        <stop offset="100%" stopColor="#af8dff" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
export const TopBar = ({ onSettings }) => (
  <header
    style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(172,173,177,0.1)",
      boxShadow: "0 4px 32px rgba(109,34,237,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: 72,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <PaySplitLogo size={32} />
      <h1
        style={{
          margin: 0, fontSize: 20, fontFamily: "Plus Jakarta Sans",
          fontWeight: 900, color: colors.primary, letterSpacing: "-0.03em",
        }}
      >
        PaySplit
      </h1>
    </div>
    <button
      onClick={onSettings}
      style={{
        background: `${colors.primary}15`, border: "none",
        borderRadius: "50%", width: 40, height: 40, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
      }}
    >
      👤
    </button>
  </header>
);

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "expenses",  icon: "📊", label: "Expenses"  },
  { id: "friends",   icon: "👥", label: "Friends"   },
  { id: "settings",  icon: "⚙️", label: "Settings"  },
];

export const NavBar = ({ page, setPage }) => (
  <nav
    style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)",
      borderTop: "1px solid rgba(172,173,177,0.15)",
      display: "flex", justifyContent: "space-around",
      padding: "8px 16px 20px",
      boxShadow: "0 -8px 40px rgba(109,34,237,0.08)",
    }}
  >
    {NAV_ITEMS.map((n) => (
      <button
        key={n.id}
        onClick={() => setPage(n.id)}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          background: page === n.id ? `${colors.primary}12` : "transparent",
          border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 16,
          transition: "all .15s",
        }}
      >
        <span
          style={{
            fontSize: 22, transition: "transform .15s",
            transform: page === n.id ? "scale(1.15)" : "scale(1)",
          }}
        >
          {n.icon}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: page === n.id ? 700 : 500,
            color: page === n.id ? colors.primary : colors.outline,
            fontFamily: "Manrope",
          }}
        >
          {n.label}
        </span>
      </button>
    ))}
  </nav>
);
