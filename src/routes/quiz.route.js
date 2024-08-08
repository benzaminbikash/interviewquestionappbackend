const express = require("express");
const {
  createQuiz,
  getquizbylevel,
  playquiz,
} = require("../controllers/quiz.controller");
const { authMiddlware } = require("../middlewares/auth.middlware");
const router = express.Router();

router.post("/quiz", createQuiz);
router.get("/quiz/:level", getquizbylevel);
router.put("/playquiz", authMiddlware, playquiz);

module.exports = router;
