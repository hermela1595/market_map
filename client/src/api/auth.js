/**
 * Auth API — thin wrapper around the backend /api/auth/* endpoints.
 * Tokens are kept in memory (AuthContext); only persisted to
 * localStorage so the session survives a hard reload.
 */

const BASE = "/api/auth";

async function request(path, { headers: extraHeaders, ...rest } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...extraHeaders },
    ...rest,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.rules = data.rules ?? null;
    throw err;
  }

  return data;
}

/**
 * POST /api/auth/register
 * @param {{ name: string, email: string, password: string, role: string }} payload
 */
export function register(payload) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/auth/login
 * @param {{ email: string, password: string }} payload
 */
export function loginUser(payload) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/auth/me  (requires Bearer token)
 * @param {string} token
 */
export function getMe(token) {
  return request("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
