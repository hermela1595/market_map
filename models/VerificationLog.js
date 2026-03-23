import pool from "../config/db.js";

export const createVerificationLog = async (
  listing_id,
  verifier_id,
  status,
  notes,
) => {
  const [result] = await pool.query(
    "INSERT INTO verification_logs (listing_id, verifier_id, status, notes) VALUES (?, ?, ?, ?)",
    [listing_id, verifier_id, status, notes],
  );
  return result.insertId;
};
