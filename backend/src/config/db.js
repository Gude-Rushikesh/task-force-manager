import { set, connect } from "mongoose";

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  set("strictQuery", true);
  await connect(mongoUri);
  console.log("MongoDB connected");
}

export default connectDB;
