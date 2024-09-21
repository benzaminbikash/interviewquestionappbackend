const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not supported.",
      },
      default: "user",
    },
    score: {
      levelwise: [{ level: Number, score: Number }],
      totalScore: Number,
    },
    passwordrecory: {
      otp: {
        type: Number,
      },
      time: {
        type: Date,
      },
      verify: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const bcryptSalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, bcryptSalt);
    next();
  }
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
