const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./routes/authRoutes'); // ✅ correct file

app.use(cors());
app.use(express.json());

// ✅ Correct route prefix
app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});