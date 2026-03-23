import express from "express";
import {
  createNewListing,
  fetchListings,
  fetchListingById,
  fetchCategories,
  fetchRegions,
  editListing,
  removeListing,
} from "../controllers/listingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(fetchListings));
router.get("/categories", asyncHandler(fetchCategories));
router.get("/regions", asyncHandler(fetchRegions));
router.post("/", protect, asyncHandler(createNewListing));
router.get("/:id", asyncHandler(fetchListingById));
router.put("/:id", protect, asyncHandler(editListing));
router.delete("/:id", protect, asyncHandler(removeListing));

export default router;
