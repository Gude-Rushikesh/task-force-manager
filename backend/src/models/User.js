const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
      index: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
