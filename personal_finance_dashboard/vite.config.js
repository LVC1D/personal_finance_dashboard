import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7935',
        changeOrigin: true,
        ws: true,
        secure: false
      },
      '/income': {
        target: 'http://localhost:7935',
        changeOrigin: true,
        secure: false
      },
      '/expenses': {
        target: 'http://localhost:7935',
        changeOrigin: true,
        secure: false
      },
      '/investments': {
        target: 'http://localhost:7935',
        changeOrigin: true,
        ws: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
