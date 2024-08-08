const express = require("express");

const {
  registrationUser,
  loginUser,
  getMyData,
  changePasswordInApp,
  updateRolebyadmin,
  getAllUser,
} = require("../controllers/user.controller");
const {
  authMiddlware,
  adminMiddleware,
} = require("../middlewares/auth.middlware");
const router = express.Router();

router.post("/registration", registrationUser);
router.post("/login", loginUser);
router.get("/mydata", authMiddlware, getMyData);
router.put("/changepassword", authMiddlware, changePasswordInApp);
router.put(
  "/roleupdatebyadmin/:id",
  authMiddlware,
  adminMiddleware,
  updateRolebyadmin
);
router.get("/alluser", authMiddlware, adminMiddleware, getAllUser);

module.exports = router;
