const express = require("express");
const authService = require("../services/authService");

const {
  createFood,
  getFood,
  updateFood,
  deleteFood,
  getAllFood,
} = require("../services/FoodService");
const {
  createFoodValidator,
  getFoodValidator,
  updateFoodValidator,
  deleteFoodValidator,
} = require("../Utils/validators/FoodValidator");

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    createFoodValidator,
    createFood
  )
  .get(getAllFood);

router
  .route("/:id")
  .get(getFoodValidator, getFood)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    updateFoodValidator,
    updateFood
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteFoodValidator,
    deleteFood
  );

module.exports = router;
