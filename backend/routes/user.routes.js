import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getUserData, updateUser, getUserCards, getOneCard, deleteCard, passUpdate } from "../controllers/user.controller.js"; // Include getUserCards

// Import the Product model (if needed)
 import Product from "../models/product.model.js";

// Import Mongoose for accessing the database
import mongoose from "mongoose";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/user-data", protectRoute, getUserData);
router.post("/update", protectRoute, updateUser); // Add new card to user's collection
router.delete("/cards/:cardId", protectRoute, deleteCard); // Delete a card from the users collection
router.put("/settings", protectRoute, passUpdate); // Add new card to user's collection


router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Search products
router.get("/products/search", async (req, res) => {
  try {
    const query = req.query.q; // Get the search query from the request query parameters
    const regex = new RegExp(query, "i"); // Case-insensitive regex pattern
    
    // Find products that match the search query
    const products = await Product.find({
      $or: [
        { name: { $regex: regex } },
       // { brand: { $regex: regex } },
       // { color: { $regex: regex } },
       // { type: { $regex: regex } }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Fetch a single product by ID

router.get("/products/:productId", async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


export default router;
