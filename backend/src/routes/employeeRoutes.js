import { Router } from "express";
import { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employeeController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(listEmployees)
  .post(authorize("Admin", "Manager"), createEmployee);

router
  .route("/:id")
  .get(getEmployee)
  .put(authorize("Admin", "Manager"), updateEmployee)
  .delete(authorize("Admin"), deleteEmployee);

export default router;
