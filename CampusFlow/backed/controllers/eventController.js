const pool = require('../config/db');

// @desc    Get all events
// @route   GET /api/events
const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schedule_events');
    
    const formattedEvents = result.rows.map(row => ({
      id: row.id.toString(),
      title: row.title,
      start: row.start_dt,
      end: row.end_dt,
      allDay: row.all_day,
      color: row.color,
      extendedProps: {
        type: row.type,
        location: row.location
      }
    }));
    
    res.json(formattedEvents);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
const createEvent = async (req, res) => {
  try {
    const { title, start, end, allDay, color, extendedProps } = req.body;
    const type = extendedProps?.type || 'Event';
    const location = extendedProps?.location || '';

    const newEvent = await pool.query(
      `INSERT INTO schedule_events (title, start_dt, end_dt, all_day, color, type, location) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, start, end || null, allDay, color, type, location]
    );

    const row = newEvent.rows[0];
    res.status(201).json({
      id: row.id.toString(),
      title: row.title,
      start: row.start_dt,
      end: row.end_dt,
      allDay: row.all_day,
      color: row.color,
      extendedProps: { type: row.type, location: row.location }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start, end, allDay, color, extendedProps } = req.body;
    const type = extendedProps?.type || 'Event';
    const location = extendedProps?.location || '';

    const updatedEvent = await pool.query(
      `UPDATE schedule_events 
       SET title = $1, start_dt = $2, end_dt = $3, all_day = $4, color = $5, type = $6, location = $7
       WHERE id = $8 
       RETURNING *`,
      [title, start, end || null, allDay, color, type, location, id]
    );

    if (updatedEvent.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const row = updatedEvent.rows[0];
    res.json({
      id: row.id.toString(),
      title: row.title,
      start: row.start_dt,
      end: row.end_dt,
      allDay: row.all_day,
      color: row.color,
      extendedProps: { type: row.type, location: row.location }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM schedule_events WHERE id = $1', [id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};