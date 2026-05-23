const User = require("../models/User");
const Employee = require("../models/Employee");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");
const logActivity = require("../utils/activity");

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    employee: user.employee,
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "Employee", employee } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  if (employee) {
    const employeeExists = await Employee.exists({ _id: employee });
    if (!employeeExists) throw new AppError("Employee profile not found", 404);
  }

  const user = await User.create({
    name,
    email,
    role,
    employee,
    passwordHash: hashPassword(password),
  });

  await logActivity({
    actor: user._id,
    action: "registered user",
    entityType: "User",
    entityId: user._id,
  });

  const token = signToken({ sub: user._id.toString(), role: user.role });
  res.status(201).json({ token, user: userResponse(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status !== "Active") {
    throw new AppError("This account is inactive", 403);
  }

  const token = signToken({ sub: user._id.toString(), role: user.role });
  res.json({ token, user: userResponse(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: userResponse(req.user) });
});

module.exports = { register, login, me };
