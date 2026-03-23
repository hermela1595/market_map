import pool from "../config/db.js";

export const findListingById = async (listingId) => {
  const [rows] = await pool.query(
    "SELECT id, title, seller_id FROM listings WHERE id = ?",
    [listingId],
  );
  return rows[0];
};

export const getOrCreateConversation = async ({
  listingId,
  buyerId,
  sellerId,
}) => {
  const [existing] = await pool.query(
    "SELECT id FROM conversations WHERE listing_id = ? AND buyer_id = ? AND seller_id = ?",
    [listingId, buyerId, sellerId],
  );

  if (existing[0]) {
    return existing[0].id;
  }

  const [result] = await pool.query(
    "INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES (?, ?, ?)",
    [listingId, buyerId, sellerId],
  );

  return result.insertId;
};

export const getConversationsForUser = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      c.id,
      c.listing_id,
      l.title AS listing_title,
      c.buyer_id,
      c.seller_id,
      CASE WHEN c.buyer_id = ? THEN su.name ELSE bu.name END AS counterpart_name,
      CASE WHEN c.buyer_id = ? THEN su.email ELSE bu.email END AS counterpart_email,
      lm.body AS last_message,
      lm.sender_id AS last_message_sender_id,
      lm.created_at AS last_message_at,
      c.updated_at
    FROM conversations c
    INNER JOIN users bu ON bu.id = c.buyer_id
    INNER JOIN users su ON su.id = c.seller_id
    LEFT JOIN listings l ON l.id = c.listing_id
    LEFT JOIN messages lm ON lm.id = (
      SELECT m2.id
      FROM messages m2
      WHERE m2.conversation_id = c.id
      ORDER BY m2.created_at DESC, m2.id DESC
      LIMIT 1
    )
    WHERE c.buyer_id = ? OR c.seller_id = ?
    ORDER BY COALESCE(lm.created_at, c.updated_at) DESC
    `,
    [userId, userId, userId, userId],
  );

  return rows;
};

export const getConversationByIdForUser = async (conversationId, userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      c.id,
      c.listing_id,
      l.title AS listing_title,
      c.buyer_id,
      c.seller_id,
      CASE WHEN c.buyer_id = ? THEN su.name ELSE bu.name END AS counterpart_name,
      CASE WHEN c.buyer_id = ? THEN su.email ELSE bu.email END AS counterpart_email
    FROM conversations c
    INNER JOIN users bu ON bu.id = c.buyer_id
    INNER JOIN users su ON su.id = c.seller_id
    LEFT JOIN listings l ON l.id = c.listing_id
    WHERE c.id = ? AND (c.buyer_id = ? OR c.seller_id = ?)
    `,
    [userId, userId, conversationId, userId, userId],
  );

  return rows[0];
};

export const getMessagesByConversationId = async (conversationId) => {
  const [rows] = await pool.query(
    `
    SELECT
      m.id,
      m.sender_id,
      u.name AS sender_name,
      m.body,
      m.created_at
    FROM messages m
    INNER JOIN users u ON u.id = m.sender_id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC, m.id ASC
    `,
    [conversationId],
  );

  return rows;
};

export const createMessage = async ({ conversationId, senderId, body }) => {
  const [result] = await pool.query(
    "INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)",
    [conversationId, senderId, body],
  );

  await pool.query("UPDATE conversations SET updated_at = NOW() WHERE id = ?", [
    conversationId,
  ]);

  return result.insertId;
};
