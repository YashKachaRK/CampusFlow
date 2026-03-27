const express = require('express');
const router = express.Router();
const { getFacultyDashboardStats } = require('../controllers/dashboardController');

router.route('/faculty')
  .get(getFacultyDashboardStats);

module.exports = router;