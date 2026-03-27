const express = require('express');
const router = express.Router();
const { getTimetable, createSlot, updateSlot, deleteSlot } = require('../controllers/timetableController');

router.route('/')
  .get(getTimetable)
  .post(createSlot);

router.route('/:id')
  .put(updateSlot)
  .delete(deleteSlot);

module.exports = router;