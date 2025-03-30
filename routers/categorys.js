import express from "express";
import { isAdmin } from "../helpers/jwt.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const categoryRoute = express.Router();

// Public routes
categoryRoute.get("/", getAllCategories);
categoryRoute.get("/:id", getCategoryById);

// Admin-only routes
categoryRoute.post("/", isAdmin, createCategory);
categoryRoute.put("/:id", isAdmin, updateCategory);
categoryRoute.delete("/:id", isAdmin, deleteCategory);

export default categoryRoute;
