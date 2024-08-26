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
      required: true,
    },
    answer: {
      type: [String],
      required: true,
    },
    points: POINT,
    image: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Questionanswer", questionanswerSchema);
