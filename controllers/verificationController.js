import pool from "../config/db.js";
import { createVerificationLog } from "../models/VerificationLog.js";

export const verifyListing = async (req, res) => {
  const { status, notes } = req.body;
  const listingId = req.params.id;

  const logId = await createVerificationLog(
    listingId,
    req.user.id,
    status,
    notes,
  );

  await pool.query(
    "UPDATE listings SET verified = ?, verification_log_id = ? WHERE id = ?",
    [status === "approved", logId, listingId],
  );

  res.json({ message: "Verification updated" });
};

export const getPendingListings = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM listings WHERE verified = FALSE",
  );
  res.json(rows);
};
