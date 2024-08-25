import Category from "../models/category.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    // Validate
    if (!name) {
      return res.status(400).json({ msg: "Please enter a category name." });
    }
    // Check for existing category
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ msg: "Category already exists." });
    }
    // Create category
    const newCategory = new Category({ name, slug: slugify(name) });
    await newCategory.save();
    res.status(201).json({
      success: true,
      msg: "Category created successfully.",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
};
export const updatecategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    //doi by slug not id

    const { id } = req.params;
    // findbyidandUpdate
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(201).json({
      success: true,
      msg: "Category updated successfully.",
      category: category,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
};
export const getAllcategory = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, categories: categories });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
};
//get single categorie by slug
export const getSinglecategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug });
    res.status(200).json({ success: true, category: category });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
};
//deletecategory
export const deletecategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, msg: "Category deleted successfully.", category });
  } catch (error) {
    res.status(500).json({ msg: "Server error." });
  }
};
