import {
  fetchAllOrderItems,
  fetchOrderItemById,
} from "../services/orderItemService.js";

export const getAllOrderItems = async (req, res) => {
  try {
    const orderItems = await fetchAllOrderItems();
    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await fetchOrderItemById(req.params.id);
    if (orderItem) {
      res.status(200).json(orderItem);
    } else {
      res.status(404).json({ message: "OrderItem not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
