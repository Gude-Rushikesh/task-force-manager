import { Schema, model } from "mongoose";

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String, trim: true, maxlength: 500 },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Active", "Archived"], default: "Active" },
  },
  { timestamps: true },
);

export default model("Department", departmentSchema);
