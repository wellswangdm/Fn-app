// Harness stand-in for the quote editor: one family with two options plus a
// template. The catalogue is empty on purpose — this exercises the option
// switcher, the Add-option menu and the Template menu, not item picking.
const QUOTES = [
  { id:'q1', park_id:'6800', contact_id:'F1', client_name:'Alice Zhang',
    version_label:'Royal Jade Phase 2 (Upright)', sort_order:0, grand_total:85355.13,
    is_template:false, template_name:null, status:'draft',
    discount_percent:10, manual_discount_amount:0, manual_discount_name:'Miscellaneous Waived',
    gst_rate:0.05, pst_rate:0.07, payment_months:60, interest_rate:0,
    is_monthly_payment_enabled:false, deposit_amount:0, terms:null,
    created_at:'2026-03-01T00:00:00Z', updated_at:'2026-03-01T00:00:00Z' },
  { id:'q2', park_id:'6800', contact_id:'F1', client_name:'Alice Zhang',
    version_label:'Option 2', sort_order:1, grand_total:60000,
    is_template:false, template_name:null, status:'draft',
    discount_percent:0, manual_discount_amount:0, manual_discount_name:'Miscellaneous Waived',
    gst_rate:0.05, pst_rate:0.07, payment_months:60, interest_rate:0,
    is_monthly_payment_enabled:false, deposit_amount:0, terms:null,
    created_at:'2026-03-02T00:00:00Z', updated_at:'2026-03-02T00:00:00Z' },
  { id:'t1', park_id:'6800', contact_id:null, client_name:'',
    version_label:null, sort_order:0, grand_total:12500,
    is_template:true, template_name:'Standard niche package', status:'draft',
    discount_percent:0, manual_discount_amount:0, manual_discount_name:'Miscellaneous Waived',
    gst_rate:0.05, pst_rate:0.07, payment_months:60, interest_rate:0,
    is_monthly_payment_enabled:false, deposit_amount:0, terms:null,
    created_at:'2026-02-01T00:00:00Z', updated_at:'2026-02-01T00:00:00Z' },
]
const ITEMS = {
  q1: [{ id:'l1', quote_id:'q1', name:'Royal Jade Phase 2 (Upright)', unit_price:49995, quantity:2,
         line_total:99990, section:'Property', is_gst:true, is_pst:false, is_discountable:true,
         is_waived:false, ecf_included:true, source_kind:'property', sort_order:0 }],
  q2: [{ id:'l2', quote_id:'q2', name:'Processing Fee', unit_price:50, quantity:1,
         line_total:50, section:'Merchandise and Services', is_gst:true, is_pst:false,
         is_discountable:false, is_waived:false, ecf_included:false, source_kind:'service', sort_order:0 }],
  t1: [{ id:'l3', quote_id:'t1', name:'Birch Estate Brick Niches (Single)', unit_price:2595, quantity:1,
         line_total:2595, section:'Property', is_gst:true, is_pst:false, is_discountable:true,
         is_waived:false, ecf_included:true, source_kind:'property', sort_order:0 }],
}
const make = (table) => {
  const f = {}
  const rows = () => {
    if (table === 'quotes') {
      return QUOTES.filter(q =>
        (f.is_template === undefined || q.is_template === f.is_template) &&
        (f.park_id    === undefined || q.park_id    === f.park_id) &&
        (f.contact_id === undefined || q.contact_id === f.contact_id) &&
        (f.id         === undefined || q.id         === f.id))
    }
    if (table === 'quote_items') return ITEMS[f.quote_id] || []
    if (table === 'profiles')    return []
    return []                                   // empty catalogue
  }
  const chain = {
    select: () => chain, in: () => chain, order: () => chain,
    insert: () => chain, update: () => chain, delete: () => chain,
    eq: (c, v) => { f[c] = v; return chain },
    single: () => Promise.resolve({ data: rows()[0] ?? null, error: null }),
    then: (res, rej) => Promise.resolve({ data: rows(), error: null }).then(res, rej),
  }
  return chain
}
export const supabase = { schema: () => ({ from: make }), from: make }
