const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
const Food = require("../Models/FoodModel");

// desc Create Food
// route Post /api/vi/FOOD
// access Private
exports.createFood = asyncHandler(async (req, res) => {
  const Document = await Food.create(req.body);
  res.status(201).json({ data: Document });
});

// desc get list of food
// route get /api/v1/food
// access Public
exports.getFood = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let query = Food.findById(id);

  const Document = await query;
  if (!Document) {
    return next(new ApiError(`No Document for this id ${id}`, 404));
  }
  res.status(200).json({ data: Document });
});

// desc get sepific subFood by id
// route get /api/vi/food/:id
// access Public
exports.getAllFood = asyncHandler(async (req, res) => {
  // Build query
  const Documents = await Food.find();
  res.status(200).json({ data: Documents });
});

// desc Update speciface subFood
// route Put /api/vi/categories/:id
// access Private
exports.updateFood = asyncHandler(async (req, res, next) => {
  const document = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  // Trigger "save" event when update document
  document.save();
  res.status(200).json({ data: document });
});

// desc delet speciface subcategory
// route Delete /api/vi/categories/:id
// access Private
exports.deleteFood = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await Food.findByIdAndDelete(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  // Trigger "remove" event when update document
  await document.deleteOne();
  res.status(204).send();
});
