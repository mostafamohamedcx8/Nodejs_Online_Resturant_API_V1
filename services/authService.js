const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModels");
const ApiError = require("../Utils/apiError");
const bcrypt = require("bcrypt");
const createToken = require("../Utils/createToken");
const jwt = require("jsonwebtoken"); // Ensure JWT module is imported
const crypto = require("crypto");
const sendEmail = require("../Utils/sendemail");
// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1-Create User
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    phone: req.body.phone,
    usertype: req.body.usertype,
    profile: req.body.profile,
  });
  // 2- create token
  const token = createToken(user._id);
  // 3- Send response
  res.status(201).json({
    data: user,
    token,
  });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1- Find User
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  // 3- create token
  const token = createToken(user._id);
  // 4- Send response
  res.status(201).json({
    data: user,
    token,
  });
});

// make sure that user is loggin
exports.protect = asyncHandler(async (req, res, next) => {
  // 1- check if token exist and if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not logged in", 401));
  }
  //2- verify token (no change happen, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3- check if user still exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("User no longer exist", 401));
  }
  // 4- check if user changed his password after token created
  if (currentUser.passwordchangedAt) {
    const passchangedTimeStamp = parseInt(
      currentUser.passwordchangedAt.getTime / 1000,
      10
    );
    if (passchangedTimeStamp > decoded.iat) {
      return next(
        new ApiError("User recently changed password, PLZ login Again", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

// Authorization {User Permission}
exports.allowedTo = (...usertype) =>
  asyncHandler(async (req, res, next) => {
    if (!usertype.includes(req.user.usertype)) {
      return next(
        new ApiError("You are not authorized to perform this action", 403)
      );
    }
    next();
  });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgetpassword = asyncHandler(async (req, res, next) => {
  // 1) get User by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user found with this email", 404));
  }
  // 2) generate reset code 6 digit
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // save hashedResetCode into DB
  user.passwordResetCode = hashedResetCode;
  // add expiration time for ResetCode 10 min
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.userName},\nWe received a request to reset the password for your Restaurant account.\n${resetCode}\nEnter this code to complete the reset.\nThanks`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password Restaurant",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("Failed to send email", 500));
  }

  res.status(200).json({
    status: "ok",
    message: "Check your email for further instructions",
  });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifypassResetCode = asyncHandler(async (req, res, next) => {
  // 1)get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }
  // 2)reset code valid
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "ok",
    message: "Reset code verified successfully",
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetpassword = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user found with this email", 404));
  }
  // 2)check if resetcode verifyed
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }
  // 3) update password
  user.password = req.body.newpassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;

  await user.save();

  // 4)if everything ok generate new token
  const token = createToken(user._id);
  res.status(200).json({
    status: "ok",
    message: "Password reset successfully",
    token,
  });
});
