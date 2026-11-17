// Grouping quotes into families (the unit a comparison works on).
// Run: node tools/cemetery/families_test.mjs
import { groupIntoFamilies } from '../../src/lib/cemeteryFamilies.js'

const row = (o) => ({
  id: o.id, contact_id: o.contact ?? null, client_name: o.client ?? '',
  version_label: o.label ?? '', sort_order: o.sort ?? 0,
  grand_total: o.total ?? 0,
  created_at: o.created ?? '2026-01-01T00:00:00Z',
  updated_at: o.updated ?? '2026-01-01T00:00:00Z',
})

const rows = [
  row({ id: 'b2', contact: 'F1', client: 'Chen', label: 'Upright', sort: 1, total: 200, updated: '2026-03-02T00:00:00Z' }),
  row({ id: 'b1', contact: 'F1', client: 'Chen', label: 'Flat',    sort: 0, total: 100, updated: '2026-03-01T00:00:00Z' }),
  row({ id: 'c1', contact: 'F2', client: 'Zhang',                  sort: 0, total: 300, updated: '2026-05-01T00:00:00Z' }),
  row({ id: 'd1', contact: null, client: 'Legacy',                 sort: 0, total: 400, updated: '2026-04-01T00:00:00Z' }),
]

const fams = groupIntoFamilies(rows)
const fail = []
const eq = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) fail.push(`${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) }

eq('family count', fams.length, 3)
eq('newest family first', fams.map(f => f.name), ['Zhang', 'Legacy', 'Chen'])

const chen = fams.find(f => f.name === 'Chen')
eq('Chen has both options',     chen.options.length, 2)
eq('options in sort_order',     chen.options.map(o => o.version_label), ['Flat', 'Upright'])
eq('family total = first option', chen.total, 100)
eq('family updated = newest',   chen.updatedAt, '2026-03-02T00:00:00Z')

const legacy = fams.find(f => f.name === 'Legacy')
eq('a quote with no family stands alone', legacy.options.length, 1)
eq('and keys on its own id', legacy.key, 'd1')

// a family of one must still be a family, so it can gain options later
eq('Zhang is a family of one', fams.find(f => f.name === 'Zhang').options.length, 1)

console.log(`families: ${fams.length} from ${rows.length} quotes`)
for (const f of fams) console.log(`  ${(f.name || '(unnamed)').padEnd(8)} ${f.options.length} option(s)`)
console.log(fail.length ? `\nFAIL:\n  ${fail.join('\n  ')}` : '\nPASS')
process.exit(fail.length ? 1 : 0)
