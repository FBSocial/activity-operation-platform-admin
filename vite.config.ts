import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'
import Info from 'unplugin-info/vite'
import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Info(), react(), legacy()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/activity-operation-platform-admin',
  server: {
    open: true,
    // port: 5800,
    // proxy: {
    //   // '/api': {
    //   //   target: 'http://10.100.11.62:8001',
    //   //   // target: 'http://192.168.50.56:8001',
    //   //   changeOrigin: true,
    //   //   bypass(req, res, options) {
    //   //     const proxyURL = ((options?.target as string) ?? '') + options?.rewrite?.(req.url ?? '')
    //   //     res.setHeader('x-req-proxyURL', proxyURL) //将真实请求地址设置到响应头中
    //   //   },
    //   //   rewrite: path => path.replace(/^\/api/, ''),
    //   // },
    // },
  },
  envPrefix: ['VITE_'],
})
