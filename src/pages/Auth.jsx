import { useState } from "react";
import { useApp } from "../context/AppContext";
import { colors } from "../utils/constants";
import { GlassCard, Input, Btn } from "../components/UI";
import { PaySplitLogo } from "../components/Layout";

export default function Auth() {
  const { login, register } = useApp();
  const [tab,   setTab]   = useState("login");
  const [form,  setForm]  = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    if (!form.email || !form.password) return setError("Please fill all fields.");
    setLoading(true);
    const err = login(form.email.trim(), form.password);
    setLoading(false);
    if (err) setError(err);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return setError("Please fill all fields.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    const err = register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div style={{
      minHeight: "100vh", background: colors.surface,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "Manrope, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: `${colors.primary}18`, filter: "blur(80px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: 300, height: 300, borderRadius: "50%", background: `${colors.secondaryContainer}40`, filter: "blur(60px)", zIndex: 0 }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 8px 32px ${colors.primary}40`,
            }}>
              <PaySplitLogo size={44} />
            </div>
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 32, fontFamily: "Plus Jakarta Sans", fontWeight: 900, color: colors.primary, letterSpacing: "-0.04em" }}>PaySplit</h1>
          <p style={{ margin: 0, fontSize: 14, color: colors.onSurfaceVariant }}>Split expenses effortlessly with friends</p>
        </div>

        <GlassCard style={{ padding: 36 }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: colors.surfaceContainerLow, borderRadius: 99, padding: 4, marginBottom: 28 }}>
            {[["login", "Sign In"], ["register", "Create Account"]].map(([t, l]) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 99, cursor: "pointer",
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? colors.primary : colors.onSurfaceVariant,
                fontWeight: tab === t ? 800 : 500, fontSize: 13,
                fontFamily: "Plus Jakarta Sans",
                boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all .2s",
              }}>{l}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tab === "register" && (
              <Input label="Full Name" icon="👤" placeholder="Alex Johnson" value={form.name} onChange={(e) => set("name", e.target.value)} />
            )}
            <Input label="Email" icon="✉️" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
            <Input label="Password" icon="🔒" type="password" placeholder="••••••••" value={form.password} onChange={(e) => set("password", e.target.value)} />

            {error && (
              <div style={{ background: `${colors.error}12`, border: `1px solid ${colors.error}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: colors.error }}>
                {error}
              </div>
            )}

            <Btn onClick={tab === "login" ? handleLogin : handleRegister} disabled={loading}
              style={{ marginTop: 4, width: "100%", borderRadius: 12, padding: "15px" }}>
              {loading ? "Please wait…" : tab === "login" ? "Sign In →" : "Create Account →"}
            </Btn>

            <div style={{ background: colors.surfaceContainerLow, borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 12, color: colors.onSurfaceVariant }}>
                {tab === "login"
                  ? "New here? Switch to Create Account above."
                  : "Your data is saved privately on this device."}
              </p>
            </div>
          </div>
        </GlassCard>
        <p style={{ textAlign: "center", fontSize: 11, color: colors.outlineVariant, marginTop: 20 }}>© 2025 PaySplit · Split fairly, always</p>
      </div>
    </div>
  );
}
