import { Router } from "express";
import { getOverview } from "../controllers/analyticsController";
import { protect } from "../middleware/auth";

const router = Router();

router.get("/overview", protect, getOverview);

export default router;
