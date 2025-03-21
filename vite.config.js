import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./frontend/src', import.meta.url)),
      '@schemas': fileURLToPath(new URL('./backend/schemas', import.meta.url))
    }
  },
  build: {
    outDir: './backend/public'
  }
})
