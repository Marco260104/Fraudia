import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Required for Docker
    port: 5173,
    strictPort: true,
    watch: {
      // Critical for hot reload to work reliably inside Docker on Windows
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      // Make HMR work when accessing from host browser
      host: 'localhost',
      port: 5173,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})
