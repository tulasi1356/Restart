const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
const locationRoutes = require('./routes/locationRoutes');
const workScopeRoutes = require('./routes/workScopeRoutes');
const logRoutes = require('./routes/logRoutes');
require('dotenv').config();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/locations', locationRoutes);
app.use('/api/workScopes', workScopeRoutes);
app.use('/api/logs', logRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});