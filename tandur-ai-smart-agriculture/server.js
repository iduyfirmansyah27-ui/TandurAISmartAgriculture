const express = require('express');
const path = require('path');
const { handleCspReport, getCspViolations } = require('./server/middleware/cspReport');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSP Report Endpoint
app.post('/api/csp-report', handleCspReport);

// Admin route to view CSP violations (protect this in production!)
app.get('/admin/csp-violations', getCspViolations);

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
