import express from "express";
import { getMyListings, getMyStats } from "../controllers/sellerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get(
  "/my-listings",
  protect,
  authorizeRoles("seller", "admin"),
  asyncHandler(getMyListings),
);
router.get(
  "/stats",
  protect,
  authorizeRoles("seller", "admin"),
  asyncHandler(getMyStats),
);

export default router;
