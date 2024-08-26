import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        ws: true,
        secure: true
      },
      '/income': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/expenses': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/investments': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        ws: true,
        secure: true
      },
      '/users': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        secure: true
      },
    }
  },
  build: {
    outDir: 'dist'
  }
})
