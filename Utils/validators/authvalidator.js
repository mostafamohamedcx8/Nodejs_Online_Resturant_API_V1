const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../Models/UserModels");

exports.SignupValidator = [
  check("userName")
    .notEmpty()
    .withMessage("User require")
    .isLength({ min: 3 })
    .withMessage("too short User name")
    .isLength({ max: 32 })
    .withMessage("too long User name")
    .custom((val) =>
      User.findOne({ userName: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("UserName already exists"));
        }
      })
    )
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ minn: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password must same passwordConfirm");
      }
      return true;
    }),
  check("passwordConfirm").notEmpty().withMessage("password confirm required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Accept only phone numbers from Egypt & Sudia"),
  check("usertype").optional(),
  check("profile").optional(),

  validatorMiddleware,
];

exports.LoginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ minn: 6 })
    .withMessage("password must be at least 6 characters"),

  validatorMiddleware,
];
