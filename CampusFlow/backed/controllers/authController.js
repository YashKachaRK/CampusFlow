const pool = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// 1. LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// 2. REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || 'student']
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// 3. UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const updatedUser = await pool.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role`,
      [name, email, id]
    );
    if (updatedUser.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: updatedUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// 4. CHANGE PASSWORD (Logged In User)
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const userCheck = await pool.query('SELECT password FROM users WHERE id = $1', [id]);
    
    if (userCheck.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, userCheck.rows[0].password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// 5. FORGOT PASSWORD (Send Email)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    await pool.query('UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3', [resetToken, expiry, email]);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: 'kachayash13@gmail.com', pass: 'xkuycjfnvmbpanoy' }
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; // Changed to typical Vite port 5173, adjust if your React app is on 3000
    
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset - CampusFlow',
      html: `<p>You requested a password reset.</p><p>Click this link to set a new password: <br><a href="${resetUrl}">${resetUrl}</a></p>`
    });

    res.json({ message: 'Reset email sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during forgot password' });
  }
};

// 6. RESET PASSWORD (From Email Link)
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const userResult = await pool.query('SELECT id, reset_token_expiry FROM users WHERE reset_token = $1', [token]);
    
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'Invalid token' });
    
    const user = userResult.rows[0];
    if (Date.now() > user.reset_token_expiry) return res.status(400).json({ error: 'Token has expired' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2', [hashedPassword, user.id]);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error during reset password' });
  }
};

module.exports = { login, register, updateProfile, changePassword, forgotPassword, resetPassword };