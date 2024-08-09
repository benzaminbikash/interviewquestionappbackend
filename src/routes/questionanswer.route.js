const express = require("express");
const router = express.Router();

const {
  questionanswercreate,
  getquestionanswerbycategory,
  deletequestionanswer,
  updatequestionanswer,
  getallquestionanswer,
} = require("../controllers/questionanswer.controller");
const fileUpload = require("../middlewares/upload.middleware");

router.post(
  "/questionanswer",
  fileUpload.single("image"),
  questionanswercreate
);
router.get("/questionanswer/:category", getquestionanswerbycategory);
router.get("/questionanswer", getallquestionanswer);
router.put(
  "/questionanswer/:id",
  fileUpload.single("image"),
  updatequestionanswer
);
router.delete("/questionanswer/:id", deletequestionanswer);

module.exports = router;
