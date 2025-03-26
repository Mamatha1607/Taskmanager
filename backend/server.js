const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const app = express();
const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Task Manager Backend is running!');
});

app.use('/api', tasksRoutes);
app.use('/api/auth', usersRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});