
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../model/user.model";
import {
  sendResetCodeEmail,
  sendWelcomeEmail,
} from "../services/emailService";

const hashCode = (code: string): string =>
  crypto.createHash("sha256").update(code).digest("hex");

// =========================
// REGISTER
// =========================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "buyer",
    });

    // Send welcome email; registration still succeeds if email fails.
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// PROFILE
// =========================
export const profile = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await User.findById(userId).select("name email role");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true, select: "name email role" },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    return res.status(500).json({ message: "Failed to update profile" });
  }
};

// =========================
// FORGOT PASSWORD
// =========================
export const forgotPassword = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Use the same response whether or not the account exists.
    const message =
      "If that email is registered, a reset code has been sent";

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message });
    }

    // Generate a six-digit code.
    const code = crypto.randomInt(100000, 1000000).toString();

    // Store only the hash and expire it after 10 minutes.
    user.resetCode = hashCode(code);
    user.resetCodeExpiration = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    await user.save();

    try {
      await sendResetCodeEmail(user.email, code);
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// RESET PASSWORD
// =========================
export const resetPassword = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, code and newPassword are required",
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long",
      });
    }

    const user = await User.findOne({
      email,
      resetCode: hashCode(String(code)),
      resetCodeExpiration: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired code",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpiration = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful, you can now log in",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};