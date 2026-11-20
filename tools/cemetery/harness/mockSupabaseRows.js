// Harness stand-in: serves a fixed set of quote rows so the real
// CemeteryQuoteList can be rendered without a backend.
//
// Deliberately representative rather than minimal: enough families to bring out
// the search field, families with 1 / 2 / 3 options, a long name that has to
// truncate, and an option with no typed label so the property-name fallback is
// exercised on screen and not only in the unit test.
const QUOTES = [
  { id:'q1', contact_id:'F1', client_name:'Chen Family', version_label:'Royal Plateau (Upright)',
    sort_order:0, grand_total:50154.30, quote_number:null, is_template:false,
    created_at:'2026-03-01T00:00:00Z', updated_at:'2026-11-18T00:00:00Z' },
  { id:'q2', contact_id:'F1', client_name:'Chen Family', version_label:'Birch Estate Niche',
    sort_order:1, grand_total:33113.50, quote_number:null, is_template:false,
    created_at:'2026-03-02T00:00:00Z', updated_at:'2026-11-18T00:00:00Z' },
  // no version_label — falls back to the property on its lines
  { id:'q3', contact_id:'F1', client_name:'Chen Family', version_label:null,
    sort_order:2, grand_total:9875.00, quote_number:null, is_template:false,
    created_at:'2026-03-03T00:00:00Z', updated_at:'2026-11-18T00:00:00Z' },

  { id:'q4', contact_id:'F2', client_name:'Zhang', version_label:'Royal Jade Phase 2 (Flat)',
    sort_order:0, grand_total:47345.00, quote_number:null, is_template:false,
    created_at:'2026-05-01T00:00:00Z', updated_at:'2026-11-12T00:00:00Z' },

  { id:'q5', contact_id:'F3', client_name:'Benny Kam', version_label:'Royal Jade Phase 2 (Estate)',
    sort_order:0, grand_total:220657.50, quote_number:null, is_template:false,
    created_at:'2026-09-14T00:00:00Z', updated_at:'2026-11-05T00:00:00Z' },
  { id:'q6', contact_id:'F3', client_name:'Benny Kam', version_label:'Royal Heights Phase 2 (Upright)',
    sort_order:1, grand_total:37899.75, quote_number:null, is_template:false,
    created_at:'2026-09-14T00:00:00Z', updated_at:'2026-11-05T00:00:00Z' },

  { id:'q7', contact_id:'F4', client_name:'Mr. & Mrs. Wong — pre-need enquiry (companion)',
    version_label:'Companion lawn crypt, double depth', sort_order:0, grand_total:118400.00,
    quote_number:null, is_template:false,
    created_at:'2026-10-02T00:00:00Z', updated_at:'2026-10-20T00:00:00Z' },

  { id:'q8', contact_id:'F5', client_name:'Lau', version_label:'Garden niche — single',
    sort_order:0, grand_total:14250.00, quote_number:null, is_template:false,
    created_at:'2026-06-11T00:00:00Z', updated_at:'2026-08-01T00:00:00Z' },
  { id:'q9', contact_id:'F5', client_name:'Lau', version_label:'Garden niche — companion',
    sort_order:1, grand_total:21980.00, quote_number:null, is_template:false,
    created_at:'2026-06-11T00:00:00Z', updated_at:'2026-08-01T00:00:00Z' },

  { id:'q10', contact_id:'F6', client_name:'Ng', version_label:'Birch Estate Niche',
    sort_order:0, grand_total:28640.00, quote_number:null, is_template:false,
    created_at:'2026-07-20T00:00:00Z', updated_at:'2026-07-21T00:00:00Z' },
]

// Only q3 needs one: it is the option with no typed label.
const ITEMS = [
  { quote_id:'q3', section:'Property', name:'Sunset Garden Niche (Single)', parent_item_id:null },
]

const TEMPLATES = [
  { id:'t1', template_name:'Standard niche package', grand_total:12500, is_template:true,
    created_at:'2026-02-01T00:00:00Z', updated_at:'2026-02-01T00:00:00Z' },
  { id:'t2', template_name:'Lawn crypt + upright marker', grand_total:56800, is_template:true,
    created_at:'2026-02-04T00:00:00Z', updated_at:'2026-02-04T00:00:00Z' },
]

const make = (table) => {
  let data = table === 'quote_items' ? ITEMS : QUOTES
  const chain = {
    select: () => chain, order: () => chain,
    in: (col, vals) => {
      if (col === 'quote_id') data = ITEMS.filter(i => vals.includes(i.quote_id))
      return chain
    },
    insert: () => chain, update: () => chain, delete: () => chain,
    is: () => chain,
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
export const supabase = { schema: () => ({ from: make }), from: make }
