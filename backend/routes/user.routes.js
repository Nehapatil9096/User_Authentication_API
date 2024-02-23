// routes/user.routes.js

import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getUserData, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/user-data", protectRoute, getUserData);
router.post("/update", protectRoute, updateUser); // Add this line for the update route

export default router;
