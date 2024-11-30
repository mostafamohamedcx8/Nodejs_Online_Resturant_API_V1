const express = require("express");
const authService = require("../services/authService");

const router = express.Router();

const {
  createRestaurant,
  getAllRestaurant,
  getRestaurant,
  updateRestaurant,
  DeleteRestaurant,
} = require("../services/RestaurantService");

const {
  getRestaurantValidator,
  createRestaurantValidator,
  deletRestaurantValidator,
  updateRestaurantValidator,
} = require("../Utils/validators/Restaurantvalidator");

router
  .route("/")
  .get(getAllRestaurant)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    createRestaurantValidator,
    createRestaurant
  );
router
  .route("/:id")
  .get(getRestaurantValidator, getRestaurant)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    updateRestaurantValidator,
    updateRestaurant
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletRestaurantValidator,
    DeleteRestaurant
  );

module.exports = router;
