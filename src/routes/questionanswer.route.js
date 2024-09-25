const express = require("express");
const router = express.Router();

const {
  questionanswercreate,
  getquestionanswerbycategory,
  deletequestionanswer,
  updatequestionanswer,
  getallquestionanswer,
} = require("../controllers/questionanswer.controller");

router.post("/questionanswer", questionanswercreate);
router.get("/questionanswer/:category", getquestionanswerbycategory);
router.get("/questionanswer", getallquestionanswer);
router.put("/questionanswer/:id", updatequestionanswer);
router.delete("/questionanswer/:id", deletequestionanswer);

module.exports = router;
