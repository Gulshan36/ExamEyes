import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './frontend',
  plugins: [react({ include: "**/*.{js,jsx}", jsxRuntime: 'automatic' })],
  esbuild: {
    loader: {
      '.js': 'jsx',
    },
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    jsx: 'react-jsx',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Your backend server
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''), // If your backend routes don't include /api
      },
    },
  },
  optimizeDeps: {
    include: ['react-toastify'],
  }
}) 