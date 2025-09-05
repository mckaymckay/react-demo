import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,              // 打包后自动打开报告
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/report.html'
    })
  ],
  build: {
    // lib: {
    //   entry: './src/main.jsx',
    //   name: 'MyLib',
    //   formats: ['cjs'], // 只输出 CommonJS 格式
    //   fileName: 'my-lib'
    // },
    outDir: 'dist',
    assetsDir: 'assets', // 静态资源目录，默认就是 assets
    assetsInlineLimit: 4096,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 自定义静态资源文件名格式
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: '[name].js',
        assetFileNames: ({ name }) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/.test(name ?? '')) {
            return 'assets/img/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
