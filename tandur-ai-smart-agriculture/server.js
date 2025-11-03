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

// Middleware untuk development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    // Izinkan semua di development untuk memudahkan pengembangan
    res.set({
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws: http: https:;",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
    });
    next();
  });
} else {
  // Middleware untuk production
  const generateNonce = () => {
    return require('crypto').randomBytes(16).toString('base64');
  };

  app.use((req, res, next) => {
    const nonce = generateNonce();
    
    // Set CSP header untuk production
    res.set({
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}';
        style-src 'self' 'nonce-${nonce}';
        img-src 'self' data: https:;
        font-src 'self' data: https:;
        connect-src 'self' https://your-api-domain.com;
        media-src 'self' data: blob:;
        object-src 'none';
        frame-src 'self';
        worker-src 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    });

    res.locals.nonce = nonce;
    next();
  });
}

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
    console.log('For production with HTTPS, set NODE_ENV=production and ensure certificates are available.\n');
  });
} else {
  // In production, try to use HTTPS if certificates exist, otherwise fall back to HTTP
  const keyPath = 'certs/localhost-key.pem';
  const certPath = 'certs/localhost.pem';
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    try {
      const privateKey = fs.readFileSync(keyPath, 'utf8');
      const certificate = fs.readFileSync(certPath, 'utf8');
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
      startHttpServer();
    }
  } else {
    console.log('HTTPS certificates not found. Starting HTTP server...');
    startHttpServer();
  }
}

function startHttpServer() {
  // Create HTTP server for production without HTTPS
  const httpServer = http.createServer(app);
  
  httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP server running on http://localhost:${HTTP_PORT}`);
    console.log('Admin dashboard: http://localhost:3000/admin/csp-violations');
    console.log('Username:', ADMIN_USERNAME);
    console.log('Password:', '********');
    console.log('\x1b[33m%s\x1b[0m', 'WARNING: Running in production without HTTPS!');
    console.log('For production use, please set up HTTPS with valid certificates.');
  });
}
    
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);});
