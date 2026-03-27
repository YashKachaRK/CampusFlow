const pool = require('../config/db');

// GET /api/timetable
const getTimetable = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM timetable_slots');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/timetable
const createSlot = async (req, res) => {
  try {
    const { day, start_time, end_time, subject, room, faculty_id } = req.body;
    const result = await pool.query(
      `INSERT INTO timetable_slots (day, start_time, end_time, subject, room, faculty_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [day, start_time, end_time, subject, room, faculty_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/timetable/:id
const updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, room } = req.body;
    const result = await pool.query(
      `UPDATE timetable_slots SET subject = $1, room = $2 WHERE id = $3 RETURNING *`,
      [subject, room, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/timetable/:id
const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM timetable_slots WHERE id = $1', [id]);
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTimetable, createSlot, updateSlot, deleteSlot };