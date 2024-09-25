const mongoose = require("mongoose");

const POINT = new mongoose.Schema({
  heading: {
    type: String,
  },
  point: {
    type: Array,
  },
});

var questionanswerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      unique: true,
    },
    answer: {
      type: [String],
    },
    points: POINT,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    coding: {
      type: String,
    },
    youtubelink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Questionanswer", questionanswerSchema);
