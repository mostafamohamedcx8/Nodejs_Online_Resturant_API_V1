const authroute = require("./authRoute");
const userroute = require("./userRoute");
const restaurantroute = require("./RestaurantRoute");
const Categoryroute = require("./CategoryRoute");
const Foodroute = require("./FoodRoute");

const MountRoutes = (app) => {
  app.use("/api/v1/auth", authroute);
  app.use("/api/v1/users", userroute);
  app.use("/api/v1/restaurant", restaurantroute);
  app.use("/api/v1/category", Categoryroute);
  app.use("/api/v1/food", Foodroute);
};

module.exports = MountRoutes;
