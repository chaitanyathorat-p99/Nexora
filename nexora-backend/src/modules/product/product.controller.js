import * as ProductService from "./product.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const handleCreateProduct = async (req, res, next) => {
    try {
        const product = await ProductService.createNewProduct(req.body);
        
        res.status(201).json(new ApiResponse(201, product, "Product added sucessfully"));
    } catch (error) {
        next(error);
    }
};

export const handleGetProducts = async (req, res, next) => {
    try {
        const products = await ProductService.getAllProducts();
        
        res.status(200).json(new ApiResponse(200, products, "Products retrived"));
        
    } catch (error) {
        next(error);
    }
};

export const handleGetProductByid = async (req, res, next) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json(new ApiResponse(200,product," Product Retrived Sucessfully"));
    } catch (error) {
        next(error);
    }
};

export const handleUpdateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, product, "Product updated"));
  } catch (error) {
    next(error);
  }
};

export const handleDeleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Product deleted"));
  } catch (error) {
    next(error);
  }
};