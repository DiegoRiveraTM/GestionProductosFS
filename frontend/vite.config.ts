import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // 🔥 Forzar el puerto 5173
    strictPort: true // 🚨 Si el puerto está ocupado, lanza un error en vez de cambiarlo
  }
});
