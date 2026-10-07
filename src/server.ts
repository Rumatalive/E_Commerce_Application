import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import authRouter from "./router/auth.router";

import productRouter from "./router/product.router";
import { connectDB } from "./config/db";
import { swaggerSpec } from "../swagger";


dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to my E-commerce Application");
});


// Auth routes
app.use("/api/auth", authRouter);


// Product routes
app.use("/api", productRouter);


// Connect to MongoDB
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});