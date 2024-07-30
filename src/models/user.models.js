const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const bcryptSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, bcryptSalt);
  next();
});

userSchema.methods.isPasswordMatch = async function (enterPassword) {
  return bcrypt.compare(enterPassword, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESSTOKEN, {
    expiresIn: process.env.ACCESSTOKENEXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
