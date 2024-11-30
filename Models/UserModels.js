const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is Required"],
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is Required"],
      minlength: [6, "password TOO short"],
    },
    passwordchangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    address: {
      type: Array,
    },
    phone: {
      type: String,
      required: [true, "phone is Required"],
    },
    usertype: {
      type: String,
      default: "clinet",
      enum: ["clinet", "admin", "vendor", "driver"],
    },
    active: { type: Boolean, default: true },

    profile: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngall.com%2Fprofile-png%2F&psig=AOvVaw1nRpBwHNlZvmVwcNvni3Lj&ust=1730585887676000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNj_rf-UvIkDFQAAAAAdAAAAABAE",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
module.exports = mongoose.model("User", UserSchema);
