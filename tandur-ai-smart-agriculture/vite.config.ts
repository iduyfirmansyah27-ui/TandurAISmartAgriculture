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
  // Cek apakah mode production
  const isProduction = mode === 'production';
  
  // Generate nonce hanya untuk production
  const nonce = isProduction ? generateNonce() : '';
  
  // Atur CSP directives
  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      // Di development, izinkan semua untuk memudahkan pengembangan
      ...(isProduction ? [] : ["'unsafe-inline'", "'unsafe-eval'"])
      // Add any external scripts you need here
      // 'https://apis.google.com',
    ],
    
    'style-src': [
      "'self'",
      ...(isProduction ? [] : ["'unsafe-inline'"])
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
    
    // Report violations to our reporting endpoint
    'report-uri': isProduction ? ['/api/csp-report'] : [],
    'report-to': isProduction ? ['csp-endpoint'] : [],
    
    // Add reporting endpoint for browsers that support report-to
    ...(isProduction ? {
      'report-to': [{
        key: 'csp-endpoint',
        max_age: 10886400, // 30 days in seconds
        endpoints: [{
          url: '/api/csp-report',
        }],
        include_subdomains: true,
      }],
    } : {}),
  };

  // Convert directives to CSP header string
  const cspHeader = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  return {
    plugins: [
      react({
        // Ensure Fast Refresh works with CSP
        jsxRuntime: 'automatic',
        babel: {
          plugins: [
            // Add any required Babel plugins here
          ],
        },
      }),
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
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), fullscreen=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Permitted-Cross-Domain-Policies': 'none',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'X-DNS-Prefetch-Control': 'on',
        'Expect-CT': 'enforce, max-age=30',
        'Feature-Policy': "geolocation 'none'; microphone 'none'; camera 'none'",
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
      // Production optimizations
      sourcemap: isProduction ? 'hidden' : true,
      minify: isProduction ? 'terser' : 'esbuild',
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      } : undefined,
      rollupOptions: {
        output: {
          entryFileNames: `[name].${isProduction ? nonce : '[name]'}.js`,
          chunkFileNames: `[name].${isProduction ? nonce + '.' : ''}[hash].js`,
          assetFileNames: `[name].${isProduction ? nonce + '.' : ''}[hash].[ext]`,
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['react-router-dom', 'axios'],
          },
        },
      },
      chunkSizeWarningLimit: 1000, // in kB
    },
  };
});
