const express = require("express");

const {
  addCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const fileUpload = require("../middlewares/upload.middleware");

const router = express.Router();
router.post("/addcategory", fileUpload.single("image"), addCategory);
router.get("/allcategory", getAllCategory);
router.get("/singlecategory/:id", getCategory);
router.delete("/deletecategory/:id", deleteCategory);
router.put("/updatecategory/:id", fileUpload.single("image"), updateCategory);

module.exports = router;
