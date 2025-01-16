import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://yourdomain.com',
  integrations: [sitemap()],
  adapter: cloudflare({
    routes: {
      extend: {
        include: [
          { pattern: '/static' },        // Route prerendered page to SSR function
          { pattern: '/blog/*' },        // Dynamic blog routes
          { pattern: '/schedule' }       // Schedule page
        ],
        exclude: [
          { pattern: '/pagefind/*' },    // Static search functionality
          { pattern: '/assets/*' },      // Static assets
          { pattern: '/images/*' }       // Static images
        ]
      }
    },
    imageService: 'cloudflare',          // Use Cloudflare's image optimization
    mode: 'directory',                   // Output as directory for easier deployment
    functionPerRoute: true               // Create separate function per route for better caching
  })
});
