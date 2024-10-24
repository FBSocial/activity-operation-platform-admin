import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import Info from 'unplugin-info/vite'
import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Info(),
    react(),
    legacy(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/activity-operation-platform-admin',
  server: {
    open: true,
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd', '@ant-design/icons', '@ant-design/pro-components'],
        },
      },
    },
  },
  envPrefix: ['VITE_'],
})
