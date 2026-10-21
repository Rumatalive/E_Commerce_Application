import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import type { UserRole } from "../model/user.model";

export const requireRole = (...roles: UserRole[]) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.userId;
    const user = userId ? await User.findById(userId).select("role") : null;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "You do not have permission for this action" });
    }

    (req as any).currentRole = user.role;
    next();
  } catch {
    return res.status(500).json({ message: "Could not verify admin access" });
  }
};

export const requireAdmin = requireRole("admin");
export const requireSeller = requireRole("seller");
export const requireSellerOrAdmin = requireRole("seller", "admin");