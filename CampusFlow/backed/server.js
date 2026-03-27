const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const noticesRoutes = require('./routes/noticesRoutes');


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});