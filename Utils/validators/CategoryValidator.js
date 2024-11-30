const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("title")
    .notEmpty()
    .withMessage("title require")
    .isLength({ min: 5 })
    .withMessage("too short Category title")
    .isLength({ max: 100 })
    .withMessage("too long Category title"),
  check("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid Category id format"),
  check("title")
    .optional()
    .isLength({ min: 5 })
    .withMessage("too short Category title")
    .isLength({ max: 100 })
    .withMessage("too long Category title"),
  check("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),

  validatorMiddleware,
];

exports.deletCategoryValidator = [
  check("id").isMongoId().withMessage("invalid Category id format"),
  validatorMiddleware,
];
