import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

// Import routers
import productsRouter from "./routers/products.js";
import usersRoute from "./routers/users.js";
import ordersRoute from "./routers/orders.js";
import categoryRoute from "./routers/categorys.js";
import orderItemRoute from "./routers/orderItem.js";

// Import middleware and helpers
import bodyParser from "body-parser";
import authJwt, { isAdmin } from "./helpers/jwt.js"; // Import both authJwt and isAdmin

// Configure environment variables
dotenv.config();

const app = express();

// Path setup for static files (uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "/public/uploads"))
);

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt()); // Apply JWT auth globally (except routes in .unless())

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  if (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
  next();
});

// API URL
const api = process.env.API_URL;

// API Routes setup
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/orders`, ordersRoute);
app.use(`${api}/category`, categoryRoute);
app.use(`${api}/order-item`, orderItemRoute);

// Example: Protect an admin-only route (add this if needed)
// app.get(`${api}/admin/dashboard`, isAdmin, (req, res) => {
//   res.json({ message: "Admin dashboard" });
// });

// Connect to MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("DB IS CONNECTED");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
