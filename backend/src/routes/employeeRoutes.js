const express = require("express");
const {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

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

module.exports = router;
