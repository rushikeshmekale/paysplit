import { useState } from "react";
import { useApp } from "../context/AppContext";
import { colors, fmt, fmtDate, CATEGORY_ICONS } from "../utils/constants";
import { GlassCard, Btn, Badge } from "../components/UI";
import { AddExpenseModal } from "../components/Modals";

export default function Dashboard({ setPage }) {
  const { db } = useApp();
  const [showAddExpense, setShowAddExpense] = useState(false);

  const totalOwed  = db.balances.filter((b) => b.direction === "owed").reduce((s, b) => s + b.amount, 0);
  const totalOwes  = db.balances.filter((b) => b.direction === "owes").reduce((s, b) => s + b.amount, 0);
  const netBalance = totalOwed - totalOwes;

  const thisMonthTotal = db.expenses.reduce((s, e) => s + e.amount, 0);
  const categories     = db.expenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
  const topCats        = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const recentExpenses = db.expenses.slice(0, 5);

  return (
    <div style={{ padding: "88px 20px 100px", maxWidth: 640, margin: "0 auto" }}>

      {/* ── Hero Balance ── */}
      <GlassCard
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #9b59f0 50%, ${colors.primaryContainer} 100%)`,
          padding: 32, marginBottom: 20, position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Net Balance</p>
        <h2 style={{ margin: "0 0 24px", fontSize: 52, fontFamily: "Plus Jakarta Sans", fontWeight: 900, color: "#fff", letterSpacing: "-0.04em" }}>
          {netBalance >= 0 ? "+" : ""}{fmt(netBalance)}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 16 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>They owe you</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "Plus Jakarta Sans" }}>{fmt(totalOwed)}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: 16 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>You owe</p>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "Plus Jakarta Sans" }}>{fmt(totalOwes)}</p>
          </div>
        </div>
      </GlassCard>

      {/* ── Quick Actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <Btn onClick={() => setShowAddExpense(true)} style={{ borderRadius: 16, padding: "18px 20px", fontSize: 15 }}>
          ➕ Add Expense
        </Btn>
        <Btn variant="ghost" onClick={() => setPage("friends")} style={{ borderRadius: 16, padding: "18px 20px", fontSize: 15 }}>
          👥 Split Bill
        </Btn>
      </div>

      {/* ── Monthly Summary ── */}
      <GlassCard style={{ padding: 24, marginBottom: 20 }}>
        <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: "0.1em", textTransform: "uppercase" }}>Monthly Flow</p>
        <h3 style={{ margin: "0 0 20px", fontSize: 32, fontFamily: "Plus Jakarta Sans", fontWeight: 900, color: colors.onSurface }}>
          {fmt(thisMonthTotal)} <span style={{ fontSize: 14, color: colors.onSurfaceVariant, fontWeight: 400 }}>this month</span>
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topCats.map(([cat, amt]) => (
            <div key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: colors.onSurface }}>{CATEGORY_ICONS[cat]} {cat}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.primary }}>{fmt(amt)}</span>
              </div>
              <div style={{ height: 6, background: colors.surfaceContainerHigh, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(amt / thisMonthTotal) * 100}%`, background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryContainer})`, borderRadius: 99, transition: "width .5s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ── Recent Activity ── */}
      <GlassCard style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontFamily: "Plus Jakarta Sans", fontWeight: 800, color: colors.onSurface }}>Recent Activity</h3>
          <button onClick={() => setPage("expenses")} style={{ background: "none", border: "none", color: colors.primary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            View All →
          </button>
        </div>
        {recentExpenses.map((exp) => (
          <div
            key={exp.id}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${colors.outlineVariant}30` }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${colors.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {CATEGORY_ICONS[exp.category] || "📦"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: colors.onSurface, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.description}</p>
              <p style={{ margin: 0, fontSize: 12, color: colors.onSurfaceVariant }}>
                {fmtDate(exp.date)} · {exp.split.length > 0 ? `Split ${exp.split.length + 1} ways` : "Personal"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, fontFamily: "Plus Jakarta Sans", color: exp.settled ? colors.outlineVariant : colors.onSurface }}>
                {fmt(exp.amount)}
              </p>
              {exp.settled && <Badge color={colors.outline}>Settled</Badge>}
            </div>
          </div>
        ))}
      </GlassCard>

      {showAddExpense && <AddExpenseModal onClose={() => setShowAddExpense(false)} />}
    </div>
  );
}
