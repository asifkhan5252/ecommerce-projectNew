import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Initialize app
dotenv.config();
const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoute);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoute);
app.use("/api/payment", paymentRoutes);

// ✅ Serve Uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Serve React Build (for Vite)
app.use(express.static(path.join(__dirname, "./client/dist")));

// ✅ Handle React Router (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
