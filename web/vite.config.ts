import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    // El preview de la consola entra por el dominio público, no por localhost.
    // Vite 5 solo lo acepta declarado acá (la variable de entorno que usa la
    // consola para esto es de Vite 6, y en 5.x es inerte).
    allowedHosts: ['.cornelio.app'],
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: false,
        // El preview de la consola se sirve bajo /api/hotreload/…: ese prefijo
        // lo atiende Vite, no las Functions. Sin esto el preview se proxea a
        // sí mismo y responde 500.
        bypass: (req) =>
          req.url?.startsWith('/api/hotreload/') ? req.url : undefined,
      },
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
});
