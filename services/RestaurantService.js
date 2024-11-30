const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
const Restaurant = require("../Models/RestaurantModels");

exports.createRestaurant = asyncHandler(async (req, res) => {
  const Document = await Restaurant.create(req.body);
  res.status(201).json({ data: Document });
});

exports.getAllRestaurant = asyncHandler(async (req, res) => {
  // Build query
  const Documents = await Restaurant.find();
  res.status(200).json({ data: Documents });
});

exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let query = Restaurant.findById(id);
  const Document = await query;
  if (!Document) {
    return next(new ApiError(`No Document for this id ${id}`, 404));
  }
  res.status(200).json({ data: Document });
});

exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  const document = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  // Trigger "save" event when update document
  document.save();
  res.status(200).json({ data: document });
});

exports.DeleteRestaurant = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await Restaurant.findByIdAndDelete(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }

  // Trigger "remove" event when update document
  await document.deleteOne();
  res.status(204).send();
});
