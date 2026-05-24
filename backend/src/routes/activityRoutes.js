import { Router } from "express";
import { listActivity } from "../controllers/activityController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", protect, authorize("Admin", "Manager"), listActivity);

export default router;
