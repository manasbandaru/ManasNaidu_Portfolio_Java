import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Three.js into its own chunk
          'three': ['three'],
          // Separate Framer Motion into its own chunk
          'framer-motion': ['framer-motion'],
          // Separate React into its own chunk
          'react-vendor': ['react', 'react-dom'],
          // Separate UI components
          'ui-components': [
            './src/components/ui/index.ts',
            './src/components/sections/index.ts'
          ]
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`;
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Enable minification with terser options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Multiple passes for better compression
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false
      }
    },
    // Disable source maps in production for smaller bundle
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Enable asset inlining for small files
    assetsInlineLimit: 4096,
    // Target modern browsers for smaller bundle
    target: ['es2020', 'chrome80', 'firefox78', 'safari14', 'edge88'],
    // Enable CSS minification
    cssMinify: true,
    // Optimize for production deployment
    reportCompressedSize: false,
    // Increase chunk size warning limit for better performance
    chunkSizeWarningLimit: 1500
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['three', 'framer-motion'] // Load heavy libraries lazily
  },
  // Server configuration
  server: {
    port: 3000,
    host: true
  },
  // Preview server configuration
  preview: {
    port: 4173,
    host: true
  },
  // Asset optimization
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf'],
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0')
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  }
})
