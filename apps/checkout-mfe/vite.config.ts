import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'], // Gera no terminal e em HTML
      clean: true,
      exclude: [
        'node_modules/',
        'src/api/types/**', // Geralmente não testamos arquivos de apenas tipos
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
  optimizeDeps: {
    include: ['@apollo/client/core', '@apollo/client/cache'],
  },
})
