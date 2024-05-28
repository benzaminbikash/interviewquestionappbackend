const categoryModel = require("../models/category.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const addCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new ApiError("Title is required", 400);
  const category = await categoryModel.create(req.body);
  res
    .status(201)
    .json(new ApiResponse("Category Create Successfully!", category));
});

const getAllCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.find();
  res.status(200).json(new ApiResponse("All Categories", category));
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  res.status(200).json(new ApiResponse("Single Category", category));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const updatecategory = await categoryModel.findByIdAndUpdate(id, {
    $set: { title },
  });
  res
    .status(200)
    .json(new ApiResponse("Update Category Successfully!", updatecategory));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletecategory = await categoryModel.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse("Category Delete Successfully!", deletecategory));
});

module.exports = {
  addCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
