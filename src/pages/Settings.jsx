import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { colors, fmt } from "../utils/constants";
import { GlassCard, Input, Select, Btn, Toggle, Badge } from "../components/UI";

export default function Settings({ onLogout }) {
  const { db, dispatch, toast } = useApp();
  const [profile, setProfile] = useState({ ...db.profile });
  useEffect(() => { setProfile({ ...db.profile }); }, [db.profile]);

  const saveProfile = () => {
    if (!profile.name.trim()) return toast("Name cannot be empty");
    dispatch({ type: "UPDATE_PROFILE", profile });
    toast("✓ Profile saved!");
  };

  return (
    <div style={{ padding: "88px 20px 100px", maxWidth: 640, margin: "0 auto" }}>
      <GlassCard style={{ padding: 28, marginBottom: 20, textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
          marginBottom: 16, fontSize: 28, color: "#fff", fontWeight: 800, fontFamily: "Plus Jakarta Sans",
        }}>
          {profile.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"}
        </div>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontFamily: "Plus Jakarta Sans", fontWeight: 900, color: colors.onSurface }}>{profile.name}</h2>
        <p style={{ margin: "0 0 16px", fontSize: 14, color: colors.onSurfaceVariant }}>{profile.email}</p>
        <Badge color={colors.primary} bg={`${colors.primary}15`}>✨ Premium Member</Badge>
      </GlassCard>

      <GlassCard style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, fontFamily: "Plus Jakarta Sans", fontWeight: 800, color: colors.onSurface }}>👤 Profile</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Display Name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
          <Select label="Currency" value={profile.currency} onChange={(e) => setProfile((p) => ({ ...p, currency: e.target.value }))}
            options={[
              { value: "USD", label: "🇺🇸 USD — US Dollar" },
              { value: "EUR", label: "🇪🇺 EUR — Euro" },
              { value: "GBP", label: "🇬🇧 GBP — British Pound" },
              { value: "INR", label: "🇮🇳 INR — Indian Rupee" },
            ]} />
          <Btn onClick={saveProfile} style={{ marginTop: 4 }}>Save Profile</Btn>
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, fontFamily: "Plus Jakarta Sans", fontWeight: 800, color: colors.onSurface }}>⚙️ Preferences</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "notifications", label: "Push Notifications",      desc: "Get notified for new expenses and settlements" },
            { key: "autoSettle",    label: "Auto-settle Suggestions", desc: "Suggest settlements when balances reach $500"  },
          ].map((pref) => (
            <div key={pref.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: colors.onSurface }}>{pref.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: colors.onSurfaceVariant }}>{pref.desc}</p>
              </div>
              <Toggle checked={!!profile[pref.key]} onChange={(v) => setProfile((p) => ({ ...p, [pref.key]: v }))} />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, fontFamily: "Plus Jakarta Sans", fontWeight: 800, color: colors.onSurface }}>📊 Your Stats</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Total Expenses", value: db.expenses.length },
            { label: "Friends",        value: db.friends.length },
            { label: "Total Tracked",  value: fmt(db.expenses.reduce((s, e) => s + e.amount, 0)) },
            { label: "Settled",        value: db.expenses.filter((e) => e.settled).length },
          ].map((stat) => (
            <div key={stat.label} style={{ background: colors.surfaceContainerLow, borderRadius: 14, padding: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900, fontFamily: "Plus Jakarta Sans", color: colors.primary }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: colors.onSurfaceVariant, fontWeight: 600 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <Btn variant="danger" onClick={onLogout} style={{ width: "100%", borderRadius: 16 }}>
        🚪 Sign Out
      </Btn>
    </div>
  );
}
