import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Order from "../model/order.model";
import Product from "../model/product.model";
import User from "../model/user.model";

export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const [productCount, userCount, sellerCount, orderCount, paidOrders, recentOrders, orderStatuses] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: "seller" }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("user", "name email")
        .populate("items.product", "name"),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return res.status(200).json({
      overview: {
        products: productCount,
        users: userCount,
        sellers: sellerCount,
        orders: orderCount,
        paidRevenue: paidOrders[0]?.total || 0,
      },
      orderStatuses,
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ message: "Could not load admin dashboard" });
  }
};

export const createSeller = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (String(password).length < 12) {
      return res.status(400).json({ message: "Seller password must be at least 12 characters" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account already uses this email" });
    }

    const seller = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(String(password), 12),
      role: "seller",
    });

    return res.status(201).json({
      message: "Seller account created",
      seller: { id: seller._id, name: seller.name, email: seller.email, role: seller.role },
    });
  } catch (error) {
    console.error("Seller creation error:", error);
    return res.status(500).json({ message: "Could not create seller account" });
  }
};