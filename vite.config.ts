import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({  
      registerType: 'autoUpdate',
      workbox: { 
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'] 
      },
      manifest: {
        name: "Glottis",
        short_name: "Glottis",
        description: "Language learning platform",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1976d2",
        orientation: "portrait-or-landscape",
        icons: [
          {
            src: "/glottis.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})