const { ApiError } = require("../utils/ApiError");
const userModels = require("../models/user.models");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const registrationUser = asyncHandler(async (req, res) => {
  const { email, name, mobile, password } = req.body;
  if (!email || !name || !mobile || !password)
    throw new ApiError("All fields are required.", 400);
  const existEmail = await userModels.findOne({ email });
  if (existEmail) throw new ApiError("Email aready exits.", 400);
  const existmobile = await userModels.findOne({ mobile });
  if (existmobile) throw new ApiError("Mobile number aready exits.", 400);
  const user = await userModels.create(req.body);
  const userfind = await userModels.findById(user._id);
  res
    .status(201)
    .json(new ApiResponse("User Registration Successfully!", userfind));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError("Email and Password are required.", 400);
  const user = await userModels.findOne({ email });
  if (user && (await user.isPasswordMatch(password))) {
    const token = await user.generateAccessToken();
    const userpass = await userModels
      .findById(user._id)
      .select("-password -role");
    res
      .status(200)
      .json({ message: "Login Successfully!", token: token, data: userpass });
  } else {
    throw new Error("Invalid user or password.");
  }
});
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError("Email and Password are required.", 400);
  const user = await userModels.findOne({ email });
  if (user && (await user.isPasswordMatch(password))) {
    if (user.role == "admin") {
      const token = await user.generateAccessToken();
      const userpass = await userModels
        .findById(user._id)
        .select("-password -role");
      res
        .status(200)
        .json({ message: "Login Successfully!", token: token, data: userpass });
    } else {
      throw new Error("You are not admin.", 401);
    }
  } else {
    throw new Error("Invalid user or password.", 401);
  }
});

const changePasswordInApp = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await userModels.findById(_id);
  const { oldpassword, newpassword, confirmationpassword } = req.body;
  if (!oldpassword || !newpassword || !confirmationpassword)
    throw new ApiError("All fields are required.", 400);
  const comparePassword = await user.isPasswordMatch(oldpassword);
  if (!comparePassword) throw new ApiError("Old Password is not Match", 400);
  if (newpassword !== confirmationpassword)
    throw new ApiError("New password and confirmation password is not match.");
  user.password = newpas;
  await user.save();
  res.status(200).json(new ApiResponse("Password Change Successfully!", 200));
});

const getMyData = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await userModels.findById(_id).select("-password -role");
  res.status(200).json(new ApiResponse("Your All Data", user));
});

const updateRolebyadmin = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role) throw new ApiError("Role is required.", 400);
  await userModels.findByIdAndUpdate(req.params.id, {
    $set: { role: role },
  });
  const user = await userModels.findById(req.params.id);
  res.status(200).json(new ApiResponse("Update User Profile", user));
});

const getAllUser = asyncHandler(async (req, res) => {
  const users = await userModels.find();
  res.status(200).json(new ApiResponse("All User", users));
});

module.exports = {
  registrationUser,
  loginUser,
  getMyData,
  changePasswordInApp,
  updateRolebyadmin,
  getAllUser,
  adminLogin,
};
