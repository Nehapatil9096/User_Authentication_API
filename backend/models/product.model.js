import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  images: {
    type: [String], // Assuming images is an array of strings (URLs)
    required: true
  }
});

const Product = mongoose.model("Product", productSchema, "items");

export default Product;
