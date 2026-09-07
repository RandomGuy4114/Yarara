import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pyodide's loader dynamically imports its own .asm.mjs/.wasm at runtime
  // based on indexURL; letting esbuild pre-bundle it breaks that.
  optimizeDeps: {
    exclude: ["pyodide"],
  },
})
