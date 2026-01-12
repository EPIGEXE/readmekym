import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 관련 라이브러리
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 애니메이션 라이브러리
          'vendor-animation': ['framer-motion'],
          // 아이콘 라이브러리
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
