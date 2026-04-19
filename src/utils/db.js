// ─── PER-USER STORAGE ─────────────────────────────────────────────────────────
// Each user gets their own localStorage key so data never leaks between accounts.

const ROOT_KEY = "paysplit_v2_users";
const SESSION_KEY = "paysplit_v2_session";

// ---------- session ----------
export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
};
export const setSession = (userId) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
};
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

// ---------- all-users registry ----------
const loadAllUsers = () => {
  try { return JSON.parse(localStorage.getItem(ROOT_KEY)) || {}; } catch { return {}; }
};
const saveAllUsers = (all) => {
  localStorage.setItem(ROOT_KEY, JSON.stringify(all));
};

// ---------- per-user data ----------
export const loadUserDB = (userId) => {
  const all = loadAllUsers();
  return all[userId] || null;
};
export const saveUserDB = (userId, data) => {
  const all = loadAllUsers();
  all[userId] = data;
  saveAllUsers(all);
};

// ---------- auth helpers ----------
export const findUserByEmail = (email) => {
  const all = loadAllUsers();
  for (const uid of Object.keys(all)) {
    const u = all[uid]?.profile;
    if (u?.email?.toLowerCase() === email.toLowerCase()) return { userId: uid, ...u };
  }
  return null;
};

export const registerUser = (name, email, password) => {
  const existing = findUserByEmail(email);
  if (existing) return { error: "Email already registered. Please sign in." };

  const userId = "u_" + Math.random().toString(36).slice(2, 10);
  const initials = name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const COLORS = ["#6d22ed", "#9d365b", "#7543a8", "#2d6a4f", "#c77c3e", "#1a6985"];
  const color  = COLORS[Math.floor(Math.random() * COLORS.length)];

  const freshDB = {
    friends:  [],
    expenses: [],
    balances: [],
    profile: {
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,           // plain-text fine for local demo; use hashing in real backend
      avatar: initials,
      color,
      currency: "USD",
      notifications: true,
      autoSettle: false,
    },
  };

  saveUserDB(userId, freshDB);
  return { userId, ...freshDB };
};

export const loginUser = (email, password) => {
  const all = loadAllUsers();
  for (const userId of Object.keys(all)) {
    const db = all[userId];
    if (
      db?.profile?.email?.toLowerCase() === email.toLowerCase() &&
      db?.profile?.password === password
    ) {
      return { userId, ...db };
    }
  }
  return null;
};

// ─── LEGACY HELPER (kept so existing imports don't break) ────────────────────
export const loadDB   = () => null;   // not used anymore
export const saveDB   = () => {};     // not used anymore
export const initDB   = () => ({});   // not used anymore
