import express from "express";
import * as orderController from "../controllers/orderController.js";

const ordersRoute = express.Router();

ordersRoute.get("/", orderController.getAllOrders);
ordersRoute.get("/:id", orderController.getOrderById);
ordersRoute.post("/", orderController.createOrder);
ordersRoute.put("/:id", orderController.updateOrder);
ordersRoute.delete("/:id", orderController.deleteOrder);
ordersRoute.get("/get/totalsales", orderController.getTotalSales);
ordersRoute.get("/get/count", orderController.getOrderCount);
ordersRoute.get("/get/userorders/:userid", orderController.getUserOrders);

export default ordersRoute;
