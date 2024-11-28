import OrderItem from "../models/order-item.js";

export const fetchAllOrderItems = async () => {
  return await OrderItem.find().populate("product");
};

export const fetchOrderItemById = async (id) => {
  return await OrderItem.findById(id).populate("product");
};
