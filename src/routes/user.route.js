const express = require("express");
const router = express.Router();

const {
  registrationUser,
  loginUser,
  getMyData,
  changePasswordInApp,
  updateRolebyadmin,
  getAllUser,
  adminLogin,
  sendOTPForPasswordRecovery,
  PasswordRecovery,
  PasswordChange,
} = require("../controllers/user.controller");
const {
  authMiddlware,
  adminMiddleware,
} = require("../middlewares/auth.middlware");

router.post("/registration", registrationUser);
router.post("/login", loginUser);
router.post("/adminlogin", adminLogin);

router.get("/mydata", authMiddlware, getMyData);
router.put("/changepassword", authMiddlware, changePasswordInApp);
router.put(
  "/roleupdatebyadmin/:id",
  authMiddlware,
  adminMiddleware,
  updateRolebyadmin
);
router.get("/alluser", authMiddlware, adminMiddleware, getAllUser);
router.put("/sendotp", sendOTPForPasswordRecovery);
router.put("/passwordrecovery", PasswordRecovery);
router.put("/passwordchange", PasswordChange);

module.exports = router;
