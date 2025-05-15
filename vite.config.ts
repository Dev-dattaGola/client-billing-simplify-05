
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // Improve module compatibility
      jsxImportSource: 'react'
      // Removed the babel property as it's not supported in the Options type
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'] // Deduplicate packages
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'sonner', '@radix-ui/react-toast'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    sourcemap: true,
    target: 'es2020',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@radix-ui/react-toast', 'sonner'],
          'radix-ui': [
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-slot'
          ]
        }
      }
    }
  }
}));
