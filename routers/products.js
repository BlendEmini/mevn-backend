import express from "express";
import Product from "../models/product.js";
import Category from "../models/category.js";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";

const productsRouter = express.Router();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads"); // No leading slash to use a relative path
  },
  filename: function (req, file, cb) {
    const extension = FILE_TYPE_MAP[file.mimetype];
    const fileName = file.originalname.split(" ").join("-");
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

// Get all products
productsRouter.get("/", async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  try {
    const products = await Product.find(filter).populate("category");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Failed to fetch products",
    });
  }
});

// Get product by ID
productsRouter.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Failed to fetch product",
    });
  }
});

// Create a new product
productsRouter.post("/", upload.single("image"), async (req, res) => {
  const { name, description, category, countInStock } = req.body;
  if (!name || !description || !category || countInStock == null) {
    return res.status(400).json({
      message:
        "Name, description, category, and countInStock are required fields.",
    });
  }

  try {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription || "",
      image: `${basePath}${fileName}`,
      brand: req.body.brand || "",
      price: req.body.price || 0,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating || 0,
      numReviews: req.body.numReviews || 0,
      isFeatured: req.body.isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Product creation failed",
    });
  }
});

// Update product by ID
productsRouter.put("/:id", async (req, res) => {
  const { name, description, category, countInStock } = req.body;

  if (!name || !description || !category || countInStock == null) {
    return res.status(400).json({
      message:
        "Name, description, category, and countInStock are required fields.",
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription || "",
        image: req.body.image || "",
        brand: req.body.brand || "",
        price: req.body.price || 0,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating || 0,
        numReviews: req.body.numReviews || 0,
        isFeatured: req.body.isFeatured || false,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Product update failed",
    });
  }
});

// Delete a product by ID
productsRouter.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Product deletion failed",
    });
  }
});

// Get featured products
productsRouter.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count ? parseInt(req.params.count) : 0;
    const featuredProducts = await Product.find({ isFeatured: true }).limit(
      count
    );
    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Failed to fetch featured products",
    });
  }
});

productsRouter.put(
  "/gallery-images/:id",
  upload.array("images", 5),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid product id");
    }

    const files = req.files;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    let imagesPaths = [];
    if (files && files.length > 0) {
      imagesPaths = files.map((file) => `${basePath}${file.filename}`);
    }

    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          images: imagesPaths,
        },
        { new: true } // Return the updated document
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({
        error: err,
        message: "Failed to update product images",
      });
    }
  }
);
export default productsRouter;
