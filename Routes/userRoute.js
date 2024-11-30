const express = require("express");
const authService = require("../services/authService");

const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deletUser,
  changeUserPassword,
  getLoggedUserData,
  UpdateUserLoggedPassword,
  UpdateLoggedUserData,
  deletUserLoggedData,
  logout,
} = require("../services/userService");

const {
  getUserValidator,
  createUserValidator,
  deletUserValidator,
  updateUserValidator,
  changeUserpasswordValidator,
  updateUserLoggedValidator,
} = require("../Utils/validators/uservalidator");

router.use(authService.protect);
router.post("/logout", logout);
router.get("/getMe", getLoggedUserData, getUser);
router.put("/changemypassword", UpdateUserLoggedPassword);
router.delete("/deletme", deletUserLoggedData);
router.put("/updatemydata", updateUserLoggedValidator, UpdateLoggedUserData);

router.use(authService.allowedTo("admin"));
router.put(
  "/changePassword/:id",
  changeUserpasswordValidator,
  changeUserPassword
);
router.route("/").get(getUsers).post(createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deletUserValidator, deletUser);

module.exports = router;
