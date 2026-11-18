/* Shared API helper (DEV-11). Everyone uses window.api to talk to the backend.
 *
 * Backend URL: defaults to http://localhost:3001/api.
 * To point somewhere else (e.g. the deployed server), run once in the browser console:
 *   localStorage.setItem("eyk-api-base", "https://your-backend.example.com/api")
 *
 * Usage in app.js:
 *   const { token, user } = await api.login(username, password);
 *   const products = await api.get("/products");
 *   await api.post("/sales", { product: "PRD-001", quantity: 2 });
 * Requests send the saved token automatically. A failed request throws an
 * Error whose message comes from the backend ({ error: "..." }).
 */
(() => {
  "use strict";
  const TOKEN_KEY = "eyk-token";
  const BASE_KEY = "eyk-api-base";
  const DEFAULT_BASE = "http://localhost:3001/api";

  const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} };

  const base = () => (read(BASE_KEY) || DEFAULT_BASE).replace(/\/+$/, "");

  async function request(method, path, body) {
    const headers = { "Content-Type": "application/json" };
    const token = read(TOKEN_KEY);
    if (token) headers.Authorization = "Bearer " + token;

    let res;
    try {
      res = await fetch(base() + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new Error("Cannot reach the server. Is the backend running?");
    }

    let data = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      if (res.status === 401 && token && path !== "/auth/login") write(TOKEN_KEY, null);
      throw new Error((data && data.error) || "Request failed (" + res.status + ")");
    }
    return data;
  }

  window.api = {
    base,
    getToken: () => read(TOKEN_KEY),
    setToken: (t) => write(TOKEN_KEY, t),
    clearToken: () => write(TOKEN_KEY, null),
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body || {}),
    put: (path, body) => request("PUT", path, body || {}),
    patch: (path, body) => request("PATCH", path, body || {}),
    del: (path) => request("DELETE", path),
    login: (username, password) => request("POST", "/auth/login", { username, password }),
    me: () => request("GET", "/auth/me"),
  };
})();