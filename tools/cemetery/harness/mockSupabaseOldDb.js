// Harness stand-in for a database that has NOT had
// migration_cemetery_quote_versions.sql run: any select naming
// version_label / sort_order fails exactly as Postgres reports it.
const QUOTES = [
  { id:'q1', contact_id:null, client_name:'Chen Family', grand_total:50154.30,
    quote_number:null, is_template:false,
    created_at:'2026-03-01T00:00:00Z', updated_at:'2026-03-01T00:00:00Z' },
  { id:'q2', contact_id:null, client_name:'Zhang', grand_total:33113.50,
    quote_number:null, is_template:false,
    created_at:'2026-05-01T00:00:00Z', updated_at:'2026-05-01T00:00:00Z' },
]
const MISSING = { code:'42703', message:'column quotes.version_label does not exist' }

const make = () => {
  let cols = ''
  let rows = QUOTES
  const settle = (res, rej) => {
    const bad = /version_label|sort_order/.test(cols)
    return Promise.resolve(bad ? { data:null, error:MISSING } : { data:rows, error:null })
      .then(res, rej)
  }
  const chain = {
    select: (c = '') => { cols = String(c); return chain },
    eq: (col, val) => { if (col === 'is_template') rows = val ? [] : QUOTES; return chain },
    in: () => chain,
    order: (c = '') => { if (/sort_order/.test(String(c))) cols += ' sort_order'; return chain },
    insert: () => chain, update: () => chain, delete: () => chain,
    single: () => settle(r => r, e => e),
    then: settle,
  }
  return chain
}
export const supabase = { schema: () => ({ from: make }), from: make }
