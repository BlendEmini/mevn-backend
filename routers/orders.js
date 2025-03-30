import express from "express";
import { isAdmin } from "../helpers/jwt.js";
import * as orderController from "../controllers/orderController.js";

const ordersRoute = express.Router();

// Public routes (users can access their own orders)
ordersRoute.post("/", orderController.createOrder);
ordersRoute.get("/get/userorders/:userid", orderController.getUserOrders);

// Mixed access
ordersRoute.put("/:id", orderController.updateOrder); // Users can cancel, admins can update status

// Admin-only routes
ordersRoute.get("/", isAdmin, orderController.getAllOrders);
ordersRoute.get("/:id", isAdmin, orderController.getOrderById);
ordersRoute.delete("/:id", isAdmin, orderController.deleteOrder);
ordersRoute.get("/get/totalsales", isAdmin, orderController.getTotalSales);
ordersRoute.get("/get/count", isAdmin, orderController.getOrderCount);

export default ordersRoute;
