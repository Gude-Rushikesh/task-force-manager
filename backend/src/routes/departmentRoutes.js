const express = require("express");
const {
  listDepartments,
  createDepartment,
  updateDepartment,
} = require("../controllers/departmentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(listDepartments)
  .post(authorize("Admin"), createDepartment);

router.put("/:id", authorize("Admin"), updateDepartment);

module.exports = router;
