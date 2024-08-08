const categoryModel = require("../models/category.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { CloudinaryImage } = require("../utils/CloudinaryImage");

const addCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new ApiError("Title is required");
  const file = req.file?.path;
  if (!file) throw new ApiError("Image is required");
  const cloudinary = await CloudinaryImage(file);
  const category = await categoryModel.create({ title, image: cloudinary.url });
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
  if (req.file) {
    const file = req.file?.path;
    const uploadCloud = await CloudinaryImage(file);
    await categoryModel.findByIdAndUpdate(id, {
      $set: {
        image: uploadCloud.url,
        title,
      },
    });
    const category = await categoryModel.findById(id);
    res
      .status(200)
      .json(new ApiResponse("Update Category Successfully!", category));
  } else {
    await categoryModel.findByIdAndUpdate(id, {
      $set: { title },
    });
    const category = await categoryModel.findById(id);
    res
      .status(200)
      .json(new ApiResponse("Update Category Successfully!", category));
  }
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
