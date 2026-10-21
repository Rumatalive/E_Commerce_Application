import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controller/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/admin.middleware";

const router = Router();

// Create an order
router.post("/", authenticate, requireRole("buyer"), createOrder);

// Get logged-in user's orders
router.get("/", authenticate, requireRole("buyer"), getMyOrders);

// Get one order
router.get("/:id", authenticate, requireRole("buyer"), getOrderById);

// Cancel an order
router.patch("/:id/cancel", authenticate, requireRole("buyer"), cancelOrder);

export default router;