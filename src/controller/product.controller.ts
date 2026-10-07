import { Request, Response } from "express";
import Product from "../model/product.model";
import cloudinary from "../config/cloudinary";

const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
};

// Get all products
export const getProduct = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get products",
    });
  }
};


// Get one product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get product",
    });
  }
};

// Create a new product
export const newProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "name, category, price required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      category,
      price,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

    return res.status(201).json({
      message: "Product Created",
      product,
    });
  } catch (error) {
  console.error("PRODUCT CREATION ERROR:", error);

  return res.status(500).json({
    message: "Server error",
    error: error instanceof Error ? error.message : error,
  });
}
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      message: "Product Updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      message: "Product Deleted",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
    });
  }
};