import * as ProductRepo from "./product.repository.js";
import ApiError from "../../utils/ApiError.js";

export const createNewProduct = async (productData) => {
  return await ProductRepo.save(productData);
};

export const getAllProducts = async () => {
  return await ProductRepo.findAll();
};

export const getProductById = async (id) => {
  const product = await ProductRepo.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const updateProduct = async (id, data) => {
  const product = await ProductRepo.updateById(id, data);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const deleteProduct = async (id) => {
  const product = await ProductRepo.deleteById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};
