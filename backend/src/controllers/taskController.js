const Task = require("../models/task");
const Employee = require("../models/Employee");
const Department = require("../models/Department");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const logActivity = require("../utils/activity");

function taskPopulation(query) {
  return query
    .populate("assignedTo", "name employeeCode status")
    .populate("department", "name code")
    .populate("createdBy", "name role")
    .populate("comments.author", "name role");
}

function buildTaskQuery(query, user) {
  const filter = {};
  if (query.status && query.status !== "All") filter.status = query.status;
  if (query.priority && query.priority !== "All") filter.priority = query.priority;
  if (query.department && query.department !== "All") filter.department = query.department;
  if (query.assignedTo && query.assignedTo !== "All") filter.assignedTo = query.assignedTo;
  if (query.search) filter.$text = { $search: query.search };
  if (query.overdue === "true") {
    filter.status = { $ne: "Completed" };
    filter.dueDate = { $lt: new Date() };
  }
  if (user.role === "Employee" && user.employee) filter.assignedTo = user.employee;
  return filter;
}

async function validateTaskRefs({ department, assignedTo }) {
  const [departmentExists, employeeExists] = await Promise.all([
    Department.exists({ _id: department }),
    Employee.exists({ _id: assignedTo, status: { $ne: "Inactive" } }),
  ]);

  if (!departmentExists) throw new AppError("Department not found", 404);
  if (!employeeExists) throw new AppError("Active employee not found", 404);
}

const listTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const sort = req.query.sort || "dueDate";
  const filter = buildTaskQuery(req.query, req.user);

  const [items, total] = await Promise.all([
    taskPopulation(
      Task.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
    ),
    Task.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await taskPopulation(Task.findById(req.params.id));
  if (!task) throw new AppError("Task not found", 404);
  if (req.user.role === "Employee" && String(task.assignedTo._id) !== String(req.user.employee)) {
    throw new AppError("You can only view tasks assigned to you", 403);
  }
  res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
  await validateTaskRefs(req.body);

  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id,
    statusHistory: [{ status: req.body.status || "Assigned", changedBy: req.user._id }],
  });

  await logActivity({
    actor: req.user._id,
    action: "created task",
    entityType: "Task",
    entityId: task._id,
    metadata: { title: task.title, status: task.status },
  });

  res.status(201).json(await taskPopulation(Task.findById(task._id)));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found", 404);

  if (req.user.role === "Employee" && String(task.assignedTo) !== String(req.user.employee)) {
    throw new AppError("You can only update your assigned tasks", 403);
  }

  if (req.body.department || req.body.assignedTo) {
    await validateTaskRefs({
      department: req.body.department || task.department,
      assignedTo: req.body.assignedTo || task.assignedTo,
    });
  }

  const oldStatus = task.status;
  const allowedForEmployee = ["status", "comments"];
  Object.entries(req.body).forEach(([key, value]) => {
    if (req.user.role === "Employee" && !allowedForEmployee.includes(key)) return;
    task[key] = value;
  });

  if (req.body.status && req.body.status !== oldStatus) {
    task.statusHistory.push({ status: req.body.status, changedBy: req.user._id });
    task.completedAt = req.body.status === "Completed" ? new Date() : undefined;
  }

  await task.save();
  await logActivity({
    actor: req.user._id,
    action: "updated task",
    entityType: "Task",
    entityId: task._id,
    metadata: { title: task.title, status: task.status },
  });

  res.json(await taskPopulation(Task.findById(task._id)));
});

const addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new AppError("Task not found", 404);
  if (!req.body.message) throw new AppError("Comment message is required", 400);

  task.comments.push({ message: req.body.message, author: req.user._id });
  await task.save();
  res.status(201).json(await taskPopulation(Task.findById(task._id)));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new AppError("Task not found", 404);

  await logActivity({
    actor: req.user._id,
    action: "deleted task",
    entityType: "Task",
    entityId: task._id,
    metadata: { title: task.title },
  });

  res.status(204).send();
});

module.exports = { listTasks, getTask, createTask, updateTask, addComment, deleteTask };
