import bcrypt from "bcrypt";
import User from "../model/user.model";

export async function bootstrapAdmin() {
  await User.collection.updateMany({ role: "user" }, { $set: { role: "buyer" } });

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.info("Admin setup skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD to create an admin account.");
    return;
  }

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.role !== "admin") {
      throw new Error("ADMIN_EMAIL is already registered as a regular user; choose a different email");
    }

    console.info(`Admin account ready for ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    name: process.env.ADMIN_NAME || "Store Admin",
    email,
    password: passwordHash,
    role: "admin",
  });

  console.info(`Admin account created for ${email}`);
}