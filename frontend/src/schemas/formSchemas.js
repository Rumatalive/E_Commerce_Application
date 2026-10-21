import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email address.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1, "Name is required."),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: emailSchema,
});

export const sellerSchema = profileSchema.extend({
  password: z.string().min(12, "Password must be at least 12 characters."),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required."),
  category: z.string().trim().min(1, "Category is required."),
  price: z.string()
    .trim()
    .min(1, "Price is required.")
    .refine((value) => Number.isFinite(Number(value)), "Enter a valid price.")
    .transform(Number)
    .pipe(z.number().min(0, "Price cannot be negative.")),
});

export const productCreateSchema = productSchema.extend({
  image: z.custom(
    (value) => typeof FileList !== "undefined" && value instanceof FileList && value.length > 0,
    "Choose a product image.",
  ).transform((files) => files[0]),
});

export const checkoutSchema = z.object({
  shippingAddress: z.string().trim().min(1, "Shipping address is required."),
});