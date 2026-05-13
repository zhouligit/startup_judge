import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 与 import.meta.env 并行读取，避免个别环境下 .env.production 未参与静态替换
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = (env.VITE_API_BASE_URL || '').replace(/\/$/, '')

  return {
    plugins: [vue()],
    define: {
      __API_BASE_URL__: JSON.stringify(apiBase),
    },
    server: {
      port: 3000,
      proxy: {
        '^/api/': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
      },
    },
  }
})
