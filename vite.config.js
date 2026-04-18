import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'MyStore',
        short_name: 'MyStore',
        description: 'Premium shopping experience — anytime, anywhere.',
        start_url: '/',
        display: 'standalone',          // ← fullscreen app mode (no browser chrome)
        display_override: ['standalone', 'fullscreen'],
        orientation: 'portrait',
        theme_color: '#4f46e5',
        background_color: '#1e1b4b',
        lang: 'en',
        categories: ['shopping', 'lifestyle'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache strategy: network-first for API, cache-first for assets
        runtimeCaching: [
          {
            // API calls — network first, fallback to cache
            urlPattern: ({ url }) => url.pathname.startsWith('/api') || url.pathname.startsWith('/products') || url.pathname.startsWith('/orders'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Images — cache first
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            // Fonts — stale while revalidate
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
        // Don't cache admin/backend routes
        navigateFallbackDenylist: [/^\/api/, /^\/admin/, /^\/users/],
      },
      devOptions: {
        enabled: true,  // enable SW in dev for testing
        type: 'module',
      },
    }),
  ],
})
