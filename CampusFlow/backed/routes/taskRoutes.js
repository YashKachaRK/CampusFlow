const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/:student_id", taskController.getTasks);
router.post("/", taskController.addTask);
router.put("/toggle/:id", taskController.toggleTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;