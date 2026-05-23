const express = require("express");
const { listActivity } = require("../controllers/activityController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, authorize("Admin", "Manager"), listActivity);

module.exports = router;
