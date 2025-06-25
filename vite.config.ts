import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// === FLAVORBRIDGE VITE CONFIGURATION ===
// Professional build setup for Electron + React app

export default defineConfig({
  root: 'src/renderer',
  plugins: [
    react({
      // JSX runtime configuration
      jsxRuntime: 'automatic',
    }),
  ],

  // === DEVELOPMENT SERVER ===
  server: {
    port: 5001,
    open: false, // Don't auto-open browser (Electron will handle this)
    host: 'localhost',
    strictPort: true,
    
    // CORS configuration for development
    cors: true,
    
    // HMR configuration
    hmr: {
      port: 5001,
    },
  },

  // === BUILD CONFIGURATION ===
  build: {
    // Output directory
    outDir: '../../dist/renderer',
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Target modern browsers (Electron uses Chromium)
    target: 'esnext',
    
    // Minification
    minify: 'esbuild',
    
    // Rollup options
    rollupOptions: {
      output: {
        // Asset naming for caching
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const parts = name.split('.');
          let extType = parts.length > 1 ? parts[parts.length - 1] : '';
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        // Manual chunking for optimization
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['zustand', 'fuse.js'],
        },
      },
    },
    
    // Asset handling
    assetsInlineLimit: 4096, // 4kb
    
    // CSS configuration
    cssCodeSplit: true,
    
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    
    // Build performance
    reportCompressedSize: false,
  },

  // === PATH RESOLUTION ===
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@components': resolve(__dirname, 'src/renderer/components'),
      '@pages': resolve(__dirname, 'src/renderer/pages'),
      '@stores': resolve(__dirname, 'src/renderer/stores'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/renderer/utils'),
      '@styles': resolve(__dirname, 'src/renderer/styles'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },

  // === ENVIRONMENT VARIABLES ===
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },

  // === OPTIMIZATION ===
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      'fuse.js',
      'lucide-react',
    ],
  },

  // === PREVIEW SERVER (for testing builds) ===
  preview: {
    port: 4173,
    strictPort: true,
    host: 'localhost',
  },
});

// === TYPE DECLARATIONS ===
declare global {
  const __APP_VERSION__: string;
  const __BUILD_TIME__: string;
  const __DEV__: boolean;
}