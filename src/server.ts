import "dotenv/config";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import authRouter from "./router/auth.router";
import orderRouter from "./router/order.router";
import adminRouter from "./router/admin.router";

import productRouter from "./router/product.router";
import { connectDB } from "./config/db";
import { bootstrapAdmin } from "./services/adminBootstrap";

dotenv.config({ path: ".env.admin", override: false });
import { swaggerSpec } from "../swagger";


const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to my E-commerce Application");
});


// Auth routes
app.use("/api/auth", authRouter);

// Order routes
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);

// Product routes
app.use("/api", productRouter);


// Connect to MongoDB
connectDB()
  .then(bootstrapAdmin)
  .catch((error) => {
    console.error("Admin account setup failed:", error);
  });

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});