// routes/user.routes.js

import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getUserData, updateUser, getUserCards, getOneCard, deleteCard, passUpdate } from "../controllers/user.controller.js"; // Include getUserCards
import { moveCardToSection } from "../controllers/card.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/user-data", protectRoute, getUserData);
router.get("/cards", protectRoute, getUserCards); // New route for fetching cards
router.put("/onecard/:cardId", protectRoute, getOneCard);// To update edited card data
router.put("/cards/:cardId/move", protectRoute, moveCardToSection);// To move cards within sections
router.post("/update", protectRoute, updateUser);//Add new card to  user's collection
router.delete("/cards/:cardId", protectRoute, deleteCard);// Delete a card  from the users collection

router.put("/settings", protectRoute, passUpdate);//Add new card to  user's collection

export default router;
