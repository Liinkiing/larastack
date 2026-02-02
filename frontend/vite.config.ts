import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:8000'

  return {
    plugins: [
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tanstackStart({
        spa: {
          enabled: true,
        },
      }),
      react(),
    ],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          secure: false,
          target: apiUrl,
        },
      },
    },
  }
})
