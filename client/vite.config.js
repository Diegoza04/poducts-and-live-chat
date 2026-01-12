import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Archivo Vite configurado, con el proxy para el backend REST, WebSocket y GraphQL
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000', // REST proxy (Mantener existente)
      '/graphql': 'http://localhost:4000', // 🌟 Nuevo GraphQL proxy
      '/socket.io': {
        target: 'ws://localhost:3000', // WebSocket proxy para chat
        ws: true
      }
    }
  }
})
