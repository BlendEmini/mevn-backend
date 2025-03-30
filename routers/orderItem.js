import express from "express";
import { isAdmin } from "../helpers/jwt.js";
import {
  getAllOrderItems,
  getOrderItemById,
} from "../controllers/orderItemController.js";

const orderItemRoute = express.Router();

// Admin-only routes (order items are sensitive)
orderItemRoute.get("/", isAdmin, getAllOrderItems);
orderItemRoute.get("/:id", isAdmin, getOrderItemById);

export default orderItemRoute;
