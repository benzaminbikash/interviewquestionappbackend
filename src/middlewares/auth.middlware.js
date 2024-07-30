const userModels = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const authMiddlware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);
    if (!token) throw new ApiError("Token is not available", 400);
    const { _id } = jwt.verify(token, process.env.ACCESSTOKEN);
    const user = await userModels.findById(_id);
    if (!user) throw new Error("Invalid token", 400);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});

module.exports = { authMiddlware };
