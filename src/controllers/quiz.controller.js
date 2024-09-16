const { ApiError } = require("../utils/ApiError");
const quizModels = require("../models/quiz.models");
const userModels = require("../models/user.models");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const createQuiz = asyncHandler(async (req, res) => {
  const { question, answers, correctAnswer, level } = req.body;
  if (!question || !answers || !correctAnswer || !level)
    throw new ApiError("All fields are required.");
  if (answers.length != 3) throw new ApiError("There must be 3 answers.");
  const checklevel = await quizModels.find({ level: level });
  if (checklevel.length == 10)
    throw new ApiError(`The length of this level ${level} is completed : 10.`);
  const data = await quizModels.create(req.body);
  res.status(201).json(new ApiResponse("Quiz create successfully.", data));
});

const getquizbylevel = asyncHandler(async (req, res) => {
  const data = await quizModels.find({ level: req.params.level });
  res
    .status(200)
    .json(new ApiResponse(`Quiz of level ${req.params.level}. `, data));
});

const getquizs = asyncHandler(async (req, res) => {
  const data = await quizModels.find();
  res.status(200).json(new ApiResponse(`All Quizes. `, data));
});

const playquiz = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { level, gamescore } = req.body;
  if (!level || !gamescore) throw new ApiError("Add level and game score.");
  const user = await userModels.findById(_id);
  const levelIndex = user.score.levelwise.findIndex(
    (item) => item.level === level
  );
  if (levelIndex !== -1) {
    user.score.levelwise[levelIndex].score = gamescore;
  } else {
    user.score.levelwise.push({ level, score: gamescore });
  }
  await user.save();
  let totalscore = 0;
  for (let sr of user.score.levelwise) {
    totalscore += sr?.score;
  }
  user.score.totalScore = totalscore;
  await user.save();
  const data = await userModels.findById(_id).select("-password");
  res
    .status(200)
    .json(
      new ApiResponse(
        `${
          gamescore >= 70
            ? "Congratulations now you can move to another level."
            : "Better next time."
        }`,
        data
      )
    );
});

const updateQuiz = asyncHandler(async (req, res) => {
  const data = await quizModels.findByIdAndUpdate(req.params.id, {
    $set: { ...req.body },
  });
  res.status(200).json(new ApiResponse(`Update quiz.`, data));
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const data = await quizModels.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(`Delete quiz.`, data));
});

module.exports = {
  createQuiz,
  getquizbylevel,
  playquiz,
  updateQuiz,
  deleteQuiz,
  getquizs,
};
