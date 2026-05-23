const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, trim: true },
    entityType: {
      type: String,
      enum: ["Task", "Employee", "Department", "User"],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
