const express = require("express");
const { addTaskData, getAllTasks, getTaskById, updateTaskData, deleteTaskData } = require("../controller/taskData");

const router = express.Router();

router.post("/task", addTaskData);
router.get("/task", getAllTasks);
router.get("/task/:id", getTaskById);
router.put("/task/:id", updateTaskData);
router.delete("/task/:id", deleteTaskData);
module.exports = router;
