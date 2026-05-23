const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Active", "Archived"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
