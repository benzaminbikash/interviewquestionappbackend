const mongoose = require("mongoose");
var quizSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
