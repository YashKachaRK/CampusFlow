const pool = require('../config/db');

// @desc    Get dashboard statistics for faculty
// @route   GET /api/dashboard/faculty
const getFacultyDashboardStats = async (req, res) => {
  try {
    // Run all 4 queries in parallel for better performance
    const [students, classes, notices, events] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'"),
      pool.query("SELECT COUNT(*) FROM timetable_slots"),
      pool.query("SELECT COUNT(*) FROM notices"),
      pool.query("SELECT COUNT(*) FROM schedule_events WHERE start_dt >= NOW()")
    ]);

    res.json({
      totalStudents: parseInt(students.rows[0].count),
      activeClasses: parseInt(classes.rows[0].count),
      totalNotices: parseInt(notices.rows[0].count),
      upcomingEvents: parseInt(events.rows[0].count)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getFacultyDashboardStats };