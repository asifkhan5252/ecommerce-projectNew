import express from "express";
import { createCategory, updateCategory, getAllCategory, getSingleCategory, deleteCategory } from "./../controllers/categoryController.js";
import {  isadmin, verifytoken } from "./../middlewares/authMiddleware.js";

const router = express.Router();

// Create category (only admin)
router.post("/create-category", verifytoken, isadmin, createCategory);

// Update category (only admin)
router.put("/update-category/:id", verifytoken, isadmin, updateCategory);

// Get all
router.get("/get-category", getAllCategory);

// Get single by slug
router.get("/single-category/:slug", getSingleCategory);

// Delete category (only admin)
router.delete("/delete-category/:id", verifytoken, isadmin, deleteCategory);

export default router;
