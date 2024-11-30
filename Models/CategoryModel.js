const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
    },
    imageUrl: {
      type: String,
      default:
        "https://w7.pngwing.com/pngs/692/99/png-transparent-delicious-food-food-salad-vegetable-salad-thumbnail.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
