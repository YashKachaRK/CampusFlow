const pool = require('../config/db');

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, course, year FROM users WHERE role = 'student' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Add a new student
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, email, course, year } = req.body;
    const defaultPassword = 'student123'; 

    const newStudent = await pool.query(
      `INSERT INTO users (name, email, password, role, course, year) 
       VALUES ($1, $2, $3, 'student', $4, $5) 
       RETURNING id, name, email, role, course, year`,
      [name, email, defaultPassword, course, year]
    );

    res.status(201).json(newStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course, year } = req.body;

    const updatedStudent = await pool.query(
      `UPDATE users SET name = $1, email = $2, course = $3, year = $4 
       WHERE id = $5 AND role = 'student' 
       RETURNING id, name, email, role, course, year`,
      [name, email, course, year, id]
    );

    if (updatedStudent.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(updatedStudent.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1 AND role = 'student'", [id]);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
};