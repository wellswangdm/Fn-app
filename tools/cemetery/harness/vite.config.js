import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const ROOT     = '/home/user/Fn-app'
const HARNESS  = path.join(ROOT, 'tools/cemetery/harness')
const REAL     = path.join(ROOT, 'src/lib/supabase.js')
const MOCK     = path.join(HARNESS, 'mockSupabase.js')

// Resolve the import first, then swap it — the app imports supabase.js by
// several different relative specifiers, so matching on the specifier alone
// misses most of them.
const mockSupabase = {
  name: 'harness-mock-supabase',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (source.includes('mockSupabase')) return null
    const r = await this.resolve(source, importer, { ...options, skipSelf: true })
    return r && path.resolve(r.id.split('?')[0]) === REAL ? MOCK : null
  },
}

export default defineConfig({
  root: HARNESS,
  plugins: [mockSupabase, react()],
  server: { port: 5174, host: '127.0.0.1' },
})
