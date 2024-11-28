import Category from "../models/category.js";

export const fetchAllCategories = async () => {
  return await Category.find();
};

export const fetchCategoryById = async (id) => {
  return await Category.findById(id);
};

export const addCategory = async (data) => {
  const category = new Category({
    name: data.name,
    icon: data.icon,
    color: data.color,
  });
  return await category.save();
};

export const editCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(
    id,
    {
      name: data.name,
      icon: data.icon,
      color: data.color,
    },
    { new: true }
  );
};

export const removeCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  return !!category; // Returns true if deletion was successful
};
