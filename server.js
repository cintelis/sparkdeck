// TO-DO: Complete Express server configuration
// This is a basic Express server setup. Complete the following:
// 1. Add proper error handling
// 2. Implement API endpoints for ideas
// 3. Add database connection if needed
// 4. Set up WebSocket for real-time updates

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(compression());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints to implement:
// GET /api/ideas - returns all startup ideas
// POST /api/ideas - submits a new idea
// GET /api/ideas/:id - returns specific idea
// PUT /api/ideas/:id - updates an idea
// DELETE /api/ideas/:id - deletes an idea
// GET /api/stats - returns platform statistics

app.get('/api/ideas', (req, res) => {
  // TO-DO: Replace with database query
  const ideas = require('./public/assets/sample-ideas.json');
  res.json(ideas);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'SparkDeck'
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware to implement
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SparkDeck running on port ${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'public')}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
