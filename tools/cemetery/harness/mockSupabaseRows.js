// Harness stand-in: serves a fixed set of quote rows so the real
// CemeteryQuoteList can be rendered without a backend.
const QUOTES = [
  { id:'q1', contact_id:'F1', client_name:'Chen Family', version_label:'Royal Plateau (Upright)',
    sort_order:0, grand_total:50154.30, quote_number:null, is_template:false,
    created_at:'2026-03-01T00:00:00Z', updated_at:'2026-03-01T00:00:00Z' },
  { id:'q2', contact_id:'F1', client_name:'Chen Family', version_label:'Birch Estate Niche',
    sort_order:1, grand_total:33113.50, quote_number:null, is_template:false,
    created_at:'2026-03-02T00:00:00Z', updated_at:'2026-03-02T00:00:00Z' },
  { id:'q3', contact_id:'F2', client_name:'Zhang', version_label:'Royal Jade Phase 2 (Flat)',
    sort_order:0, grand_total:47345.00, quote_number:null, is_template:false,
    created_at:'2026-05-01T00:00:00Z', updated_at:'2026-05-01T00:00:00Z' },
]
const TEMPLATES = [
  { id:'t1', template_name:'Standard niche package', grand_total:12500, is_template:true,
    created_at:'2026-02-01T00:00:00Z', updated_at:'2026-02-01T00:00:00Z' },
]
const make = (rows) => {
  let data = rows
  const chain = {
    select: () => chain, order: () => chain, in: () => chain,
    insert: () => chain, update: () => chain, delete: () => chain,
    eq: (col, val) => {
      if (col === 'is_template') data = val ? TEMPLATES : QUOTES
      if (col === 'contact_id')  data = QUOTES.filter(q => q.contact_id === val)
      return chain
    },
    single: () => Promise.resolve({ data: data[0] ?? null, error: null }),
    then: (res, rej) => Promise.resolve({ data, error: null }).then(res, rej),
  }
  return chain
}
export const supabase = { schema: () => ({ from: () => make(QUOTES) }), from: () => make(QUOTES) }
