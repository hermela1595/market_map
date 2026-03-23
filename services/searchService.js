import pool from "../config/db.js";

const ALLOWED_SORT_FIELDS = ["created_at", "price", "title"];
const ALLOWED_ORDERS = ["ASC", "DESC"];

export const searchListings = async ({
  q,
  category,
  region,
  verified,
  page = 1,
  limit = 20,
  sort = "created_at",
  order = "DESC",
} = {}) => {
  const safeSort = ALLOWED_SORT_FIELDS.includes(sort) ? sort : "created_at";
  const safeOrder = ALLOWED_ORDERS.includes(String(order).toUpperCase())
    ? String(order).toUpperCase()
    : "DESC";

  const conditions = ["1=1"];
  const params = [];

  if (q) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    params.push(`%${q}%`, `%${q}%`);
  }
  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }
  if (region) {
    conditions.push("region = ?");
    params.push(region);
  }
  if (verified !== undefined) {
    conditions.push("verified = ?");
    params.push(verified === "true" || verified === true ? 1 : 0);
  }

  const where = conditions.join(" AND ");
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  const [rows] = await pool.query(
    `SELECT * FROM listings WHERE ${where} ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`,
    [...params, limitNum, offset],
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM listings WHERE ${where}`,
    params,
  );

  return {
    listings: rows,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  };
};
