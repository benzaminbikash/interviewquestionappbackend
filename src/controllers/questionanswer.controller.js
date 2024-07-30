const questionanswerModel = require("../models/questionanswer.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { CloudinaryImage } = require("../utils/CloudinaryImage");

const questionanswercreate = asyncHandler(async (req, res) => {
  const { question, answer, category } = req.body;
  const file = req.file?.path;
  if (!question || !answer || !file || !category)
    throw new ApiError("All fields are required.", 400);
  const sendcloudinary = await CloudinaryImage(file);
  const questionanswer = await questionanswerModel.create({
    question,
    answer,
    category,
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
});

const getquestionanswerbycategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const data = await questionanswerModel.find({ category });
  res.status(200).json(new ApiResponse("Get Data", data));
});

const deletequestionanswer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await questionanswerModel.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse("Delete Question Answer Successfully!", data));
});

const updatequestionanswer = asyncHandler(async (req, res) => {
  const file = req.file?.path;
  if (file) {
    const imagecloud = await CloudinaryImage(file);
    const updatequestionanswer = await questionanswerModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, image: imagecloud.url } }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          "Question Answer Update Successfully.",
          updatequestionanswer
        )
      );
  }
  const updatequestionanswer = await questionanswerModel.findByIdAndUpdate(
    req.paramas.id,
    { $set: { ...req.body } }
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        "Question Answer Update Successfully.",
        updatequestionanswer
      )
    );
});

module.exports = {
  questionanswercreate,
  getquestionanswerbycategory,
  deletequestionanswer,
  updatequestionanswer,
};
