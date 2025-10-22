import CategoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    // check already exist
    const existing = await CategoryModel.findOne({ name });
    if (existing) {
      return res.status(200).json({ success: false, message: "Category already exists" });
    }

    const category = await new CategoryModel({ name, slug: slugify(name, { lower: true }) }).save();
    res.status(201).json({ success: true, message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in create category", error: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    //  console.log("Request Body:", req.body)
    const { name } = req.body;
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name, { lower: true }) },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in update category", error: error.message });
  }
};

// Get all categories
export const getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    res.status(200).json({ success: true, message: "All categories", categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error while getting categories", error: error.message });
  }
};

// Get single category by slug
export const getSingleCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error while getting category", error: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error while deleting category", error: error.message });
  }
};
