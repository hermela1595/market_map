import pool from "../config/db.js";
import { createVerificationLog } from "../models/VerificationLog.js";

export const processVerification = async (
  listingId,
  verifierId,
  status,
  notes,
) => {
  const logId = await createVerificationLog(
    listingId,
    verifierId,
    status,
    notes,
  );

  await pool.query(
    "UPDATE listings SET verified = ?, verification_log_id = ? WHERE id = ?",
    [status === "approved" ? 1 : 0, logId, listingId],
  );

  return logId;
};

export const fetchPendingListings = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM listings WHERE verified = FALSE ORDER BY created_at DESC",
  );
  return rows;
};

export const getVerificationHistory = async (listingId) => {
  const [rows] = await pool.query(
    `SELECT vl.*, u.name AS verifier_name
     FROM verification_logs vl
     JOIN users u ON u.id = vl.verifier_id
     WHERE vl.listing_id = ?
     ORDER BY vl.created_at DESC`,
    [listingId],
  );
  return rows;
};
