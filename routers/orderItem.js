import express from "express";
import OrderItem from "../models/order-item.js";
const orderItemRoute = express.Router();

// GET all order items
orderItemRoute.get("/", async (req, res) => {
  try {
    const orderItems = await OrderItem.find().populate("product");
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single order item by ID
orderItemRoute.get("/:id", async (req, res) => {
  try {
    const orderItem = await OrderItem.findById(req.params.id).populate(
      "product"
    );
    if (orderItem) {
      res.status(200).json(orderItem);
    } else {
      res.status(404).json({ message: "OrderItem not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default orderItemRoute;
