import express, { json } from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import taskRoutes from "./routes/taskRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import activityRoutes from "./routes/activityRoutes";
import errorHandler from "./middleware/errorHandler";
import AppError from "./utils/AppError";

const app = express();

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "*",
    credentials: true,
  })
);
app.use(json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "task-force-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/activity", activityRoutes);

app.use((req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

export default app;
