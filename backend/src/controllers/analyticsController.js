const Task = require("../models/task").default;
const Employee = require("../models/Employee").default;
const Department = require("../models/Department").default;
const asyncHandler = require("../utils/asyncHandler");

const getOverview = asyncHandler(async (req, res) => {
  const employeeFilter =
    req.user.role === "Employee" && req.user.employee
      ? { assignedTo: req.user.employee }
      : {};
  const now = new Date();

  const [
    totalTasks,
    completedTasks,
    overdueTasks,
    activeEmployees,
    departments,
    byStatus,
    byPriority,
    byDepartment,
    workload,
    recentTasks,
  ] = await Promise.all([
    Task.countDocuments(employeeFilter),
    Task.countDocuments({ ...employeeFilter, status: "Completed" }),
    Task.countDocuments({
      ...employeeFilter,
      status: { $ne: "Completed" },
      dueDate: { $lt: now },
    }),
    Employee.countDocuments({ status: "Active" }),
    Department.countDocuments({ status: "Active" }),
    Task.aggregate([
      { $match: employeeFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: employeeFilter },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: employeeFilter },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
      { $unwind: "$department" },
      { $project: { name: "$department.name", count: 1 } },
    ]),
    Task.aggregate([
      { $match: { ...employeeFilter, status: { $ne: "Completed" } } },
      {
        $group: {
          _id: "$assignedTo",
          activeTasks: { $sum: 1 },
          hours: { $sum: "$estimatedHours" },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      { $project: { name: "$employee.name", activeTasks: 1, hours: 1 } },
      { $sort: { activeTasks: -1 } },
      { $limit: 8 },
    ]),
    Task.find(employeeFilter)
      .populate("assignedTo", "name employeeCode")
      .populate("department", "name code")
      .sort({ updatedAt: -1 })
      .limit(6),
  ]);

  res.json({
    totals: {
      totalTasks,
      completedTasks,
      overdueTasks,
      activeEmployees,
      departments,
      completionRate: totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0,
    },
    byStatus,
    byPriority,
    byDepartment,
    workload,
    recentTasks,
  });
});

module.exports = { getOverview };
