import express from "express";
import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  getUserCount,
} from "../controllers/userController.js";

const usersRoute = express.Router();

// Routes
usersRoute.get("/", getAllUsers);
usersRoute.get("/:id", getUserById);
usersRoute.post("/register", registerUser);
usersRoute.post("/login", loginUser);
usersRoute.get("/get/count", getUserCount);

export default usersRoute;
