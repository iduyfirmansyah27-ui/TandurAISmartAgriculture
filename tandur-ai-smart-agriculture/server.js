const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { handleCspReport, getCspViolations } = require('./server/middleware/cspReport');

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Load environment variables from .env file
require('dotenv').config();

// Admin credentials (in production, use environment variables or a proper auth system)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-password';

// Basic authentication for admin routes
const adminAuth = basicAuth({
  users: { [ADMIN_USERNAME]: ADMIN_PASSWORD },
  challenge: true,
  realm: 'Admin Area',
});

// Generate nonce for CSP
const generateNonce = () => {
  return require('crypto').randomBytes(16).toString('base64');
};

// Middleware to set security headers including CSP
app.use((req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const nonce = generateNonce();
  
  // Define CSP directives
  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      ...(isProduction ? [] : ["'unsafe-inline'", "'unsafe-eval'"]),
      ...(isProduction ? [`'nonce-${nonce}'`] : []),
    ],
    'style-src': [
      "'self'",
      ...(isProduction ? [] : ["'unsafe-inline'"]),
      ...(isProduction ? [`'nonce-${nonce}'`] : []),
    ],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'", 'data:', 'https:'],
    'connect-src': [
      "'self'",
      ...(isProduction ? [] : [
        'ws://localhost:3000',
        'ws://localhost:3001',
        'http://localhost:3000',
      ]),
      ...(isProduction ? [
        'https://your-api-domain.com',
      ] : []),
    ],
    'media-src': ["'self'", 'data:', 'blob:'],
    'object-src': ["'none'"],
    'frame-src': ["'self'"],
    'worker-src': ["'self'"],
    'form-action': ["'self'"],
  };

  // Convert CSP directives to header string
  const cspHeader = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  // Set security headers
  res.set({
    'Content-Security-Policy': cspHeader,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  });

  // Add nonce to response locals for use in templates if needed
  res.locals.nonce = nonce;
  
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSP Report Endpoint
app.post('/api/csp-report', handleCspReport);

// Admin route to view CSP violations (protected with basic auth)
app.get('/admin/csp-violations', adminAuth, (req, res) => {
  // Add security headers for admin routes
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  
  // Get and return the violations
  return getCspViolations(req, res);
});

// Serve static files from the dist directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Create HTTP server (redirect to HTTPS in production)
const httpServer = http.createServer((req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.writeHead(301, { 
      'Location': `https://${req.headers.host}${req.url}`,
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    });
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('HTTP server is running. Use HTTPS in production.\n');
});

// Start HTTP server
httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on http://localhost:${HTTP_PORT}`);
});

// Check if we're in development or production
if (process.env.NODE_ENV !== 'production') {
  // In development, use HTTP for API and frontend
  app.listen(HTTPS_PORT, () => {
    console.log(`Development server running on http://localhost:${HTTPS_PORT}`);
    console.log('\x1b[33m%s\x1b[0m', 'WARNING: Running in development mode without HTTPS!');
    console.log('Generate certificates and set NODE_ENV=production for HTTPS.\n');
  });
} else {
  // In production, use HTTPS
  try {
    const privateKey = fs.readFileSync('certs/localhost-key.pem', 'utf8');
    const certificate = fs.readFileSync('certs/localhost.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    
    const httpsServer = https.createServer(credentials, app);
    
    httpsServer.listen(HTTPS_PORT, () => {
      console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
      console.log('Admin dashboard: https://localhost:3443/admin/csp-violations');
      console.log('Username:', ADMIN_USERNAME);
      console.log('Password:', '********');
    });
  } catch (error) {
    console.error('Failed to start HTTPS server:', error.message);
    console.log('Falling back to HTTP. Run `node scripts/generate-cert.js` to generate certificates.');
    
    // Fallback to HTTP if HTTPS setup fails
    app.listen(HTTPS_PORT, () => {
      console.log(`HTTP server running on http://localhost:${HTTPS_PORT} (HTTPS failed to start)`);
    });
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);});
