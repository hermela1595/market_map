import {
  findListingById,
  getOrCreateConversation,
  getConversationsForUser,
  getConversationByIdForUser,
  getMessagesByConversationId,
  createMessage,
} from "../models/Message.js";

export const initConversation = async (req, res) => {
  const listingId = Number(req.body?.listing_id);

  if (!Number.isInteger(listingId) || listingId <= 0) {
    return res.status(400).json({ message: "listing_id is required" });
  }

  const listing = await findListingById(listingId);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.seller_id === req.user.id) {
    return res.status(400).json({ message: "You cannot message yourself" });
  }

  const conversationId = await getOrCreateConversation({
    listingId,
    buyerId: req.user.id,
    sellerId: listing.seller_id,
  });

  res.json({ conversation_id: conversationId });
};

export const listConversations = async (req, res) => {
  const conversations = await getConversationsForUser(req.user.id);
  res.json(conversations);
};

export const getConversationMessages = async (req, res) => {
  const conversationId = Number(req.params.id);

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return res.status(400).json({ message: "Invalid conversation id" });
  }

  const conversation = await getConversationByIdForUser(
    conversationId,
    req.user.id,
  );
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  const messages = await getMessagesByConversationId(conversationId);
  res.json({ conversation, messages });
};

export const sendConversationMessage = async (req, res) => {
  const conversationId = Number(req.params.id);
  const body = String(req.body?.body || "").trim();

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    return res.status(400).json({ message: "Invalid conversation id" });
  }

  if (!body) {
    return res.status(400).json({ message: "Message body is required" });
  }

  const conversation = await getConversationByIdForUser(
    conversationId,
    req.user.id,
  );
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  const messageId = await createMessage({
    conversationId,
    senderId: req.user.id,
    body,
  });

  res.status(201).json({ id: messageId, message: "Message sent" });
};
