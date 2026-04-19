import { useState } from "react";
import { useApp } from "../context/AppContext";
import { colors, fmt } from "../utils/constants";
import { GlassCard, Btn, Avatar } from "../components/UI";
import { AddFriendModal, SettleModal, FriendExpenseModal } from "../components/Modals";

export default function Friends() {
  const { db, dispatch, toast } = useApp();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [settleTarget,  setSettleTarget]  = useState(null);
  const [expenseFriend, setExpenseFriend] = useState(null); // { friendId, friendName, color }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const totalOwed = db.balances.filter((b) => b.direction === "owed").reduce((s, b) => s + b.amount, 0);
  const totalOwes = db.balances.filter((b) => b.direction === "owes").reduce((s, b) => s + b.amount, 0);
  const net = totalOwed - totalOwes;

  const handleDelete = (friendId, friendName) => {
    if (confirmDelete === friendId) {
      dispatch({ type: "DELETE_FRIEND", friendId });
      toast(`${friendName} removed`);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(friendId);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div style={{ padding: "88px 20px 100px", maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 36, fontFamily: "Plus Jakarta Sans", fontWeight: 900, color: colors.onSurface, letterSpacing: "-0.03em" }}>Social Ties</h1>
      <p style={{ margin: "0 0 20px", fontSize: 14, color: colors.onSurfaceVariant }}>Financial transparency with your circle.</p>

      {/* Net Balance Banner */}
      <GlassCard style={{ background: `linear-gradient(135deg, ${colors.primary}, #9b59f0)`, padding: 28, marginBottom: 12 }}>
        <p style={{ margin: "0 0 2px", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Net Social Balance</p>
        <h2 style={{ margin: "0 0 20px", fontSize: 40, fontFamily: "Plus Jakarta Sans", fontWeight: 900, color: "#fff" }}>
          {net >= 0 ? "+" : ""}{fmt(net)}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 14 }}>
            <p style={{ margin: "0 0 3px", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>They owe you</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff" }}>{fmt(totalOwed)}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 14 }}>
            <p style={{ margin: "0 0 3px", fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>You owe</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff" }}>{fmt(totalOwes)}</p>
          </div>
        </div>
      </GlassCard>

      {/* Add Friend */}
      <GlassCard style={{ padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${colors.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👋</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: colors.onSurface }}>Add a Friend</p>
          <p style={{ margin: 0, fontSize: 12, color: colors.onSurfaceVariant }}>Split expenses with your circle</p>
        </div>
        <Btn onClick={() => setShowAddFriend(true)} style={{ padding: "10px 18px", fontSize: 13 }}>+ Add</Btn>
      </GlassCard>

      {/* Balances */}
      <h3 style={{ margin: "0 0 16px", fontSize: 20, fontFamily: "Plus Jakarta Sans", fontWeight: 800, color: colors.onSurface }}>Active Balances</h3>

      {db.balances.length === 0 && (
        <GlassCard style={{ padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 32, margin: "0 0 12px" }}>👥</p>
          <p style={{ margin: 0, fontSize: 14, color: colors.onSurfaceVariant }}>No friends yet — add one to start splitting!</p>
        </GlassCard>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {db.balances.map((bal) => {
          const isConfirming = confirmDelete === bal.friendId;
          return (
            <GlassCard key={bal.id} style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Avatar name={bal.friendName} color={bal.color} size={52} />
                  {bal.direction !== "settled" && (
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: bal.direction === "owed" ? "#22c55e" : colors.error, border: "2px solid #fff" }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, fontFamily: "Plus Jakarta Sans", color: colors.onSurface, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {bal.friendName}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: colors.onSurfaceVariant }}>
                    {db.friends.find((f) => f.friendId === bal.friendId)?.shared?.join(", ") || "No shared expenses yet"}
                  </p>
                  {/* ── Add expense shortcut ── */}
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setExpenseFriend(bal)}
                      style={{
                        background: `${colors.primary}12`, color: colors.primary,
                        border: `1px solid ${colors.primary}30`, borderRadius: 99,
                        padding: "4px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      ➕ Add Expense
                    </button>
                  </div>
                </div>

                {/* Balance + actions */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: bal.direction === "owed" ? "#16a34a" : bal.direction === "owes" ? colors.error : colors.outlineVariant }}>
                    {bal.direction === "owed" ? "Owes You" : bal.direction === "owes" ? "You Owe" : "Settled"}
                  </p>
                  <p style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, fontFamily: "Plus Jakarta Sans", color: bal.direction === "owed" ? "#16a34a" : bal.direction === "owes" ? colors.error : colors.outlineVariant }}>
                    {fmt(bal.amount)}
                  </p>

                  {bal.direction !== "settled" && (
                    <button onClick={() => setSettleTarget(bal)} style={{
                      background: bal.direction === "owed" ? "#16a34a18" : `${colors.error}18`,
                      color: bal.direction === "owed" ? "#16a34a" : colors.error,
                      border: `1px solid ${bal.direction === "owed" ? "#16a34a" : colors.error}30`,
                      borderRadius: 99, padding: "5px 14px", fontSize: 12, fontWeight: 700,
                      cursor: "pointer", marginBottom: 6, display: "block",
                    }}>
                      {bal.direction === "owed" ? "Settle Up" : "Pay Now"}
                    </button>
                  )}

                  <button onClick={() => handleDelete(bal.friendId, bal.friendName)} style={{
                    background: isConfirming ? `${colors.error}18` : "transparent",
                    color: isConfirming ? colors.error : colors.outlineVariant,
                    border: `1px solid ${isConfirming ? colors.error : colors.outlineVariant}40`,
                    borderRadius: 99, padding: "4px 12px", fontSize: 11, fontWeight: 700,
                    cursor: "pointer", transition: "all .2s", display: "block", width: "100%",
                  }}>
                    {isConfirming ? "⚠️ Confirm" : "🗑 Remove"}
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {showAddFriend  && <AddFriendModal onClose={() => setShowAddFriend(false)} />}
      {settleTarget   && <SettleModal balance={settleTarget} onClose={() => setSettleTarget(null)} />}
      {expenseFriend  && <FriendExpenseModal friend={expenseFriend} onClose={() => setExpenseFriend(null)} />}
    </div>
  );
}
