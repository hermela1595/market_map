import pool from "../config/db.js";

const VALID_ROLES = ["buyer", "seller", "admin", "verifier"];

export const getAllUsers = async () => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC",
  );
  return rows;
};

export const updateUserRole = async (userId, role) => {
  if (!VALID_ROLES.includes(role)) {
    throw new Error("Invalid role");
  }

  await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
};

export const deleteUser = async (userId) => {
  await pool.query("DELETE FROM users WHERE id = ?", [userId]);
};

export const getPlatformStats = async () => {
  const [[stats]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM users) AS totalUsers,
       (SELECT COUNT(*) FROM listings) AS totalListings,
       (SELECT COUNT(*) FROM listings WHERE verified = 1) AS verifiedListings,
       (SELECT COUNT(*) FROM listings WHERE verified = 0) AS pendingListings`,
  );

  return stats;
};
