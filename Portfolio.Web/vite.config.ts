import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // Replace lowlight's `common` (38 bundled grammars, ~190 KB) with an empty
      // object so only the languages registered in src/lib/highlight.ts ship.
      // Anchored to the bare specifier so the shim's own deep import still
      // resolves to the real package. See src/lib/lowlight-shim.ts.
      {
        find: /^lowlight$/,
        replacement: path.resolve(__dirname, './src/lib/lowlight-shim.ts'),
      },
      // The shim's own import target: lowlight's real implementation, reached by
      // file path because its `exports` map forbids the deep specifier.
      {
        find: /^lowlight-core$/,
        replacement: path.resolve(__dirname, './node_modules/lowlight/lib/index.js'),
      },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        // Split the framework out of the app bundle: React and the router change
        // far less often than the site does, so they stay cached across deploys.
        manualChunks(id) {
          if (
            /node_modules[/\\](react|react-dom|react-router|react-router-dom|scheduler)[/\\]/.test(
              id,
            )
          ) {
            return 'react'
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5227',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
