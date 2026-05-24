import { Schema, model } from "mongoose";

const activityLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, trim: true },
    entityType: {
      type: String,
      enum: ["Task", "Employee", "Department", "User"],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true },
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

export default model("ActivityLog", activityLogSchema);
