import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.post("/register", protect, authorize("Admin"), register);
router.post("/login", login);
router.get("/me", protect, me);

export default router;
