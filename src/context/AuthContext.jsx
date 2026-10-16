import { createContext, useContext, useEffect, useMemo, useState } from "react";

const USERS_KEY = "cedarline-users";
const SESSION_KEY = "cedarline-session";

export const DEMO_LOGIN = {
  id: "demo-rider",
  name: "Demo Rider",
  email: "demo@cedarline.example",
  phone: "9876543210",
  password: "demo123",
};

const AuthContext = createContext(null);

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function digest(value) {
  const data = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readJSON(USERS_KEY, []));
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null));

  useEffect(() => {
    let cancelled = false;
    digest(DEMO_LOGIN.password).then((passwordHash) => {
      if (cancelled) return;
      setUsers((current) => {
        if (current.some((account) => account.email.toLowerCase() === DEMO_LOGIN.email)) return current;
        return [
          ...current,
          {
            id: DEMO_LOGIN.id,
            name: DEMO_LOGIN.name,
            email: DEMO_LOGIN.email,
            phone: DEMO_LOGIN.phone,
            passwordHash,
          },
        ];
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const api = useMemo(
    () => ({
      user,
      async signup({ name, email, phone, password }) {
        const existing = users.some((account) => account.email.toLowerCase() === email.toLowerCase());
        if (existing) return { ok: false, error: "An account with this email already exists" };
        const next = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: email.trim(),
          phone,
          passwordHash: await digest(password),
        };
        setUsers((current) => [...current, next]);
        setUser({ id: next.id, name: next.name, email: next.email, phone: next.phone });
        return { ok: true };
      },
      async login({ email, password }) {
        const normalized = email.trim().toLowerCase();
        let account = users.find((item) => item.email.toLowerCase() === normalized);
        if (!account && normalized === DEMO_LOGIN.email) {
          const passwordHash = await digest(DEMO_LOGIN.password);
          account = {
            id: DEMO_LOGIN.id,
            name: DEMO_LOGIN.name,
            email: DEMO_LOGIN.email,
            phone: DEMO_LOGIN.phone,
            passwordHash,
          };
          setUsers((current) => (current.some((item) => item.email.toLowerCase() === DEMO_LOGIN.email) ? current : [...current, account]));
        }
        if (!account) return { ok: false, error: "No account found with that email" };
        const passwordHash = await digest(password);
        if (account.passwordHash !== passwordHash) return { ok: false, error: "Incorrect password" };
        setUser({ id: account.id, name: account.name, email: account.email, phone: account.phone });
        return { ok: true };
      },
      logout() {
        setUser(null);
      },
    }),
    [user, users],
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
