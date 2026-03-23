import express from "express";
import {
  listUsers,
  changeUserRole,
  removeUser,
  getStats,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), asyncHandler(listUsers));
router.put(
  "/users/:id/role",
  protect,
  authorizeRoles("admin"),
  asyncHandler(changeUserRole),
);
router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  asyncHandler(removeUser),
);
router.get("/stats", protect, authorizeRoles("admin"), asyncHandler(getStats));

export default router;
