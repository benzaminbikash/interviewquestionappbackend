const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const questionanswerModel = require("../models/questionanswer.model");

const questionanswercreate = asyncHandler(async (req, res) => {
  const questionanswer = await questionanswerModel.create(req.body);
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
  await questionanswerModel.findByIdAndUpdate({ _id: req.params.id }, req.body);

  const updatequestionanswer = await questionanswerModel.findById(id);
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
  getallquestionanswer,
};
