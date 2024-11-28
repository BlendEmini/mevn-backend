import express from "express";
import Order from "../models/order.js";
import OrderItem from "../models/order-item.js";
import Product from "../models/product.js";
import { populate } from "dotenv";
const ordersRoute = express.Router();

// GET all orders
ordersRoute.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .populate("orderItems");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single order by ID
ordersRoute.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
ordersRoute.post("/", async (req, res) => {
  try {
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
    } = req.body;

    // Validate the input data
    if (
      !orderItems ||
      !shippingAddress1 ||
      !city ||
      !zip ||
      !country ||
      !phone
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Initialize variables for storing order items and calculating total price
    const orderItemsIds = [];
    let totalPrice = 0;

    // Iterate over each item to save and calculate total
    for (const orderItem of orderItems) {
      // Create and save each order item
      const newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      const savedOrderItem = await newOrderItem.save();
      orderItemsIds.push(savedOrderItem._id);

      // Calculate total price based on the product price and quantity
      const product = await Product.findById(orderItem.product); // Find the product
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      totalPrice += product.price * orderItem.quantity; // Sum up totalPrice
    }

    // Create the new order with calculated total price
    const newOrder = new Order({
      orderItems: orderItemsIds,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status: status || "Pending",
      totalPrice, // Set calculated total price
      user,
    });

    // Save the new order and send the response
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

ordersRoute.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.send(order);
});

ordersRoute.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Delete all associated OrderItems
    await Promise.all(
      order.orderItems.map(async (orderItemId) => {
        await OrderItem.findByIdAndDelete(orderItemId);
      })
    );

    // Delete the order itself
    await Order.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Order and associated items deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

ordersRoute.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  res.send({ totalsales: totalSales });
});

ordersRoute.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments();

  res.send({
    orderCount: orderCount,
  });
});

ordersRoute.get("/get/userorders/:userid", async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid }).populate({
    path: "orderItems",
    populate: {
      path: "product",
      populate: "category",
    },
  });
  res.send(userOrderList);
});

export default ordersRoute;
