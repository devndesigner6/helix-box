import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        checkout: path.resolve(__dirname, 'checkout.html'),
        about: path.resolve(__dirname, 'about.html'),
        catalog: path.resolve(__dirname, 'catalog.html'),
        roadmap: path.resolve(__dirname, 'roadmap.html'),
        glossary: path.resolve(__dirname, 'glossary.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

