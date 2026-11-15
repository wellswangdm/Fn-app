import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '../../..')
export default defineConfig({
  root: path.resolve(root, 'tools/cemetery/harness'),
  plugins: [react()],
  resolve: { alias: { '/src': path.resolve(root, 'src') } },
  server: { port: 5174, host: '127.0.0.1' },
})
