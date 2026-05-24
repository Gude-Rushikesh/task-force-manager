const Employee = require("../models/Employee").default;
const Department = require("../models/Department").default;
const Task = require("../models/task").default;
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/activity");

function buildEmployeeQuery(query) {
  const filter = {};
  if (query.status && query.status !== "All") filter.status = query.status;
  if (query.department && query.department !== "All")
    filter.department = query.department;
  if (query.search) filter.$text = { $search: query.search };
  return filter;
}

const listEmployees = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const filter = buildEmployeeQuery(req.query);

  const [items, total] = await Promise.all([
    Employee.find(filter)
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Employee.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
});

const getEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate(
    "department",
    "name code",
  );
  if (!employee) throw new AppError("Employee not found", 404);
  res.json(employee);
});

const createEmployee = asyncHandler(async (req, res) => {
  const departmentExists = await Department.exists({
    _id: req.body.department,
  });
  if (!departmentExists) throw new AppError("Department not found", 404);

  const employee = await Employee.create(req.body);
  await logActivity({
    actor: req.user._id,
    action: "created employee",
    entityType: "Employee",
    entityId: employee._id,
    metadata: { name: employee.name },
  });

  res.status(201).json(employee);
});

const updateEmployee = asyncHandler(async (req, res) => {
  if (req.body.department) {
    const departmentExists = await Department.exists({
      _id: req.body.department,
    });
    if (!departmentExists) throw new AppError("Department not found", 404);
  }

  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("department", "name code");

  if (!employee) throw new AppError("Employee not found", 404);

  await logActivity({
    actor: req.user._id,
    action: "updated employee",
    entityType: "Employee",
    entityId: employee._id,
    metadata: { name: employee.name },
  });

  res.json(employee);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const assignedTasks = await Task.countDocuments({
    assignedTo: req.params.id,
    status: { $ne: "Completed" },
  });

  if (assignedTasks > 0) {
    throw new AppError(
      "Cannot delete employee with active assigned tasks",
      409,
    );
  }

  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) throw new AppError("Employee not found", 404);

  await logActivity({
    actor: req.user._id,
    action: "deleted employee",
    entityType: "Employee",
    entityId: employee._id,
    metadata: { name: employee.name },
  });

  res.status(204).send();
});

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
