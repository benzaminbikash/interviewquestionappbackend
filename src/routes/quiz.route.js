const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getquizbylevel,
  playquiz,
  getquizs,
  deleteQuiz,
  updateQuiz,
} = require("../controllers/quiz.controller");
const { authMiddlware } = require("../middlewares/auth.middlware");

router.post("/quiz", createQuiz);
router.get("/quiz", getquizs);
router.get("/quiz/:level", getquizbylevel);
router.put("/playquiz", authMiddlware, playquiz);
router.put("/quiz/:id", updateQuiz);
router.delete("/quiz/:id", deleteQuiz);

module.exports = router;
