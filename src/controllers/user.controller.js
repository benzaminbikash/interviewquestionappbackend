const userModels = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const registrationUser = asyncHandler(async (req, res) => {
  const { email, name, mobile, password } = req.body;
  if (!email || !name || !mobile || !password)
    throw new ApiError("All fields are required.", 400);
  const existEmail = await userModels.findOne({ email });
  if (existEmail) throw new ApiError("Email aready exits.", 400);
  const user = await userModels.create(req.body);
  const userfind = await userModels.findById(user._id);
  res
    .status(201)
    .json(new ApiResponse("User Registration Successfully!", userfind));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new Error("Email and Password are required.", 400);
  const user = await userModels.findOne({ email });
  if (!user) throw new Error("User not found.");
  if (user && (await user.isPasswordMatch(password))) {
    res.status(200).json(new ApiResponse("Login Successfully!", user));
  }
});

const changePasswordInApp = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await userModels.findById(_id);
  const { oldpassword, newpassword, confirmationpassword } = req.body;
  if (!oldpasswod || !newpassword || !confirmationpassword)
    throw new ApiError("All fields are required.", 400);
  const comparePassword = await user.isPasswordMatch(oldpassword);
  if (!comparePassword) throw new ApiError("Old Password is not Match", 400);
  if (newpassword !== confirmationpassword)
    throw new ApiError("New password and confirmation password is not match.");
  user.password = password;
  await user.save();
  res.status(200).json(new ApiResponse("Password Change Successfully!", 200));
});

const getMyData = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await userModels.findById(_id);
  res.status(200).json(new ApiResponse("Your All Data", user));
});

module.exports = {
  registrationUser,
  loginUser,
  getMyData,
  changePasswordInApp,
};
