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
    </style>
  `;

  // Insert optimizations before closing head tag
  html = html.replace('</head>', `${optimizations}</head>`);

  // Skip loading fallback - React app handles its own loading

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

// Fix 3: Skip redirects (using netlify.toml instead)
function createRedirects() {
  console.log('✅ Using netlify.toml for redirects');
}

// Fix 4: Skip CSS optimization to avoid @import issues
function optimizeCSS() {
  console.log('✅ Skipping CSS optimization to prevent @import issues');
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