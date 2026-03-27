const express = require('express');
const router = express.Router();

// Import the exact function names from the controller
const { 
  login, 
  register, 
  updateProfile, 
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.put('/update/:id', updateProfile);
router.put('/change-password/:id', changePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;