const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const Category = require("../../Models/CategoryModel");
const food = require("../../Models/FoodModel");
const restaurant = require("../../Models/RestaurantModels");

exports.getFoodValidator = [
  check("id").isMongoId().withMessage("invalid Food id format"),
  validatorMiddleware,
];

exports.deleteFoodValidator = [
  check("id")
    .notEmpty()
    .withMessage("Food must be belong to category")
    .isMongoId()
    .withMessage("invalid Food id format"),
  validatorMiddleware,
];

exports.createFoodValidator = [
  check("title")
    .notEmpty()
    .withMessage("title require")
    .isLength({ min: 2 })
    .withMessage("too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("too long Subcategory name"),
  check("price")
    .notEmpty()
    .withMessage("price require")
    .isNumeric()
    .withMessage("price must be a number"),
  check("description")
    .notEmpty()
    .withMessage("description require")
    .isLength({ min: 10 })
    .withMessage("too short Subcategory name")
    .isLength({ max: 150 })
    .withMessage("too long Subcategory name"),
  check("category")
    .notEmpty()
    .withMessage("Food must be belong to category")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom((categoryid) =>
      Category.findById(categoryid).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id ${categoryid}`)
          );
        }
      })
    ),
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
      food.findOne({ code: val }).then((Title) => {
        if (Title) {
          return Promise.reject(new Error("Code already exists"));
        }
      })
    ),
  check("restaurant")
    .isMongoId()
    .withMessage("invalid restaurant id format")
    .custom((restaurants) =>
      restaurant
        .find({ _id: { $exists: true, $in: restaurants } })
        .then((result) => {
          // eslint-disable-next-line eqeqeq
          if (result.length != restaurants.length || result.length < 1) {
            return Promise.reject(new Error("Invalid Restaurants ids"));
          }
        })
    ),
  check("rating").optional(),
  validatorMiddleware,
];

exports.updateFoodValidator = [
  check("id")
    .notEmpty()
    .withMessage("Foood must be belong to category")
    .isMongoId()
    .withMessage("invalid Food id format"),
  check("title")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("too long Subcategory name"),
  check("price").optional().isNumeric().withMessage("price must be a number"),
  check("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("too short Subcategory name")
    .isLength({ max: 150 })
    .withMessage("too long Subcategory name"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("invalid category id format")
    .custom((categoryid) =>
      Category.findById(categoryid).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id ${categoryid}`)
          );
        }
      })
    ),
  check("restaurant")
    .isMongoId()
    .withMessage("invalid restaurant id format")
    .custom((restaurants) =>
      restaurant
        .find({ _id: { $exists: true, $in: restaurants } })
        .then((result) => {
          // eslint-disable-next-line eqeqeq
          if (result.length != restaurants.length || result.length < 1) {
            return Promise.reject(new Error("Invalid Restaurants ids"));
          }
        })
    ),
  check("rating").isNumeric().withMessage("price must be a number"),
  validatorMiddleware,
];
