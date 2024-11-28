import multer from "multer";
import path from "path";
import Product from "../models/product.js";
import mongoose from "mongoose";
import { handleFileUpload } from "../helpers/fileHelper.js";

export const fetchAllProducts = async (query) => {
  let filter = {};
  if (query.categories) {
    filter = { category: query.categories.split(",") };
  }
  return await Product.find(filter).populate("category");
};

export const fetchProductById = async (id) => {
  return await Product.findById(id).populate("category");
};

export const createNewProduct = async (productData, file) => {
  if (!file) throw new Error("Image is required");

  const fileName = file.filename;
  const basePath = `${process.env.HOST_URL}/public/uploads/`;

  const product = new Product({
    name: productData.name,
    description: productData.description,
    richDescription: productData.richDescription || "",
    image: `${basePath}${fileName}`,
    brand: productData.brand || "",
    price: productData.price || 0,
    category: productData.category,
    countInStock: productData.countInStock,
    rating: productData.rating || 0,
    numReviews: productData.numReviews || 0,
    isFeatured: productData.isFeatured || false,
  });

  return await product.save();
};

export const modifyProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

export const removeProduct = async (id) => {
  return await Product.findByIdAndRemove(id);
};

export const getFeaturedProductsFromDB = async (count) => {
  return await Product.find({ isFeatured: true }).limit(count);
};

export const addProductImages = async (id, files) => {
  const filePaths = handleFileUpload(files);
  return await Product.findByIdAndUpdate(
    id,
    { images: filePaths },
    { new: true }
  );
};

// Update stock when creating or canceling an order
export const updateProductStock = async (orderItems, increase = false) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product with ID ${item.product} not found.`);
    }

    const adjustment = increase ? item.quantity : -item.quantity;
    const newCountInStock = product.countInStock + adjustment;

    if (newCountInStock < 0) {
      throw new Error(
        `Insufficient stock for product: ${product.name}. Available: ${product.countInStock}, Requested: ${item.quantity}`
      );
    }

    product.countInStock = newCountInStock;
    await product.save();
  }
};
