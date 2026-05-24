const Department = require("../models/Department").default;
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const logActivity = require("../utils/activity");

const listDepartments = asyncHandler(async (_req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json({ items: departments });
});

const createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  await logActivity({
    actor: req.user._id,
    action: "created department",
    entityType: "Department",
    entityId: department._id,
    metadata: { name: department.name },
  });
  res.status(201).json(department);
});

const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!department) throw new AppError("Department not found", 404);
  res.json(department);
});

module.exports = { listDepartments, createDepartment, updateDepartment };
