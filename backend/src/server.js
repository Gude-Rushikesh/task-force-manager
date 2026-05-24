require("dotenv").config();

import { listen } from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
