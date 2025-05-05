const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const config = r
dotenv.config();

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = config.port;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 