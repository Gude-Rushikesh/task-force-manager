require("dotenv").config();

import connectDB from "./config/db";
import { deleteMany, create } from "./models/User";
import { deleteMany as _deleteMany, insertMany } from "./models/Department";
import { deleteMany as __deleteMany, insertMany as _insertMany } from "./models/Employee";
import { deleteMany as ___deleteMany, insertMany as __insertMany } from "./models/task";
import { deleteMany as ____deleteMany } from "./models/ActivityLog";
import { hashPassword } from "./utils/password";

const departments = [
  { name: "Billing", code: "BIL", description: "Invoice processing and financial operations" },
  { name: "Stock", code: "STK", description: "Inventory records and stock reconciliation" },
  { name: "Entry", code: "ENT", description: "Data entry, verification and cleanup" },
  { name: "Warehouse", code: "WH", description: "Storage, dispatch and audit operations" },
];

const names = [
  "Aarav Patil",
  "Rohan Deshmukh",
  "Kunal Joshi",
  "Sahil Kulkarni",
  "Nikhil More",
  "Omkar Jadhav",
  "Aditya Pawar",
  "Pratik Shinde",
  "Tejas Kale",
  "Akash Ghodke",
  "Sneha Gude",
  "Meera Kulkarni",
];

const titles = [
  "Process vendor invoices",
  "Update stock register",
  "Daily data entry verification",
  "Warehouse item audit",
  "Generate billing report",
  "Stock reconciliation",
  "Client entry validation",
  "Warehouse safety check",
  "GST filing preparation",
  "Stock inward entries",
  "Billing discrepancy review",
  "Warehouse dispatch log",
];

async function seed() {
  await connectDB();

  await Promise.all([
    deleteMany({}),
    _deleteMany({}),
    __deleteMany({}),
    ___deleteMany({}),
    ____deleteMany({}),
  ]);

  const admin = await create({
    name: "Admin User",
    email: "admin@taskforce.dev",
    role: "Admin",
    passwordHash: hashPassword("Admin@12345"),
  });

  const manager = await create({
    name: "Operations Manager",
    email: "manager@taskforce.dev",
    role: "Manager",
    passwordHash: hashPassword("Manager@12345"),
  });

  const createdDepartments = await insertMany(departments);
  const departmentByName = Object.fromEntries(createdDepartments.map((dep) => [dep.name, dep]));

  const employees = await _insertMany(
    names.map((name, index) => {
      const department = createdDepartments[index % createdDepartments.length];
      return {
        employeeCode: `EMP-2026-${String(index + 1).padStart(3, "0")}`,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@taskforce.dev`,
        phone: `90963623${String(index).padStart(2, "0")}`,
        location: index % 2 === 0 ? "Pune, IN" : "Mumbai, IN",
        department: department._id,
        designation: index % 3 === 0 ? "Team Lead" : "Associate",
        capacityHoursPerWeek: index % 3 === 0 ? 45 : 40,
        status: index === 10 ? "Leave" : "Active",
      };
    })
  );

  await create({
    name: employees[0].name,
    email: "employee@taskforce.dev",
    role: "Employee",
    employee: employees[0]._id,
    passwordHash: hashPassword("Employee@12345"),
  });

  const statuses = ["Assigned", "In Progress", "Review", "Completed", "Blocked"];
  const priorities = ["Low", "Medium", "High", "Critical"];

  await __insertMany(
    titles.map((title, index) => {
      const employee = employees[index % employees.length];
      const department = departmentByName[departments[index % departments.length].name];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + index - 4);
      const status = statuses[index % statuses.length];

      return {
        title,
        description: `${title} for ${department.name} operations with clear ownership and deadline tracking.`,
        department: department._id,
        assignedTo: employee._id,
        createdBy: manager._id,
        priority: priorities[index % priorities.length],
        status,
        dueDate,
        estimatedHours: 3 + (index % 8),
        completedAt: status === "Completed" ? new Date() : undefined,
        statusHistory: [{ status, changedBy: manager._id }],
      };
    })
  );

  console.log("Seed complete");
  console.log("Admin: admin@taskforce.dev / Admin@12345");
  console.log("Manager: manager@taskforce.dev / Manager@12345");
  console.log("Employee: employee@taskforce.dev / Employee@12345");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
