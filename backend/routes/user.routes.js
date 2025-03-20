import express from "express";
import protectRoute, { authorize } from "../middleware/protectRoute.js";
import { getUserProfile, getAdminDashboard } from "../controllers/user.controller.js"; 

const router = express.Router();

// User Profile - Accessible by logged-in users
router.get("/profile", protectRoute, getUserProfile);

// Admin Dashboard - Only accessible by Admins
router.get("/admin", protectRoute, authorize("admin"), getAdminDashboard);

export default router;
