import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Allow any host (local, LAN, ngrok tunnels) for phone/pitch previews
    allowedHosts: true,
    hmr: { clientPort: 443 },
  },
})
