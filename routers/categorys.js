import express, { Router } from "express";
import Category from "../models/category.js";
import mongoose from "mongoose";
const categoryRoute = express.Router();

// GET all categories
categoryRoute.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single category by ID
categoryRoute.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
categoryRoute.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

categoryRoute.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      body: req.body.color,
    },
    { new: true }
  );
  if (!category) {
    return res.status(400).send("The category cannot be created!");
  }
  res.send(category);
});

categoryRoute.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default categoryRoute;
