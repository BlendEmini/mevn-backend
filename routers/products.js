import express from "express";
import { isAdmin } from "../helpers/jwt.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  updateProductImages,
} from "../controllers/productController.js";

const productsRouter = express.Router();

// Public routes
productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.get("/get/featured/:count", getFeaturedProducts);

// Admin-only routes
productsRouter.post("/", isAdmin, createProduct);
productsRouter.put("/:id", isAdmin, updateProduct);
productsRouter.delete("/:id", isAdmin, deleteProduct);
productsRouter.put("/gallery-images/:id", isAdmin, updateProductImages);

export default productsRouter;
