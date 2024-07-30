const express = require("express");
const router = express.Router();
const {
  questionanswercreate,
  getquestionanswerbycategory,
  deletequestionanswer,
  updatequestionanswer,
} = require("../controllers/questionanswer.controller");
const fileUpload = require("../middlewares/upload.middleware");

router.post(
  "/questionanswer",
  fileUpload.single("image"),
  questionanswercreate
);
router.get("/questionanswer/:category", getquestionanswerbycategory);
router.delete("/questionanswer/:id", deletequestionanswer);
router.put(
  "/questionanswer/:id",
  fileUpload.single("image"),
  updatequestionanswer
);

module.exports = router;
