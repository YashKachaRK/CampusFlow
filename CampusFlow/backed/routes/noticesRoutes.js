const express = require('express');
const router = express.Router();
const noticesController = require('../controllers/noticesController');

// Routes
router.get('/', noticesController.getAllNotices);
router.post('/', noticesController.createNotice);
router.delete('/:id', noticesController.deleteNotice);

module.exports = router;