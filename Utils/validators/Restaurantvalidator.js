const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Restaurant = require("../../Models/RestaurantModels");
const Food = require("../../Models/FoodModel");

exports.getRestaurantValidator = [
  check("id").isMongoId().withMessage("invalid Restaurant id format"),
  validatorMiddleware,
];

exports.createRestaurantValidator = [
  check("title")
    .notEmpty()
    .withMessage("title require")
    .isLength({ min: 5 })
    .withMessage("too short Restaurant title")
    .isLength({ max: 100 })
    .withMessage("too long Restaurant title")
    .custom((val) =>
      Restaurant.findOne({ title: val }).then((Title) => {
        if (Title) {
          return Promise.reject(new Error("Title already exists"));
        }
      })
    ),
  check("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  check("foods")
    .optional()
    .isMongoId()
    .withMessage("invalid id format")
    .custom((foods) =>
      Food.find({ _id: { $exists: true, $in: foods } }).then((result) => {
        // eslint-disable-next-line eqeqeq
        if (result.length != foods.length || result.length < 1) {
          return Promise.reject(new Error("Invalid foods ids"));
        }
      })
    ),
  check("time").optional(),
  check("pickup")
    .optional()
    .isBoolean()
    .withMessage("Pickup must be a boolean value"),

  check("delivery")
    .optional()
    .isBoolean()
    .withMessage("Delivery must be a boolean value"),

  check("isOpen")
    .optional()
    .isBoolean()
    .withMessage("IsOpen must be a boolean value"),

  check("logoUrl")
    .optional()
    .isURL()
    .withMessage("Logo URL must be a valid URL"),

  check("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  check("ratingCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rating count must be a non-negative integer"),

  check("code")
    .notEmpty()
    .withMessage("code require")
    .isString()
    .withMessage("Code should be a string")
    .isLength({ min: 10 })
    .withMessage("Code should between 10 and 12 characters")
    .isLength({ max: 12 })
    .withMessage("Code should between 10 and 12 characters")
    .custom((val) =>
      Restaurant.findOne({ code: val }).then((Title) => {
        if (Title) {
          return Promise.reject(new Error("Code already exists"));
        }
      })
    ),

  check("coords.id")
    .optional()
    .isString()
    .withMessage("Location ID should be a string"),

  check("coords.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number between -90 and 90"),

  check("coords.latitudeDelta")
    .optional()
    .isFloat()
    .withMessage("Latitude delta must be a valid number"),

  check("coords.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number between -180 and 180"),

  check("coords.longitudeDelta")
    .optional()
    .isFloat()
    .withMessage("Longitude delta must be a valid number"),

  check("coords.address")
    .optional()
    .isString()
    .withMessage("Address should be a string"),

  check("coords.title")
    .optional()
    .isString()
    .withMessage("Location title should be a string"),

  validatorMiddleware,
];

exports.updateRestaurantValidator = [
  check("id").isMongoId().withMessage("invalid Restaurant id format"),
  check("title")
    .optional()
    .isLength({ min: 5 })
    .withMessage("too short Restaurant title")
    .isLength({ max: 100 })
    .withMessage("too long Restaurant title"),
  check("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  check("foods")
    .optional()
    .isMongoId()
    .withMessage("invalid id format")
    .custom((foods) =>
      Food.find({ _id: { $exists: true, $in: foods } }).then((result) => {
        // eslint-disable-next-line eqeqeq
        if (result.length != foods.length || result.length < 1) {
          return Promise.reject(new Error("Invalid foods ids"));
        }
      })
    ),

  check("time").optional(),
  check("pickup")
    .optional()
    .isBoolean()
    .withMessage("Pickup must be a boolean value"),

  check("delivery")
    .optional()
    .isBoolean()
    .withMessage("Delivery must be a boolean value"),

  check("isOpen")
    .optional()
    .isBoolean()
    .withMessage("IsOpen must be a boolean value"),

  check("logoUrl")
    .optional()
    .isURL()
    .withMessage("Logo URL must be a valid URL"),

  check("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  check("ratingCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rating count must be a non-negative integer"),

  check("code")
    .optional()
    .isString()
    .withMessage("Code should be a string")
    .isLength({ min: 10 })
    .withMessage("Code should between 10 and 12 characters")
    .isLength({ max: 12 })
    .withMessage("Code should between 10 and 12 characters")
    .custom((val) =>
      Restaurant.findOne({ code: val }).then((Title) => {
        if (Title) {
          return Promise.reject(new Error("Code already exists"));
        }
      })
    ),

  check("coords.id")
    .optional()
    .isString()
    .withMessage("Location ID should be a string"),

  check("coords.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number between -90 and 90"),

  check("coords.latitudeDelta")
    .optional()
    .isFloat()
    .withMessage("Latitude delta must be a valid number"),

  check("coords.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number between -180 and 180"),

  check("coords.longitudeDelta")
    .optional()
    .isFloat()
    .withMessage("Longitude delta must be a valid number"),

  check("coords.address")
    .optional()
    .isString()
    .withMessage("Address should be a string"),

  check("coords.title")
    .optional()
    .isString()
    .withMessage("Location title should be a string"),

  validatorMiddleware,
];

exports.deletRestaurantValidator = [
  check("id").isMongoId().withMessage("invalid Restaurant id format"),
  validatorMiddleware,
];
