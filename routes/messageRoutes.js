import express from "express";
import {
  initConversation,
  listConversations,
  getConversationMessages,
  sendConversationMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.use(protect);

router.get("/conversations", asyncHandler(listConversations));
router.post("/conversations", asyncHandler(initConversation));
router.get(
  "/conversations/:id/messages",
  asyncHandler(getConversationMessages),
);
router.post(
  "/conversations/:id/messages",
  asyncHandler(sendConversationMessage),
);

export default router;
