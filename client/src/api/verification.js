const VERIFY_BASE = "/api/verify";

function sanitizeToken(value) {
  const raw = String(value || "").trim();
  const token = raw.replace(/^"|"$/g, "");
  if (!token || token === "undefined" || token === "null") return "";
  return token.split(".").length === 3 ? token : "";
}

function resolveToken(preferredToken) {
  const fromArg = sanitizeToken(preferredToken);
  if (fromArg) return fromArg;
  return sanitizeToken(localStorage.getItem("mm_token"));
}

async function request(path, { token, headers, ...rest } = {}) {
  const resolvedToken = resolveToken(token);
  const res = await fetch(`${VERIFY_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...headers,
    },
    ...rest,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("mm_token");
      localStorage.removeItem("mm_user");
    }
    const err = new Error(
      res.status === 401
        ? "Session expired. Please log in again."
        : data.message || "Request failed",
    );
    err.status = res.status;
    throw err;
  }

  return data;
}

export function fetchPendingVerifications(token) {
  return request("/pending", { token });
}

export function submitVerification(listingId, payload, token) {
  return request(`/${listingId}`, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}
