import { useState } from "react";
import { useApp } from "../context/AppContext";
import { colors, CATEGORIES, CATEGORY_ICONS, fmt, uid } from "../utils/constants";
import { Modal, Input, Select, GlassCard, Btn, Pill, Avatar } from "./UI";

const FRIEND_COLORS = ["#6d22ed", "#9d365b", "#7543a8", "#2d6a4f", "#c77c3e", "#1a6985"];

// ─── ADD EXPENSE MODAL ────────────────────────────────────────────────────────
// preselectedFriend: { friendId, name } — set when opened from a friend card
// preselectedPaidBy: "me" | friendId   — set when opened from "they paid" shortcut
export const AddExpenseModal = ({ onClose, preselectedFriend = null, preselectedPaidBy = null }) => {
  const { db, dispatch, toast } = useApp();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food & Dining",
    date: new Date().toISOString().split("T")[0],
    paidBy: preselectedPaidBy || "me",           // "me" | friendId
    friendIds: preselectedFriend ? [preselectedFriend.friendId] : [],
    myShare: "",                                  // used when friend paid
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleFriend = (id) =>
    set("friendIds", form.friendIds.includes(id)
      ? form.friendIds.filter((x) => x !== id)
      : [...form.friendIds, id]);

  const amt = parseFloat(form.amount) || 0;
  const numPeople = form.friendIds.length + 1;
  const equalShare = amt > 0 ? +(amt / numPeople).toFixed(2) : 0;

  const paidByFriendName = form.paidBy !== "me"
    ? db.friends.find((f) => f.friendId === form.paidBy)?.name || "Friend"
    : null;

  const handleSubmit = () => {
    if (!form.description.trim()) return toast("Enter a description");
    if (!form.amount || amt <= 0) return toast("Enter a valid amount");

    if (form.paidBy === "me") {
      // I paid — friends owe me their share
      if (form.friendIds.length === 0) {
        // Personal expense, no split
        dispatch({
          type: "ADD_EXPENSE",
          expense: { id: uid(), description: form.description, amount: amt, category: form.category,
                     date: form.date, paidBy: "me", split: [], myShare: 0, settled: false },
        });
      } else {
        const friendShare = +(amt / numPeople).toFixed(2);
        const split = form.friendIds.map((fid) => {
          const friend = db.friends.find((f) => f.friendId === fid);
          return { id: fid, name: friend?.name || "Friend", share: friendShare };
        });
        dispatch({
          type: "ADD_EXPENSE",
          expense: { id: uid(), description: form.description, amount: amt, category: form.category,
                     date: form.date, paidBy: "me", split, myShare: friendShare, settled: false },
        });
      }
    } else {
      // Friend paid — I owe them my share
      const ms = parseFloat(form.myShare);
      if (isNaN(ms) || ms <= 0) return toast("Enter how much you owe");
      if (ms > amt) return toast("Your share can't exceed total amount");
      dispatch({
        type: "ADD_EXPENSE",
        expense: { id: uid(), description: form.description, amount: amt, category: form.category,
                   date: form.date, paidBy: form.paidBy, split: [], myShare: ms, settled: false },
      });
    }

    toast("✓ Expense added!");
    onClose();
  };

  return (
    <Modal title="Add Expense" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Who paid? */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Who Paid?
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill active={form.paidBy === "me"} onClick={() => set("paidBy", "me")}>✋ I Paid</Pill>
            {db.friends.map((f) => (
              <Pill key={f.friendId} active={form.paidBy === f.friendId} onClick={() => { set("paidBy", f.friendId); set("friendIds", [f.friendId]); }}>
                {f.name.split(" ")[0]} Paid
              </Pill>
            ))}
          </div>
        </div>

        <Input label="Description *" icon="📝" placeholder="e.g. Dinner at Nobu"
          value={form.description} onChange={(e) => set("description", e.target.value)} />

        <Input label="Total Amount *" icon="💰" type="number" placeholder="0.00"
          value={form.amount} onChange={(e) => set("amount", e.target.value)} />

        <Select label="Category" value={form.category} onChange={(e) => set("category", e.target.value)}
          options={CATEGORIES.map((c) => ({ value: c, label: `${CATEGORY_ICONS[c]} ${c}` }))} />

        <Input label="Date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />

        {/* Split with (only when I paid) */}
        {form.paidBy === "me" && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: colors.onSurfaceVariant, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Split With
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {db.friends.map((f) => (
                <Pill key={f.id} active={form.friendIds.includes(f.friendId)} onClick={() => toggleFriend(f.friendId)}>
                  {f.name.split(" ")[0]}
                </Pill>
              ))}
              {db.friends.length === 0 && (
                <p style={{ margin: 0, fontSize: 12, color: colors.onSurfaceVariant }}>Add friends first to split expenses.</p>
              )}
            </div>
          </div>
        )}

        {/* My share input (when friend paid) */}
        {form.paidBy !== "me" && (
          <Input label={`Your Share (${paidByFriendName} paid)`} icon="💸" type="number" placeholder="0.00"
            value={form.myShare} onChange={(e) => set("myShare", e.target.value)} />
        )}

        {/* Summary preview */}
        {amt > 0 && (
          <GlassCard style={{ padding: 14 }}>
            {form.paidBy === "me" && form.friendIds.length > 0 && (
              <p style={{ margin: 0, fontSize: 13, color: colors.onSurfaceVariant }}>
                Split {numPeople} ways →{" "}
                <strong style={{ color: colors.primary }}>{fmt(equalShare)}</strong> each ·{" "}
                <span style={{ color: "#16a34a" }}>Each friend owes you {fmt(equalShare)}</span>
              </p>
            )}
            {form.paidBy === "me" && form.friendIds.length === 0 && (
              <p style={{ margin: 0, fontSize: 13, color: colors.onSurfaceVariant }}>
                Personal expense · <strong style={{ color: colors.primary }}>{fmt(amt)}</strong> (no split)
              </p>
            )}
            {form.paidBy !== "me" && form.myShare && (
              <p style={{ margin: 0, fontSize: 13, color: colors.onSurfaceVariant }}>
                <span style={{ color: colors.error }}>You owe {paidByFriendName}</span>{" "}
                <strong style={{ color: colors.error }}>{fmt(parseFloat(form.myShare) || 0)}</strong>
              </p>
            )}
          </GlassCard>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn onClick={handleSubmit} style={{ flex: 2 }}>Add Expense →</Btn>
        </div>
      </div>
    </Modal>
  );
};

// ─── ADD FRIEND MODAL ─────────────────────────────────────────────────────────
export const AddFriendModal = ({ onClose }) => {
  const { dispatch, toast } = useApp();
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return toast("Enter a name");
    const initials = name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const color    = FRIEND_COLORS[Math.floor(Math.random() * FRIEND_COLORS.length)];
    dispatch({
      type: "ADD_FRIEND",
      friend: { id: uid(), friendId: uid(), name: name.trim(), email, avatar: initials, color, status: "active", lastSeen: "Just added", shared: [] },
    });
    toast("✓ Friend added!");
    onClose();
  };

  return (
    <Modal title="Add Friend" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Name *" icon="👤" placeholder="Elena Rodriguez" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email (optional)" icon="✉️" type="email" placeholder="elena@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn onClick={handleAdd} style={{ flex: 2 }}>Add Friend →</Btn>
        </div>
      </div>
    </Modal>
  );
};

