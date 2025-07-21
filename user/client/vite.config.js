import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
   preview: {
    port: 5173,
    host: true,
    allowedHosts: ['www.alumnlink.com', 'alumnlink.com'], // ✅ Add this line
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
