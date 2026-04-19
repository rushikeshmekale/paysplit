import { useState } from "react";
import { useApp } from "../context/AppContext";
import { colors, fmt, fmtDate, CATEGORY_ICONS } from "../utils/constants";
import { GlassCard, Btn, Badge, Pill, Input } from "../components/UI";
import { AddExpenseModal } from "../components/Modals";

export default function Expenses() {
  const { db, dispatch, toast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = db.expenses.filter((e) => {
    if (filter === "settled"   && !e.settled) return false;
    if (filter === "unsettled" &&  e.settled) return false;
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSpent = db.expenses.reduce((s, e) => s + e.amount, 0);

  const getFriendName = (friendId) => db.friends.find((f) => f.friendId === friendId)?.name || "Friend";

  const deleteExpense = (id) => { dispatch({ type: "DELETE_EXPENSE", id }); toast("Expense deleted"); };
  const settleExpense = (id) => { dispatch({ type: "SETTLE_EXPENSE",  id }); toast("Marked settled!"); };

  return (
    <div style={{ padding: "88px 20px 100px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 36, fontFamily: "Plus Jakarta Sans", fontWeight: 900, color: colors.onSurface, letterSpacing: "-0.03em" }}>Expenses</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: colors.onSurfaceVariant }}>
            {db.expenses.length} total · {fmt(totalSpent)}
          </p>
        </div>
        <Btn onClick={() => setShowAdd(true)} style={{ padding: "10px 18px", fontSize: 13 }}>+ Add</Btn>
      </div>

      <Input icon="🔍" placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 12 }} />

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["all", "All"], ["unsettled", "Pending"], ["settled", "Settled"]].map(([v, l]) => (
          <Pill key={v} active={filter === v} onClick={() => setFilter(v)}>{l}</Pill>
        ))}
      </div>

      {db.expenses.length === 0 && (
        <GlassCard style={{ padding: 48, textAlign: "center" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>📭</p>
          <p style={{ margin: 0, fontSize: 14, color: colors.onSurfaceVariant }}>No expenses yet. Tap + Add to record one!</p>
        </GlassCard>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((exp) => {
          const iPaid     = exp.paidBy === "me";
          const paidLabel = iPaid ? "I paid" : `${getFriendName(exp.paidBy)} paid`;
          const paidColor = iPaid ? colors.primary : colors.error;

          return (
            <GlassCard key={exp.id} style={{ padding: 20, cursor: "pointer" }}
              onClick={() => setSelected(exp.id === selected ? null : exp.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: `${colors.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {CATEGORY_ICONS[exp.category] || "📦"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 700, color: colors.onSurface, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {exp.description}
                  </p>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge>{exp.category}</Badge>
                    <span style={{ fontSize: 11, color: colors.onSurfaceVariant }}>{fmtDate(exp.date)}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: paidColor }}>{paidLabel}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 900, fontFamily: "Plus Jakarta Sans", color: exp.settled ? colors.outlineVariant : colors.onSurface }}>
                    {fmt(exp.amount)}
                  </p>
                  {exp.settled
                    ? <Badge color={colors.outline}>Settled</Badge>
                    : exp.paidBy !== "me"
                      ? <Badge color={colors.error}>You Owe {fmt(exp.myShare || 0)}</Badge>
                      : exp.split.length > 0
                        ? <Badge color={colors.primary}>Split</Badge>
                        : <Badge color={colors.outline}>Solo</Badge>
                  }
                </div>
              </div>

              {selected === exp.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${colors.outlineVariant}30` }}>
                  {/* Split details */}
                  {exp.paidBy === "me" && exp.split.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: colors.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.08em" }}>Split with</p>
                      {exp.split.map((s) => (
                        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                          <span style={{ color: colors.onSurface }}>{s.name}</span>
                          <span style={{ fontWeight: 700, color: "#16a34a" }}>owes you {fmt(s.share)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {exp.paidBy !== "me" && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 13, color: colors.onSurfaceVariant }}>
                        <strong style={{ color: colors.error }}>{getFriendName(exp.paidBy)}</strong> paid {fmt(exp.amount)} total
                      </p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.error }}>
                        You owe: {fmt(exp.myShare || 0)}
                      </p>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    {!exp.settled && (
                      <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); settleExpense(exp.id); }}
                        style={{ flex: 1, padding: "10px", fontSize: 13 }}>✓ Mark Settled</Btn>
                    )}
                    <Btn variant="danger" onClick={(e) => { e.stopPropagation(); deleteExpense(exp.id); }}
                      style={{ flex: 1, padding: "10px", fontSize: 13 }}>🗑 Delete</Btn>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
