import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import {  updateCart, myCartdetails,updateFeedback,updateOrder,getInvoiceDetails,getOrderDetails,getUserProfile} from "../controllers/user.controller.js"; // Include getUserCards

// Import the Product model (if needed)
 import Product from "../models/product.model.js";


const router = express.Router();


router.post("/cart/add", protectRoute, updateCart); 
router.get("/cart", protectRoute, myCartdetails); 
router.post("/feedback", protectRoute, updateFeedback); 
router.post("/order", protectRoute, updateOrder); 
router.get("/invoices", protectRoute, getInvoiceDetails);
router.get("/invoices/:invoiceId", protectRoute, getOrderDetails);
router.get("/profile", protectRoute, getUserProfile);

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
  
      // Define filtering criteria
      const filterCriteria = {};
  
      // Handle filtering criteria from frontend
      if (req.query.headphoneType) {
        filterCriteria.type = req.query.headphoneType;
      }
      if (req.query.company) {
        filterCriteria.brand = req.query.company;
      }
      if (req.query.color) {
        filterCriteria.color = req.query.color;
      }

      //let products = await Product.find({ $or: [{ name: { $regex: regex } }] });
      let products = await Product.find({$and: [
        { $or: [{ name: { $regex: regex } }] },
        filterCriteria // Apply filtering criteria
        ]});
      if (req.query.price) {
        console.log("Price query:", req.query.price); // Log the value of price query
        // Parse price range from string format (e.g., "10000-20000")
        const priceRange = req.query.price.trim().split("-");
        console.log("Price range:", priceRange); // Log the parsed price range array
        if (priceRange.length === 2) {
            const minPrice = Number(priceRange[0]);
            const maxPrice = Number(priceRange[1]);
         
          console.log("Parsed minPrice:", minPrice); // Log parsed minPrice
          console.log("Parsed maxPrice:", maxPrice); // Log parsed maxPrice
                         // Filter products based on price range
                         products = products.filter(product => {
                            const productPrice = parseFloat(product.price.replace(/[^\d.]/g, ''));
                            return productPrice >= minPrice && productPrice <= maxPrice;
                        });
        
        } else {
          // Handle invalid price range format
          console.error("Invalid price range format:", req.query.price);
        }
      }

     
  
        // Sorting logic
        if (req.query.sortBy === "priceLowest") {
            products = products.sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/[^\d.]/g, ''));
                const priceB = parseFloat(b.price.replace(/[^\d.]/g, ''));
                return priceA - priceB;
            });
        } else if (req.query.sortBy === "priceHighest") {
            products = products.sort((a, b) => {
                const priceA = parseFloat(a.price.replace(/[^\d.]/g, ''));
                const priceB = parseFloat(b.price.replace(/[^\d.]/g, ''));
                return priceB - priceA;
            });
        } else if (req.query.sortBy === "nameAZ") {
            products = products.sort((a, b) => a.name.localeCompare(b.name));
        } else if (req.query.sortBy === "nameZA") {
            products = products.sort((a, b) => b.name.localeCompare(a.name));
        }
  
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

// Route for handling feedback submissions
// Route for handling feedback submissions

export default router;