// ─── SETTLE MODAL ─────────────────────────────────────────────────────────────
export const SettleModal = ({ balance, onClose }) => {
  const { dispatch, toast } = useApp();

  const handleSettle = () => {
    dispatch({ type: "SETTLE_BALANCE", balanceId: balance.id });
    toast("🎉 Settled up!");
    onClose();
  };

  return (
    <Modal title="Settle Up" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <Avatar name={balance.friendName} color={balance.color} size={72} />
        <h3 style={{ fontFamily: "Plus Jakarta Sans", fontSize: 20, fontWeight: 800, margin: "16px 0 4px", color: colors.onSurface }}>
          {balance.friendName}
        </h3>
        <p style={{ color: colors.onSurfaceVariant, margin: "0 0 24px", fontSize: 14 }}>
          {balance.direction === "owed" ? "owes you" : "you owe"}
        </p>
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "Plus Jakarta Sans", color: balance.direction === "owed" ? "#2d6a4f" : colors.error, marginBottom: 24 }}>
          {fmt(balance.amount)}
        </div>
        <GlassCard style={{ padding: 16, marginBottom: 24, textAlign: "left" }}>
          <p style={{ margin: 0, fontSize: 13, color: colors.onSurfaceVariant }}>
            Marking as settled will clear this balance.
          </p>
        </GlassCard>
        <div style={{ display: "flex", gap: 12 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn onClick={handleSettle} style={{ flex: 2 }}>
            {balance.direction === "owed" ? "Mark Received ✓" : "Mark as Paid ✓"}
          </Btn>
        </div>
      </div>
    </Modal>
  );
};

// ─── FRIEND EXPENSE MODAL ─────────────────────────────────────────────────────
// Quick modal opened when tapping a friend card — pre-selects that friend
export const FriendExpenseModal = ({ friend, onClose }) => {
  const [mode, setMode] = useState(null); // "ipaid" | "theypaid"

  if (!mode) return (
    <Modal title={`Expense with ${friend.friendName.split(" ")[0]}`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
        <Avatar name={friend.friendName} color={friend.color} size={56} />
        <p style={{ margin: "8px 0 20px", fontSize: 14, color: colors.onSurfaceVariant, textAlign: "center" }}>
          Choose who paid for this expense
        </p>
        <Btn onClick={() => setMode("ipaid")} style={{ width: "100%", borderRadius: 14, padding: "16px" }}>
          ✋ I Paid — {friend.friendName.split(" ")[0]} owes me
        </Btn>
        <Btn variant="ghost" onClick={() => setMode("theypaid")} style={{ width: "100%", borderRadius: 14, padding: "16px" }}>
          💳 {friend.friendName.split(" ")[0]} Paid — I owe them
        </Btn>
      </div>
    </Modal>
  );

  return (
    <AddExpenseModal
      onClose={onClose}
      preselectedFriend={{ friendId: friend.friendId, name: friend.friendName }}
      preselectedPaidBy={mode === "ipaid" ? "me" : friend.friendId}
    />
  );
};
