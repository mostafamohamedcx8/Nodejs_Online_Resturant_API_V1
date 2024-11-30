const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../Models/UserModels");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
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

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  check("userName")
    .optional()
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
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Accept only phone numbers from Egypt & Sudia"),
  check("usertype").optional(),
  check("profile").optional(),
  validatorMiddleware,
];

exports.deletUserValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  validatorMiddleware,
];

exports.changeUserpasswordValidator = [
  check("id").isMongoId().withMessage("invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("you must enter currentPassword"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("you must enter passwordconfirm"),
  body("password")
    .notEmpty()
    .withMessage("you must enter New Password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("there no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("current password is incorrect");
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error("password must same paswordConfirm");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.updateUserLoggedValidator = [
  check("userName")
    .optional()
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
    .optional()
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Accept only phone numbers from Egypt & Sudia"),
  check("usertype").optional(),
  check("profile").optional(),
  validatorMiddleware,
];
