import Order from "../models/order.js";
import OrderItem from "../models/order-item.js";
import Product from "../models/product.js";

export const getAllOrders = async () => {
  return await Order.find().populate("user", "name").populate("orderItems");
};

export const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
};

export const createOrder = async (orderData) => {
  const {
    orderItems,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    user,
  } = orderData;

  if (!orderItems || !shippingAddress1 || !city || !zip || !country || !phone) {
    throw new Error("Missing required fields");
  }

  const orderItemsIds = [];
  let totalPrice = 0;

  for (const orderItem of orderItems) {
    const newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product,
    });
    const savedOrderItem = await newOrderItem.save();
    orderItemsIds.push(savedOrderItem._id);

    const product = await Product.findById(orderItem.product);
    if (!product) {
      throw new Error("Product not found");
    }
    totalPrice += product.price * orderItem.quantity;
  }

  const newOrder = new Order({
    orderItems: orderItemsIds,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status: status || "Pending",
    totalPrice,
    user,
  });

  return await newOrder.save();
};

export const updateOrderStatus = async (orderId, status) => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

export const deleteOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  await Promise.all(
    order.orderItems.map(async (orderItemId) => {
      await OrderItem.findByIdAndDelete(orderItemId);
    })
  );

  await Order.findByIdAndDelete(orderId);
  return { message: "Order and associated items deleted successfully" };
};

export const getTotalSales = async () => {
  return await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
};

export const getOrderCount = async () => {
  return await Order.countDocuments();
};

export const getUserOrders = async (userId) => {
  return await Order.find({ user: userId }).populate({
    path: "orderItems",
    populate: {
      path: "product",
      populate: "category",
    },
  });
};
