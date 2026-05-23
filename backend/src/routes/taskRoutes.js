const express = require("express");
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  addComment,
  deleteTask,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(listTasks)
  .post(authorize("Admin", "Manager"), createTask);

router
  .route("/:id")
  .get(getTask)
  .put(updateTask)
  .delete(authorize("Admin", "Manager"), deleteTask);

router.post("/:id/comments", addComment);

module.exports = router;
