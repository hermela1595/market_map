import express from "express";
import {
  verifyListing,
  getPendingListings,
} from "../controllers/verificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get(
  "/pending",
  protect,
  authorizeRoles("verifier", "admin"),
  asyncHandler(getPendingListings),
);
router.post(
  "/:id",
  protect,
  authorizeRoles("verifier", "admin"),
  asyncHandler(verifyListing),
);

export default router;
