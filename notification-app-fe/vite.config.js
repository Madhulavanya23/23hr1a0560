import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'affordmed-logging-middleware': path.resolve(__dirname, '../logging-middleware/index.js')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
