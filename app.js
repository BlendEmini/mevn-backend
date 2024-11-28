import express from "express";
import dotenv from "dotenv";
import Product from "./models/product.js";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import productsRouter from "./routers/products.js";
import usersRoute from "./routers/users.js";
import ordersRoute from "./routers/orders.js";
import cors from "cors";
import categoryRoute from "./routers/categorys.js";
import orderItemRoute from "./routers/orderItem.js";
import authJwt from "./helpers/jwt.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

dotenv.config();
app.use(cors());
app.options("*", cors);
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ message: err });
  }
});

const api = process.env.API_URL;

app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRoute);
app.use(`${api}/orders`, ordersRoute);
app.use(`${api}/category`, categoryRoute);
app.use(`${api}/order-item`, orderItemRoute);
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("DB IS CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Hello");
});
