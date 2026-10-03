import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      // Configuramos Vite en modo Multi-Page App (MPA)
      input: {
        // Entrada 1: La ventana del operador
        control: resolve(__dirname, 'src/renderer/control/index.html'),
        // Entrada 2: La ventana que verá el público
        projector: resolve(__dirname, 'src/renderer/projector/index.html'),
      },
    },
  },
});
