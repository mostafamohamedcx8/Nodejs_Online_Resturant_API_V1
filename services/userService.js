const User = require("../Models/UserModels");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const createtoken = require("../Utils/createToken");
const ApiError = require("../Utils/apiError");

// desc Create User
// route Post /api/vi/Users
// access Private
exports.createUser = asyncHandler(async (req, res) => {
  const Document = await User.create(req.body);
  res.status(201).json({ data: Document });
});

exports.getUsers = asyncHandler(async (req, res) => {
  let filter = {};

  // Build query
  const Documents = await User.find();

  // excute query
  res.status(200).json({ data: Documents });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let query = User.findById(id);
  const Document = await query;
  if (!Document) {
    return next(new ApiError(`No Document for this id ${id}`, 404));
  }
  res.status(200).json({ data: Document });
});
// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// desc Update speciface User
// route Put /api/vi/Users/:id
// access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const Document = await User.findByIdAndUpdate(
    req.params.id,
    {
      userName: req.body.userName,
      email: req.body.email,
      phone: req.body.phone,
      profile: req.body.profile,
      usertype: req.body.usertype,
      address: req.body.address,
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(new ApiError(`No Document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: Document });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.UpdateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updateduser = await User.findByIdAndUpdate(
    req.user._id,
    {
      userName: req.body.userName,
      email: req.body.email,
      phone: req.body.phone,
      profile: req.body.profile,
      usertype: req.body.usertype,
      address: req.body.address,
    },
    { new: true }
  );
  res.status(200).json({ data: updateduser });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const Document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(new ApiError(`No Document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: Document });
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.UpdateUserLoggedPassword = asyncHandler(async (req, res, next) => {
  // 1)update user password based on user payload(req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordchangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  // 2)generate token
  const token = createtoken(user._id);
  // 2) return updated user
  res.status(200).json({ data: user, token });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deletUserLoggedData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).send();
});

// desc delet speciface User
// route Delete /api/vi/Users/:id
// access Private
exports.deletUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await User.findByIdAndDelete(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  // Trigger "remove" event when update document
  await document.deleteOne();
  res.status(204).send();
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: "ok",
    message: "Logged out successfully",
  });
});
