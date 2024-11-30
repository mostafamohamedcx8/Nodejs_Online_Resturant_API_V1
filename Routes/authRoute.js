const express = require("express");
const {
  signup,
  login,
  forgetpassword,
  verifypassResetCode,
  resetpassword,
} = require("../services/authService");
const {
  SignupValidator,
  LoginValidator,
} = require("../Utils/validators/authvalidator");
const router = express.Router();
router.post("/signup", SignupValidator, signup);
router.post("/login", LoginValidator, login);
router.post("/forgetpassword", forgetpassword);
router.post("/verifyresetcode", verifypassResetCode);
router.put("/resetpassword", resetpassword);
module.exports = router;
