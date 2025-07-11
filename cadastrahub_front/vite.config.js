import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Qualquer requisição do frontend que comece com '/api'
      // será redirecionada para o seu backend em http://localhost:3001
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true, // Necessário para o proxy funcionar
      },
    },
  },
})