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

export const getSellerProducts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user.userId;
    const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch {
    return res.status(500).json({ message: "Could not load your products" });
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
      ...((req as any).currentRole === "seller" ? { seller: (req as any).user.userId } : {}),
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
    const isSeller = (req as any).currentRole === "seller";
    const sellerId = (req as any).user.userId;
    const update: Record<string, unknown> = {};
    for (const field of ["name", "category", "price"] as const) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, ...(isSeller ? { seller: sellerId } : {}) },
      { $set: update },
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
    const isSeller = (req as any).currentRole === "seller";
    const sellerId = (req as any).user.userId;
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      ...(isSeller ? { seller: sellerId } : {}),
    });

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