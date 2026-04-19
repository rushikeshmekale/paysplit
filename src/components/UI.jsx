import { useEffect } from "react";
import { colors } from "../utils/constants";

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export const Avatar = ({ name, color = colors.primary, size = 40 }) => {
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `${color}22`, border: `2px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.32, fontWeight: 700, color, flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, color = colors.primary, bg }) => (
  <span
    style={{
      background: bg || `${color}18`, color, fontSize: 11, fontWeight: 700,
      padding: "2px 10px", borderRadius: 99, letterSpacing: "0.04em",
    }}
  >
    {children}
  </span>
);

// ─── PILL ─────────────────────────────────────────────────────────────────────
export const Pill = ({ children, onClick, active, style = {} }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? colors.primary : colors.surfaceContainerLow,
      color: active ? "#fff" : colors.onSurfaceVariant,
      border: "none", borderRadius: 99, padding: "6px 16px",
      fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
      ...style,
    }}
  >
    {children}
  </button>
);

// ─── GLASS CARD ───────────────────────────────────────────────────────────────
export const GlassCard = ({ children, style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "rgba(255,255,255,0.72)", backdropFilter: "blur(16px)",
      border: "1px solid rgba(172,173,177,0.18)", borderRadius: 20,
      boxShadow: "0 8px 32px rgba(109,34,237,0.06)", ...style,
    }}
  >
    {children}
  </div>
);

// ─── INPUT ────────────────────────────────────────────────────────────────────
export const Input = ({ label, icon, style = {}, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label
        style={{
          fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}
      >
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      {icon && (
        <span
          style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none",
          }}
        >
          {icon}
        </span>
      )}
      <input
        {...props}
        style={{
          width: "100%", background: colors.surfaceContainerLow,
          border: "none", borderRadius: 12,
          padding: icon ? "14px 16px 14px 44px" : "14px 16px",
          fontSize: 14, color: colors.onSurface,
          fontFamily: "Manrope, sans-serif", outline: "none",
          boxSizing: "border-box", transition: "box-shadow .15s",
          ...style,
        }}
        onFocus={(e) => (e.target.style.boxShadow = `0 0 0 2px ${colors.primary}44`)}
        onBlur={(e)  => (e.target.style.boxShadow = "none")}
      />
    </div>
  </div>
);

// ─── SELECT ───────────────────────────────────────────────────────────────────
export const Select = ({ label, options, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label
        style={{
          fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}
      >
        {label}
      </label>
    )}
    <select
      {...props}
      style={{
        background: colors.surfaceContainerLow, border: "none", borderRadius: 12,
        padding: "14px 16px", fontSize: 14, color: colors.onSurface,
        fontFamily: "Manrope, sans-serif", outline: "none", cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

// ─── BTN ──────────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const variants = {
    primary: { background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`, color: "#fff", border: "none" },
    secondary: { background: colors.surfaceContainerHigh, color: colors.onSurface, border: "none" },
    danger:  { background: `${colors.error}18`, color: colors.error, border: `1px solid ${colors.error}30` },
    ghost:   { background: "transparent", color: colors.primary, border: `1px solid ${colors.primary}40` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant], borderRadius: 99, padding: "12px 24px",
        fontSize: 14, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "Plus Jakarta Sans, sans-serif", transition: "all .15s",
        display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
        boxShadow: variant === "primary" ? `0 4px 20px ${colors.primary}30` : "none",
        ...style,
      }}
      onMouseEnter={(e) => !disabled && (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseDown={(e)  => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e)    => !disabled && (e.currentTarget.style.transform = "scale(1.02)")}
    >
      {children}
    </button>
  );
};

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: 44, height: 24,
      background: checked ? colors.primary : colors.surfaceContainerHigh,
      borderRadius: 99, cursor: "pointer", position: "relative",
      transition: "background .2s", flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 18, height: 18, background: "#fff", borderRadius: "50%",
        position: "absolute", top: 3, left: checked ? 23 : 3,
        transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }}
    />
  </div>
);

// ─── TOAST ────────────────────────────────────────────────────────────────────
export const Toast = ({ msg, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", bottom: 100, left: "50%",
        transform: "translateX(-50%)",
        background: colors.onSurface, color: "#fff", borderRadius: 12,
        padding: "12px 24px", fontSize: 14, fontWeight: 600,
        zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        animation: "slideUp .2s ease", whiteSpace: "nowrap",
      }}
    >
      {msg}
    </div>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
export const Modal = ({ title, children, onClose }) => (
  <div
    style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      zIndex: 500, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 20,
    }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <GlassCard
      style={{
        width: "100%", maxWidth: 480, padding: 32,
        position: "relative", maxHeight: "85vh", overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 24,
        }}
      >
        <h2
          style={{
            margin: 0, fontSize: 22, fontFamily: "Plus Jakarta Sans",
            fontWeight: 800, color: colors.onSurface,
          }}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: colors.surfaceContainerHigh, border: "none",
            borderRadius: "50%", width: 32, height: 32,
            cursor: "pointer", fontSize: 16,
          }}
        >
          ×
        </button>
      </div>
      {children}
    </GlassCard>
  </div>
);
