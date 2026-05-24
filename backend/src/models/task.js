import { Schema, model } from "mongoose";

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "Backlog",
        "Assigned",
        "In Progress",
        "Review",
        "Completed",
        "Blocked",
      ],
      required: true,
    },
    changedBy: { type: Schema.Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const commentSchema = new Schema(
  {
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, trim: true, maxlength: 2000 },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "Backlog",
        "Assigned",
        "In Progress",
        "Review",
        "Completed",
        "Blocked",
      ],
      default: "Assigned",
      index: true,
    },
    dueDate: { type: Date, required: true, index: true },
    estimatedHours: { type: Number, min: 0, default: 0 },
    completedAt: Date,
    statusHistory: [statusHistorySchema],
    comments: [commentSchema],
  },
  { timestamps: true },
);

taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ status: 1, priority: 1, dueDate: 1 });

export default model("Task", taskSchema);
