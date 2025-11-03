import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Generate nonce for CSP
const generateNonce = () => {
  if (typeof crypto === 'undefined') {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  // For browser environment
  if (crypto && 'getRandomValues' in crypto) {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  // Fallback for Node.js environment
  return require('crypto').randomBytes(16).toString('hex');
};

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const nonce = generateNonce();
  
  // Define CSP directives with enhanced security
  const cspDirectives = {
    // Default fallback for all unset directives
    'default-src': ["'self'"],
    
    // Script sources - strict by default
    'script-src': [
      "'self'",
      // Required for React development
      "'unsafe-inline'",
      // Required for Webpack's HMR in development
      !isProduction && "'unsafe-eval'",
      // Nonce for inline scripts (if needed)
      `'nonce-${nonce}'`,
      // Add any external scripts you need here
      // 'https://apis.google.com',
    ].filter(Boolean) as string[],
    
    // Style sources
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for MUI and other CSS-in-JS libraries
      // Add any external stylesheets here
      // 'https://fonts.googleapis.com',
    ],
    
    // Image sources
    'img-src': [
      "'self'",
      'data:', // For data: URLs
      'blob:', // For blob: URLs
      'https:', // For external images
      // Add any specific image domains here
    ],
    
    // Font sources
    'font-src': [
      "'self'",
      'data:', // For data: URLs
      'https:', // For external fonts
      // 'https://fonts.gstatic.com',
    ],
    
    // Connect sources (XHR, WebSockets, etc.)
    'connect-src': [
      "'self'",
      // Development server
      !isProduction && 'ws://localhost:3000',
      // API endpoints
      'http://localhost:3000',
      // 'https://your-api-domain.com',
      // WebSocket for HMR
      !isProduction && 'ws://localhost:3001',
    ].filter(Boolean) as string[],
    
    // Media sources (audio, video)
    'media-src': ["'self'", 'data:', 'blob:'],
    
    // Object sources (for Flash, etc.)
    'object-src': ["'none'"], // Recommended security practice
    
    // Frame sources (for iframes)
    'frame-src': ["'self'"],
    
    // Child sources (for workers, etc.)
    'child-src': ["'self'"],
    
    // Worker sources
    'worker-src': ["'self'", 'blob:'],
    
    // Form actions
    'form-action': ["'self'"],
    
    // Base URI
    'base-uri': ["'self'"],
    
    // Frame ancestors (prevent clickjacking)
    'frame-ancestors': ["'self'"],
    
    // Plugin types
    'plugin-types': [],
    
    // Sandbox (if using iframes)
    // 'sandbox': ['allow-forms', 'allow-scripts', 'allow-same-origin'],
    
    // Report violations to this URL (optional)
    // 'report-uri': '/csp-violation-report-endpoint',
  };

  // Convert directives to CSP header string
  const cspHeader = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  return {
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      headers: {
        // Security headers
        'Content-Security-Policy': cspHeader,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Permitted-Cross-Domain-Policies': 'none',
      },
      // Enable CORS for development
      cors: true,
      // Proxy API requests in development
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          // Rewrite path if needed
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      // Ensure build assets include the nonce
      rollupOptions: {
        output: {
          entryFileNames: `[name].${nonce}.js`,
          chunkFileNames: `[name].${nonce}.[hash].js`,
          assetFileNames: `[name].${nonce}.[hash].[ext]`,
        },
      },
      // Minify for production
      minify: isProduction ? 'esbuild' : false,
      // Generate source maps for better debugging
      sourcemap: !isProduction,
    },
  };
});
