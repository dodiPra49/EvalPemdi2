const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for templates and evidence uploads
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EVAL-PEMDI Express API',
    regulation: 'Permenpan RB No. 8 Tahun 2026',
    timestamp: new Date().toISOString()
  });
});

// Base API route
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Welcome to EVAL-PEMDI API Service',
    version: '1.0.0',
    indicators_total: 20,
    aspects_total: 7
  });
});

// Import API routes
const apiRouter = require('./routes/api');
app.use('/api/v1', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`[EVAL-PEMDI] Express API server running on port ${PORT}`);
});
