import express from "express";
import {
  register,
  login,
  getMe,
  resetPasswordForTesting,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));
router.post("/test/reset-password", asyncHandler(resetPasswordForTesting));

export default router;
