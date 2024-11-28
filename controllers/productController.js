import {
  fetchAllProducts,
  fetchProductById,
  createNewProduct,
  modifyProduct,
  removeProduct,
  getFeaturedProductsFromDB,
  addProductImages,
} from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await fetchAllProducts(req.query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await fetchProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await createNewProduct(req.body, req.file);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Product creation failed", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await modifyProduct(req.params.id, req.body);
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Product update failed", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await removeProduct(req.params.id);
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Product deletion failed", error });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 0;
    const featuredProducts = await getFeaturedProductsFromDB(count);
    res.status(200).json(featuredProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch featured products", error });
  }
};

export const updateProductImages = async (req, res) => {
  try {
    const updatedProduct = await addProductImages(req.params.id, req.files);
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product images", error });
  }
};
