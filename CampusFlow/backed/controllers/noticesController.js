const pool = require('../config/db');

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description, category, important, file_name, file_url, faculty_id } = req.body;

    const result = await pool.query(
      `INSERT INTO notices(title, description, category, important, file_name, file_url, faculty_id)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, description, category || 'General', important || false, file_name, file_url, faculty_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notices WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};