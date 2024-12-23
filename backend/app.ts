// backend/app.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import expenseRoutes from "./routes/expenses"; // Import routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
app.use("/api/expenses", expenseRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;