import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../model/order.model";
import Product from "../model/product.model";
import User from "../model/user.model";
import { sendOrderConfirmationEmail } from "../services/emailService";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const { items, shippingAddress } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    // Validate shipping address
    if (!shippingAddress || shippingAddress.trim() === "") {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    // Validate product IDs and quantities
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          message: `Invalid product ID: ${item.product}`,
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          message: "Quantity must be at least 1",
        });
      }
    }

    // Get products from database
    const productIds = items.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    // Make sure all products exist
    if (products.length !== items.length) {
      return res.status(404).json({
        message: "One or more products were not found",
      });
    }

    // Create order items using prices from database
    const orderItems = items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString(),
      );

      return {
        product: product!._id,
        quantity: item.quantity,
        price: product!.price,
      };
    });

    // Calculate total on the server
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress.trim(),
      status: "pending",
      paymentStatus: "unpaid",
    });

    // Get customer information
    const user = await User.findById(userId);

    // Send order confirmation email
    if (user) {
      const emailItems = orderItems.map((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.product.toString(),
        );

        return {
          name: product?.name || "Product",
          quantity: item.quantity,
          price: item.price,
        };
      });

      try {
        await sendOrderConfirmationEmail(
          user.email,
          user.name,
          order._id.toString(),
          emailItems,
          order.totalAmount,
          order.shippingAddress,
        );
      } catch (emailError) {
        console.error(
          "Order confirmation email failed:",
          emailError,
        );
      }
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Failed to create order",
    });
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const orders = await Order.find({
      user: userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      message: "Failed to retrieve orders",
    });
  }
};

// Get one order belonging to logged-in user
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: userId,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      message: "Failed to retrieve order",
    });
  }
};

// Cancel an order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "cancelled";

    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    return res.status(500).json({
      message: "Failed to cancel order",
    });
  }
};