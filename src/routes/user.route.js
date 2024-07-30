const express = require("express");

const {
  registrationUser,
  loginUser,
  getMyData,
  changePasswordInApp,
} = require("../controllers/user.controller");
const { authMiddlware } = require("../middlewares/auth.middlware");
const router = express.Router();

// router.route('/register').post(registrationUser)
router.post("/registration", registrationUser);
router.post("/login", loginUser);
router.get("/mydata", authMiddlware, getMyData);
router.put("/changepassword", authMiddlware, changePasswordInApp);

module.exports = router;
