#!/usr/bin/env node

/**
 * Production fixes script
 * Applies post-build optimizations for deployment issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');

console.log('🔧 Applying production fixes...');

// Fix 1: Add viewport meta tag optimization
function optimizeIndexHtml() {
  const indexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.warn('⚠️  index.html not found, skipping HTML optimizations');
    return;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Add performance optimizations
  const optimizations = `
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <meta name="theme-color" content="#1f2937">
    <meta name="color-scheme" content="dark">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://ui-avatars.com">
    <style>
      /* Critical CSS for preventing layout shifts */
      body { margin: 0; background-color: #1f2937; color: white; }
      .loading-fallback { 
        position: fixed; 
        inset: 0; 
        background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        z-index: 9999;
      }
      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #374151;
        border-top: 3px solid #8b5cf6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  // Insert optimizations before closing head tag
  html = html.replace('</head>', `${optimizations}</head>`);
  
  // Add loading fallback
  const loadingFallback = `
    <div class="loading-fallback" id="loading-fallback">
      <div class="loading-spinner"></div>
    </div>
    <script>
      // Hide loading fallback when React app loads
      window.addEventListener('load', function() {
        setTimeout(function() {
          const fallback = document.getElementById('loading-fallback');
          if (fallback) {
            fallback.style.opacity = '0';
            fallback.style.transition = 'opacity 0.3s ease';
            setTimeout(() => fallback.remove(), 300);
          }
        }, 100);
      });
    </script>
  `;
  
  html = html.replace('<div id="root"></div>', `<div id="root"></div>${loadingFallback}`);
  
  fs.writeFileSync(indexPath, html);
  console.log('✅ HTML optimizations applied');
}

// Fix 2: Add service worker for caching
function addServiceWorker() {
  const swContent = `
// Simple service worker for caching static assets
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/assets/js/',
  '/assets/css/',
  '/assets/images/'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});
`;

  const swPath = path.join(distDir, 'sw.js');
  fs.writeFileSync(swPath, swContent);
  console.log('✅ Service worker created');
}

// Fix 3: Create _redirects file for SPA routing (Netlify)
function createRedirects() {
  const redirectsContent = `
# SPA fallback
/*    /index.html   200

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;
`;

  const redirectsPath = path.join(distDir, '_redirects');
  fs.writeFileSync(redirectsPath, redirectsContent.trim());
  console.log('✅ Redirects file created');
}

// Fix 4: Optimize CSS for production
function optimizeCSS() {
  const assetsDir = path.join(distDir, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.warn('⚠️  Assets directory not found, skipping CSS optimizations');
    return;
  }
  
  const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'));
  
  cssFiles.forEach(file => {
    const filePath = path.join(assetsDir, file);
    let css = fs.readFileSync(filePath, 'utf8');
    
    // Add critical performance CSS
    const performanceCSS = `
/* Production performance optimizations */
*,*::before,*::after{box-sizing:border-box}
body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
img{max-width:100%;height:auto}
.gpu-accelerated{transform:translateZ(0);will-change:transform}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;
    
    css = performanceCSS + css;
    fs.writeFileSync(filePath, css);
  });
  
  console.log(`✅ Optimized ${cssFiles.length} CSS files`);
}

// Run all fixes
try {
  optimizeIndexHtml();
  addServiceWorker();
  createRedirects();
  optimizeCSS();
  console.log('🎉 All production fixes applied successfully!');
} catch (error) {
  console.error('❌ Error applying production fixes:', error);
  process.exit(1);
}