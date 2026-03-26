import { buildApiUrl } from "./baseUrl.js";

const LISTINGS_BASE = "/api/listings";

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
  const res = await fetch(buildApiUrl(`${LISTINGS_BASE}${path}`), {
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

export function createListing(payload, token) {
  return request("/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function fetchListings(token) {
  return request("/", { token });
}

export function removeListing(id, token) {
  return request(`/${id}`, {
    method: "DELETE",
    token,
  });
}
