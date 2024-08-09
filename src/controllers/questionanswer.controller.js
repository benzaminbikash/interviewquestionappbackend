const questionanswerModel = require("../models/questionanswer.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { CloudinaryImage } = require("../utils/CloudinaryImage");

const questionanswercreate = asyncHandler(async (req, res) => {
  const { question, answer, category } = req.body;
  const file = req.file?.path;
  if (file) {
    const sendcloudinary = await CloudinaryImage(file);
    const questionanswer = await questionanswerModel.create({
      ...req.body,
      image: sendcloudinary.url,
    });
    res
      .status(201)
      .json(
        new ApiResponse(
          "Question and Answer Create Successfully!",
          questionanswer
        )
      );
  }
  if (!question || !answer || !category)
    throw new ApiError("Question, answer and category are required.", 400);
  const questionanswer = await questionanswerModel.create({
    question,
    answer,
    category,
  });
  res
    .status(201)
    .json(
      new ApiResponse(
        "Question and Answer Create Successfully!",
        questionanswer
      )
    );
});

const getallquestionanswer = asyncHandler(async (req, res) => {
  const data = await questionanswerModel.find().populate("category");
  res.status(200).json(new ApiResponse("Get All Data", data));
});

const getquestionanswerbycategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const data = await questionanswerModel.find({ category });
  res.status(200).json(new ApiResponse(`Get Data of ${category}`, data));
});

const deletequestionanswer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await questionanswerModel.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse("Delete Question Answer Successfully!", data));
});

const updatequestionanswer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = req.file?.path;
  if (file) {
    const imagecloud = await CloudinaryImage(file);
    await questionanswerModel.findByIdAndUpdate(id, {
      $set: { ...req.body, image: imagecloud.url },
    });
    const updatequestionanswer = await questionanswerModel.findById(id);
    res
      .status(200)
      .json(
        new ApiResponse(
          "Question Answer Update Successfully.",
          updatequestionanswer
        )
      );
  } else {
    await questionanswerModel.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );

    const updatequestionanswer = await questionanswerModel.findById(id);
    res
      .status(200)
      .json(
        new ApiResponse(
          "Question Answer Update Successfully.",
          updatequestionanswer
        )
      );
  }
});

module.exports = {
  questionanswercreate,
  getquestionanswerbycategory,
  deletequestionanswer,
  updatequestionanswer,
  getallquestionanswer,
};
