const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true, maxlength: 120 },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    designation: { type: String, trim: true, default: "Associate" },
    capacityHoursPerWeek: { type: Number, min: 1, max: 80, default: 40 },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Leave"],
      default: "Active",
      index: true,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

employeeSchema.index({ name: "text", employeeCode: "text", email: "text" });

module.exports = mongoose.model("Employee", employeeSchema);
