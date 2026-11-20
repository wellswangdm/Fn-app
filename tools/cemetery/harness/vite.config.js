import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const ROOT     = '/home/user/Fn-app'
const HARNESS  = path.join(ROOT, 'tools/cemetery/harness')
const REAL     = path.join(ROOT, 'src/lib/supabase.js')
const MOCK     = path.join(HARNESS, 'mockSupabase.js')      // always errors (schema card)
const MOCK_ROWS= path.join(HARNESS, 'mockSupabaseRows.js')  // serves cemetery quote rows
const MOCK_FN  = path.join(HARNESS, 'mockSupabaseFuneral.js') // serves funeral quote data
const MOCK_OLD = path.join(HARNESS, 'mockSupabaseOldDb.js')   // pre-migration database
const MOCK_ED  = path.join(HARNESS, 'mockSupabaseEditor.js')  // quote editor data
const MOCK_PT  = path.join(HARNESS, 'mockSupabasePortal.js')  // full portal, with writes
const MOCK_FL  = path.join(HARNESS, 'mockSupabaseFuneralList.js') // funeral portal's quote list
const MOCK_FE  = path.join(HARNESS, 'mockSupabaseFuneralEditor.js') // funeral portal's quote builder

// Resolve the import first, then swap it — the app imports supabase.js by
// several different relative specifiers, so matching on the specifier alone
// misses most of them.
const mockSupabase = {
  name: 'harness-mock-supabase',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (source.includes('mockSupabase')) return null
    this._wantRows = this._wantRows || new Set()
    const r = await this.resolve(source, importer, { ...options, skipSelf: true })
    if (!r || path.resolve(r.id.split('?')[0]) !== REAL) return null
    if (process.env.HARNESS_FNEDIT === '1') return MOCK_FE
    if (process.env.HARNESS_FNLIST === '1') return MOCK_FL
    if (process.env.HARNESS_PORTAL === '1') return MOCK_PT
    if (process.env.HARNESS_EDITOR === '1') return MOCK_ED
    if (process.env.HARNESS_OLDDB  === '1') return MOCK_OLD
    if (process.env.HARNESS_FUNERAL === '1') return MOCK_FN
    return process.env.HARNESS_ROWS === '1' ? MOCK_ROWS : MOCK
  },
}

export default defineConfig({
  root: HARNESS,
  plugins: [mockSupabase, react()],
  server: { port: 5174, host: '127.0.0.1' },
})
