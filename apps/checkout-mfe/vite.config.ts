import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'checkoutMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './CartPage': './src/pages/CartPage.tsx',
        './PixCheckoutFlow': './src/components/PixCheckout/PixCheckout.tsx'
      },
      shared: ['react', 'react-dom', 'zustand', '@apollo/client']
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      clean: true,
      exclude: ['node_modules/', 'src/api/types/**', 'src/main.tsx', 'src/vite-env.d.ts']
    }
  },
  optimizeDeps: {
    include: ['@apollo/client/core', '@apollo/client/cache']
  }
});
