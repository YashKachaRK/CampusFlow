const pool = require("../config/db");

exports.getTasks = async (req, res) => {
  const { student_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT *, due_date AS date
       FROM tasks
       WHERE student_id=$1
       ORDER BY created_at DESC`,
      [student_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
// ADD task
exports.addTask = async (req, res) => {
  const { title, subject, priority, date, fileName, fileUrl, student_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, subject, priority, due_date, file_name, file_url, student_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, subject, priority, date, fileName, fileUrl, student_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
};

// TOGGLE done
exports.toggleTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE tasks SET done = NOT done WHERE id=$1 RETURNING *",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Toggle failed" });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};