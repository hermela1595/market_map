const rawBase = String(import.meta.env.VITE_API_BASE_URL || "").trim();

// Remove trailing slashes so joins always produce valid URLs.
const normalizedBase = rawBase.replace(/\/+$/, "");

export function buildApiUrl(path) {
  const normalizedPath = String(path || "").replace(/^\/+/, "");

  if (!normalizedBase) {
    return `/${normalizedPath}`;
  }

  return `${normalizedBase}/${normalizedPath}`;
}
