// Harness stand-in with WRITES, mounted behind the real CemeteryPortal so the
// portal's own prop wiring is exercised — that is where the compare/switch
// bugs actually were.
const uid = () => 'id' + Math.random().toString(36).slice(2, 9)
const DB = {
  parks: [{ id:'6800', name:'Victory Memorial Park', address:'14831 28th Ave',
            phone:null, website:null, fee_schedule_id:'fs', gst_rate:0.05, pst_rate:0.07,
            active:true, sort_order:1 }],
  quotes: [], quote_items: [], profiles: [],
  // Catalogue, in the shape PostgREST returns for the joined selects.
  properties: [
    { id:'p1', park_id:'6800', active:true, name:'Royal Jade Phase 2 (Estate)', name_zh:null, hmis_code:null,
      section:'Royal Jade Phase 2', section_zh:null, price:208000, ecf_price:2100,
      ecf_included:false, marker_style:'Estate', marker_type_allowed:null,
      interment_category:null, interment_rights:null, flat_marker_codes:null,
      notes:null, sort_order:1, default_gst:true, default_pst:false,
      default_discountable:true,
      property_types:{ id:'lawn_crypt', name:'Lawn Crypt', name_zh:'草地墓位', sort_order:1 } },
    { id:'p2', park_id:'6800', active:true, name:'Royal Heights Phase 2 (Upright)', name_zh:null, hmis_code:null,
      section:'Royal Heights Phase 2', section_zh:null, price:34995, ecf_price:1050,
      ecf_included:false, marker_style:'Upright', marker_type_allowed:null,
      interment_category:null, interment_rights:null, flat_marker_codes:null,
      notes:null, sort_order:2, default_gst:true, default_pst:false,
      default_discountable:true,
      property_types:{ id:'lawn_crypt', name:'Lawn Crypt', name_zh:'草地墓位', sort_order:1 } },
  ],
  park_products: [], service_prices: [],
}
const base = { park_id:'6800', contact_id:null, client_name:'', version_label:null,
  sort_order:0, grand_total:0, is_template:false, template_name:null, status:'draft',
  discount_percent:0, manual_discount_amount:0, manual_discount_name:'Miscellaneous Waived',
  gst_rate:0.05, pst_rate:0.07, payment_months:60, interest_rate:0,
  is_monthly_payment_enabled:false, deposit_amount:0, terms:null, notes:null,
  image_url:null, image_height:null, quote_number:null, user_id:'u1',
  client_email:null, client_phone:null, advisor_name:null, advisor_email:null,
  advisor_phone:null, gst_total:0, pst_total:0, subtotal:0, monthly_payment_amount:null,
  is_chinese_enabled:false, created_at:new Date().toISOString(), updated_at:new Date().toISOString() }

const make = (table) => {
  const f = {}
  let payload = null, op = 'select'
  const rows = () => (DB[table] || []).filter(r =>
    Object.entries(f).every(([k, v]) => r[k] === v))
  const settle = (res, rej) => {
    let data = rows()
    if (op === 'insert') {
      const list = Array.isArray(payload) ? payload : [payload]
      data = list.map(r => { const row = { ...base, ...r, id: uid() }; DB[table].push(row); return row })
    } else if (op === 'update') {
      data = rows(); data.forEach(r => Object.assign(r, payload, { updated_at: new Date().toISOString() }))
    } else if (op === 'delete') {
      data = rows(); DB[table] = DB[table].filter(r => !data.includes(r))
    }
    return Promise.resolve({ data, error: null }).then(res, rej)
  }
  const chain = {
    select: () => chain, in: () => chain, order: () => chain,
    eq: (c, v) => { f[c] = v; return chain },
    is: (c, v) => { f[c] = v; return chain },
    insert: (p) => { op = 'insert'; payload = p; return chain },
    update: (p) => { op = 'update'; payload = p; return chain },
    delete: () => { op = 'delete'; return chain },
    single: () => settle(r => ({ ...r, data: r.data[0] ?? null }), e => e),
    then: settle,
  }
  return chain
}
export const supabase = { schema: () => ({ from: make }), from: make }
