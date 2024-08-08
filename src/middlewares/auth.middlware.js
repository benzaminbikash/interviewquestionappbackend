const userModels = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const authMiddlware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError("Token is not available", 400);
    const { _id } = jwt.verify(token, process.env.ACCESSTOKEN);
    const user = await userModels.findById(_id);
    if (!user) throw new ApiError("Invalid token", 400);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});

const adminMiddleware = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModels.findById(_id);
  if (user.role !== "admin") {
    throw new ApiError("You are not admin", 400);
  }
  next();
});

module.exports = { authMiddlware, adminMiddleware };
