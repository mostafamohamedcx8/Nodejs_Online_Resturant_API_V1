const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "food Title is Required"] },
    description: {
      type: String,
      required: [true, "food Description is Required"],
    },
    price: {
      type: Number,
      required: [true, "food Price is Required"],
      min: [1, "food Price must be greater than or equal to 1"],
    },
    imageUrl: {
      type: String,
      default:
        "https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png",
    },
    foodTags: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Food must be belong to parent category"],
    },
    code: {
      type: String,
      required: [true, "food Code is Required"],
      unique: [true, "food Code is taken"],
    },
    isAvalible: {
      type: Boolean,
      default: true,
    },
    restaurant: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Restaurant",
      },
    ],
    rating: {
      type: Number,
      default: 5,
      min: [1, "Rating must be greater than or equal to 1"],
      max: [5, "Rating must be less than or equal to 5"],
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", FoodSchema);
