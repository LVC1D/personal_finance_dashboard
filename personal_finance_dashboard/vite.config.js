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
        secure: false
      },
      '/income': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/expenses': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/investments': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        ws: true,
        secure: false
      },
      '/users': {
        target: 'https://personal-finance-dashboard.onrender.com',
        changeOrigin: true,
        secure: false
      },
    }
  },
  build: {
    outDir: 'dist'
  }
})
