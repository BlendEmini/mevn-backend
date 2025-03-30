import express from "express";
import { isAdmin } from "../helpers/jwt.js";
import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  getUserCount,
} from "../controllers/userController.js";

const usersRoute = express.Router();

// Public routes
usersRoute.post("/register", registerUser);
usersRoute.post("/login", loginUser);

// Admin-only routes
usersRoute.get("/", isAdmin, getAllUsers);
usersRoute.get("/:id", isAdmin, getUserById);
usersRoute.get("/get/count", isAdmin, getUserCount);

export default usersRoute;
