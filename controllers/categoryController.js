import {
  fetchAllCategories,
  fetchCategoryById,
  addCategory,
  editCategory,
  removeCategory,
} from "../services/categoryService.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await fetchAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await fetchCategoryById(req.params.id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await addCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await editCategory(req.params.id, req.body);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(400).send("The category cannot be updated!");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const success = await removeCategory(req.params.id);
    if (success) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
