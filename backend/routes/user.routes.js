// routes/user.routes.js

import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getUserData } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js"; // Import the controller function to handle the update

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/user-data", protectRoute, getUserData);

router.post("/update/email", protectRoute, updateUser);


// Add new routes or update existing ones based on your application's needs

export default router;
