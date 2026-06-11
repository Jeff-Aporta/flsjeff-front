/* core/auth — sesión compartida system-login (todas las apps front). */
(function () {
  "use strict";
  const SESSION_KEY = "system-login:session";
  const AUTH_EVT = "system-login:auth";
  const AUTH_LOCAL = "http://localhost:8787";
  const AUTH_ONLINE = "https://system-login.jeffaporta.workers.dev";
  const LOGIN_URL = "https://jeff-aporta.github.io/system-login-front/";

  type Session = { username?: string; token?: string; expiresAt?: string | null };

  function read(): Session | null {
    try {
      const v = sessionStorage.getItem(SESSION_KEY);
      return v ? (JSON.parse(v) as Session) : null;
    } catch (e) { return null; }
  }

  function authBase(): string {
    try {
      if (localStorage.getItem("system-login:local") === "1") return AUTH_LOCAL;
    } catch (e) {}
    return AUTH_ONLINE;
  }

  function isLoggedIn(): boolean {
    const s = read();
    if (!s?.token) return false;
    if (s.expiresAt && new Date(s.expiresAt).getTime() < Date.now()) return false;
    return true;
  }

  function username(): string | null { return read()?.username ?? null; }

  function authHeader(): Record<string, string> {
    const s = read();
    return s?.token ? { Authorization: "Bearer " + s.token } : {};
  }

  async function login(user: string, pass: string): Promise<void> {
    const res = await fetch(authBase().replace(/\/$/, "") + "/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) throw new Error(data.error || "Login fallido");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      username: data.username || user,
      token: data.token,
      expiresAt: data.expiresAt ?? null,
    }));
    window.dispatchEvent(new Event(AUTH_EVT));
  }

  function logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(AUTH_EVT));
  }

  const w = window as any;
  w.FLS = w.FLS || {};
  w.FLS.Auth = {
    isLoggedIn, username, authHeader, login, logout,
    LOGIN_URL, EVENT: AUTH_EVT, AUTH_ONLINE,
  };
})();
