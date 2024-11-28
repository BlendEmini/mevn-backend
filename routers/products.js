import express from "express";
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

// Routes
productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.post("/", createProduct);
productsRouter.put("/:id", updateProduct);
productsRouter.delete("/:id", deleteProduct);
productsRouter.get("/get/featured/:count", getFeaturedProducts);
productsRouter.put("/gallery-images/:id", updateProductImages);

export default productsRouter;
