const ActivityLog = require("../models/ActivityLog");
const asyncHandler = require("../utils/asyncHandler");

const listActivity = asyncHandler(async (_req, res) => {
  const items = await ActivityLog.find()
    .populate("actor", "name role")
    .sort({ createdAt: -1 })
    .limit(25);

  res.json({ items });
});

module.exports = { listActivity };
