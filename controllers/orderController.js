import * as orderService from "../services/orderService.js";
import { updateProductStock } from "../services/productService.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const newOrder = await orderService.createOrder(req.body);

    // Decrease stock for ordered items
    for (const item of req.body.orderItems) {
      await updateProductStock(item.product, -item.quantity); // Decrease stock
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );

    // Handle stock adjustments if status indicates cancellation
    if (req.body.status === "canceled") {
      const order = await orderService.getOrderById(req.params.id);

      for (const item of order.orderItems) {
        await updateProductStock(item.product, item.quantity); // Revert stock
      }
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    // Increase stock for order items before deletion
    for (const item of order.orderItems) {
      await updateProductStock(item.product, item.quantity);
    }

    const result = await orderService.deleteOrder(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTotalSales = async (req, res) => {
  try {
    const totalSales = await orderService.getTotalSales();
    res.status(200).json(totalSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderCount = async (req, res) => {
  try {
    const orderCount = await orderService.getOrderCount();
    res.status(200).json({ orderCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userOrders = await orderService.getUserOrders(req.params.userid);
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
