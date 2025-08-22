import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5173,
    host: true,
    allowedHosts: ['www.alumnlink.com', 'alumnlink.com'], // ✅ Add this line
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate large dependencies into their own chunks
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          utils: ['date-fns', 'axios', 'lodash.debounce'],
          animations: ['framer-motion'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
    // Minimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    // Pre-bundle frequently used dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'date-fns',
      'framer-motion',
    ],
    // Exclude heavy dependencies from pre-bundling
    exclude: ['particles.js'],
  },
  server: {
    // Development server optimizations
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
})
