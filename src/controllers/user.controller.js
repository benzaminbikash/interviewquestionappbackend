const { ApiError } = require("../utils/ApiError");
const userModels = require("../models/user.models");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { emailConfig } = require("../utils/emailConfigure");
const bcrypt = require("bcrypt");

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
    res.status(200).json({
      message: "Login Successfully!",
      token: token,
      data: userpass,
      status: "success",
    });
  } else {
    throw new ApiError("Invalid user or password.");
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
      res.status(200).json({
        message: "Login Successfully!",
        token: token,
        data: userpass,
        status: "success",
      });
    } else {
      throw new ApiError("You are not admin.", 401);
    }
  } else {
    throw new ApiError("Invalid user or password.", 401);
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

const sendOTPForPasswordRecovery = asyncHandler(async (req, res) => {
  const randomNumber = Math.floor(Math.random() * 9000);
  let otp = randomNumber.toString().padEnd(4, "0");
  const { email } = req.body;
  if (!email) throw new ApiError("Email is required.", 400);
  const existUser = await userModels.findOne({ email });
  if (!existUser) throw new ApiError("This email is not exit.", 400);
  const time = new Date(Date.now() + 5 * 60000);
  const user = await userModels.findByIdAndUpdate(
    existUser._id,
    {
      $set: {
        "passwordrecory.otp": otp,
        "passwordrecory.time": time,
      },
    },
    { new: true }
  );
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://r2.erweima.ai/imgcompressed/compressed_b10c65c02342a7b502db4a7c4a6e9c40.webp" alt="Company Logo" style="width: 100px; margin-bottom: 20px;">
    </div>
    <h2 style="color: #333; text-align: center;">Password Recovery</h2>
    <p style="font-size: 16px; color: #555; text-align: center;">
      Hi there! You requested to reset your password. Your 4-digit OTP is below:
    </p>
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
      <p style="font-size: 30px; color: #e67e22; font-weight: bold;">${otp}</p>
    </div>
    <p style="font-size: 16px; color: #555; text-align: center;">
      This OTP is valid for <strong>5 minutes</strong> only. If you did not request this, please ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
  </div>
`;
  await emailConfig(user.email, "Password Recovery 4-digits Code.", html);
  res
    .status(200)
    .json(new ApiResponse("Please check your email for OTP", user));
});

const PasswordRecovery = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) throw new ApiError("Otp is required.", 400);
  const user = await userModels.findOne({ "passwordrecory.otp": otp });
  if (!user) throw new ApiError("Otp is not valid.", 400);
  const currenttime = new Date();
  if (user.passwordrecory.time < currenttime) {
    await userModels.findByIdAndUpdate(user._id, {
      $set: { "passwordrecory.verify": false },
    });
    new ApiError("Otp is not valid.", 400);
  }
  await userModels.findByIdAndUpdate(user._id, {
    $set: { "passwordrecory.verify": true },
  });
  res.status(200).json(new ApiResponse("OTP verified Successfully."));
});

const PasswordChange = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  if (!password) new ApiError("Password is required.", 400);
  const user = await userModels.findOne({ email });
  if (!user.passwordrecory.verify)
    throw new ApiError("OTP has not been verified.", 400);

  const isSamePassword = await bcrypt.compare(password, user.password);
  if (isSamePassword) {
    throw new ApiError(
      "New password cannot be the same as the old password.",
      400
    );
  }
  const bcryptSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, bcryptSalt);

  await userModels.findByIdAndUpdate(user._id, {
    $set: {
      password: hashedPassword,
      "passwordrecory.otp": null,
      "passwordrecory.time": null,
      "passwordrecory.verify": false,
    },
  });
  res.status(200).json(new ApiResponse("Password updated successfully."));
});

module.exports = {
  registrationUser,
  loginUser,
  getMyData,
  changePasswordInApp,
  updateRolebyadmin,
  getAllUser,
  adminLogin,
  sendOTPForPasswordRecovery,
  PasswordRecovery,
  PasswordChange,
};
