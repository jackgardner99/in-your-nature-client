import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // The portal is served from getinyournature.com/portal/, alongside the main site.
    base: env.VITE_BASE ?? '/portal/',
    plugins: [react()],
    server: {
      // In dev, forward /api to the backend so cookies stay same-origin.
      proxy: env.API_PROXY_TARGET ? { '/api': { target: env.API_PROXY_TARGET, changeOrigin: true } } : undefined,
    },
  }
})
