import express from "express";
import {
  getAllOrderItems,
  getOrderItemById,
} from "../controllers/orderItemController.js";

const orderItemRoute = express.Router();

orderItemRoute.get("/", getAllOrderItems);
orderItemRoute.get("/:id", getOrderItemById);

export default orderItemRoute;
