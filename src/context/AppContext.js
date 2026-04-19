import { createContext, useContext, useState, useCallback } from "react";
import {
  loadUserDB, saveUserDB,
  getSession, setSession, clearSession,
  loginUser, registerUser,
} from "../utils/db";
import { uid } from "../utils/constants";

export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    // ── ADD_EXPENSE ────────────────────────────────────────────────────────────
    // paidBy: "me"     → I paid, friends owe me their share
    // paidBy: friendId → friend paid, I owe them my share; other friends owe them too (tracked separately)
    case "ADD_EXPENSE": {
      const expenses = [action.expense, ...state.expenses];
      const balances = state.balances.map((b) => ({ ...b }));
      const { paidBy, split } = action.expense;

      if (paidBy === "me") {
        // I paid — each split friend owes me their share
        split.forEach((s) => {
          const bal = balances.find((b) => b.friendId === s.id);
          if (!bal) return;
          applyOwedToMe(bal, s.share);
        });
      } else {
        // A friend paid — I owe them my share (myShare stored in split[0] as the "me" entry)
        const myShare = action.expense.myShare || 0;
        if (myShare > 0) {
          const bal = balances.find((b) => b.friendId === paidBy);
          if (bal) applyIOwe(bal, myShare);
        }
      }

      return { ...state, expenses, balances };
    }

    // ── DELETE_EXPENSE ─────────────────────────────────────────────────────────
    case "DELETE_EXPENSE": {
      const exp = state.expenses.find((e) => e.id === action.id);
      const expenses = state.expenses.filter((e) => e.id !== action.id);
      const balances = state.balances.map((b) => ({ ...b }));

      if (exp && !exp.settled) {
        if (exp.paidBy === "me") {
          exp.split.forEach((s) => {
            const bal = balances.find((b) => b.friendId === s.id);
            if (!bal) return;
            reverseOwedToMe(bal, s.share);
          });
        } else {
          const myShare = exp.myShare || 0;
          if (myShare > 0) {
            const bal = balances.find((b) => b.friendId === exp.paidBy);
            if (bal) reverseIOwe(bal, myShare);
          }
        }
      }

      return { ...state, expenses, balances };
    }

    case "SETTLE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.id ? { ...e, settled: true } : e
        ),
      };

    case "ADD_FRIEND":
      return {
        ...state,
        friends: [...state.friends, action.friend],
        balances: [
          ...state.balances,
          {
            id: uid(),
            friendId: action.friend.friendId,
            friendName: action.friend.name,
            avatar: action.friend.avatar,
            color: action.friend.color,
            amount: 0,
            direction: "settled",
          },
        ],
      };

    case "DELETE_FRIEND":
      return {
        ...state,
        friends:  state.friends.filter((f) => f.friendId !== action.friendId),
        balances: state.balances.filter((b) => b.friendId !== action.friendId),
        expenses: state.expenses.map((e) => ({
          ...e,
          split: e.split.filter((s) => s.id !== action.friendId),
        })),
      };

    case "SETTLE_BALANCE":
      return {
        ...state,
        balances: state.balances.map((b) =>
          b.id === action.balanceId ? { ...b, amount: 0, direction: "settled" } : b
        ),
      };

    case "UPDATE_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.profile } };

    default:
      return state;
  }
}

// ─── BALANCE HELPERS ──────────────────────────────────────────────────────────
function applyOwedToMe(bal, share) {
  if (bal.direction === "owed") {
    bal.amount = +(bal.amount + share).toFixed(2);
  } else if (bal.direction === "owes") {
    bal.amount = +(bal.amount - share).toFixed(2);
    if (bal.amount < 0)      { bal.direction = "owed"; bal.amount = +Math.abs(bal.amount).toFixed(2); }
    else if (bal.amount === 0) { bal.direction = "settled"; }
  } else {
    bal.direction = "owed";
    bal.amount    = +share.toFixed(2);
  }
}

function applyIOwe(bal, share) {
  if (bal.direction === "owes") {
    bal.amount = +(bal.amount + share).toFixed(2);
  } else if (bal.direction === "owed") {
    bal.amount = +(bal.amount - share).toFixed(2);
    if (bal.amount < 0)      { bal.direction = "owes"; bal.amount = +Math.abs(bal.amount).toFixed(2); }
    else if (bal.amount === 0) { bal.direction = "settled"; }
  } else {
    bal.direction = "owes";
    bal.amount    = +share.toFixed(2);
  }
}

function reverseOwedToMe(bal, share) {
  applyIOwe(bal, share); // reverse = apply opposite
}

function reverseIOwe(bal, share) {
  applyOwedToMe(bal, share);
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [userId,  setUserId]  = useState(() => getSession()?.userId || null);
  const [db,      setDb]      = useState(() => userId ? loadUserDB(userId) : null);
  const [toastMsg, setToastMsg] = useState(null);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    const result = loginUser(email, password);
    if (!result) return "Invalid email or password.";
    setSession(result.userId);
    setUserId(result.userId);
    setDb(result);
    return null; // no error
  }, []);

  const register = useCallback((name, email, password) => {
    const result = registerUser(name, email, password);
    if (result.error) return result.error;
    setSession(result.userId);
    setUserId(result.userId);
    setDb(result);
    return null;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUserId(null);
    setDb(null);
  }, []);

  // ── Data dispatch ─────────────────────────────────────────────────────────
  const dispatch = useCallback((action) => {
    setDb((prev) => {
      const next = reducer(prev, action);
      if (userId) saveUserDB(userId, next);
      return next;
    });
  }, [userId]);

  const toast     = useCallback((msg) => setToastMsg(msg), []);
  const clearToast = useCallback(() => setToastMsg(null), []);

  const isAuthed = !!userId && !!db;

  return (
    <AppCtx.Provider value={{ db, dispatch, toast, toastMsg, clearToast, login, register, logout, isAuthed, userId }}>
      {children}
    </AppCtx.Provider>
  );
}
