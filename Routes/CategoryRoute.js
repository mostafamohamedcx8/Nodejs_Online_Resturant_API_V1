const express = require("express");
const authService = require("../services/authService");

const router = express.Router();

const {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  DeleteCategory,
} = require("../services/CategoryService");

const {
  getCategoryValidator,
  createCategoryValidator,
  deletCategoryValidator,
  updateCategoryValidator,
} = require("../Utils/validators/CategoryValidator");

router
  .route("/")
  .get(getAllCategory)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletCategoryValidator,
    DeleteCategory
  );

module.exports = router;
