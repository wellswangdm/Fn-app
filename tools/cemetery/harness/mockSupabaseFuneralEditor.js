// Harness stand-in for the funeral portal's QuoteEditor and the components it
// mounts: CustomerForm, PackageSelector, ItemBrowser, CasketPicker,
// QuoteSummary, PrintView, ComparisonView.
//
// It serves the newest shape of every query, so the editor's migration
// fallbacks are not what gets exercised here — the happy path is.
const uid = () => 'id' + Math.random().toString(36).slice(2, 9)

const CATS = [
  { id:'c1', name:'Professional Services', sort_order:1 },
  { id:'c2', name:'Facilities & Equipment', sort_order:2 },
  { id:'c3', name:'Transportation',         sort_order:3 },
  { id:'c4', name:'Merchandise',            sort_order:4 },
  { id:'c5', name:'Cash Advances',          sort_order:5 },
  { id:'fso', name:'Family Support Options', sort_order:6 },
]

const si = (id, category_id, name, price, extra = {}) => ({
  id, category_id, funeral_home_id:'3605', item_code:id.toUpperCase(), name,
  description:null, price, price_min:null, price_max:null, is_cash_advance:category_id === 'c5',
  default_gst:category_id === 'c4', default_no_disc:false, active:true, sort_order:1,
  service_categories:{ name: CATS.find(c => c.id === category_id).name },
  ...extra,
})

const SERVICE_ITEMS = [
  si('s1','c1','Basic Professional Services of Funeral Director and Staff', 2495),
  si('s2','c1','Embalming', 795),
  si('s3','c1','Other Preparation of the Body', 350),
  si('s4','c1','Supervision of Visitation', 495),
  si('s5','c1','Supervision of Funeral Ceremony', 595),
  si('s6','c2','Facilities for Visitation (per day)', 450),
  si('s7','c2','Facilities for Funeral Ceremony', 550),
  si('s8','c3','Transfer of Remains to Funeral Home', 425),
  si('s9','c3','Funeral Coach (Hearse)', 495),
  si('s10','c3','Service Vehicle', 225),
  si('s11','c4','Remembrance Collection', 395),
  si('s12','c4','Heritage Stationery Collection', 795),
  si('s13','c4','Memorial Register Book', 85),
  si('s14','c5','Crematorium Fee', 750),
  si('s15','c5','Death Registration', 65),
  si('f1','fso','Grief Support Program', 0),
  si('f2','fso','Memorial Video Tribute', 0),
  si('f3','fso','Keepsake Urn', 0),
]

const CASKET_CATALOG = [
  { id:'k1', name:'Jade Solid Mahogany',   description:'Solid mahogany, velvet interior', image_url:null },
  { id:'k2', name:'Heritage Oak',          description:'Solid oak, crepe interior',       image_url:null },
  { id:'k3', name:'Tribute Steel 18ga',    description:'18 gauge steel, sealed',          image_url:null },
  { id:'k4', name:'Honour Poplar',         description:'Poplar veneer',                   image_url:null },
]
const FH_CASKETS = [
  { funeral_home_id:'3605', catalog_id:'k1', price:8950, sort_order:1, casket_catalog:CASKET_CATALOG[0] },
  { funeral_home_id:'3605', catalog_id:'k2', price:5450, sort_order:2, casket_catalog:CASKET_CATALOG[1] },
  { funeral_home_id:'3605', catalog_id:'k3', price:3295, sort_order:3, casket_catalog:CASKET_CATALOG[2] },
  { funeral_home_id:'3605', catalog_id:'k4', price:1895, sort_order:4, casket_catalog:CASKET_CATALOG[3] },
]

const PACKAGES = [
  { id:'p1', funeral_home_id:'3605', name:'Heritage Funeral Package', total_price:12995,
    sort_order:1, pkg_type:'package', package_discount:605, default_casket_id:'k2',
    casket_catalog:CASKET_CATALOG[1] },
  { id:'p2', funeral_home_id:'3605', name:'Tribute Burial Package', total_price:9495,
    sort_order:2, pkg_type:'package', package_discount:495, default_casket_id:'k3',
    casket_catalog:CASKET_CATALOG[2] },
  { id:'p3', funeral_home_id:'3605', name:'Honour Cremation Package', total_price:5495,
    sort_order:3, pkg_type:'package', package_discount:415, default_casket_id:null,
    casket_catalog:null },
  { id:'p4', funeral_home_id:'3605', name:'Jade Burial Package', total_price:18950,
    sort_order:4, pkg_type:null, package_discount:575, default_casket_id:'k1',
    casket_catalog:CASKET_CATALOG[0] },
]
const pi = (package_id, sid, quantity = 1, is_optional = false, sort_order = 0) => ({
  package_id, quantity, is_optional, sort_order,
  service_items: (() => { const s = SERVICE_ITEMS.find(x => x.id === sid)
                          return { id:s.id, name:s.name, price:s.price, category_id:s.category_id } })(),
})
const PACKAGE_ITEMS = [
  pi('p1','s1',1,false,0), pi('p1','s2',1,false,1), pi('p1','s4',1,false,2),
  pi('p1','s5',1,false,3), pi('p1','s6',1,false,4), pi('p1','s7',1,false,5),
  pi('p1','s8',1,false,6), pi('p1','s9',1,false,7), pi('p1','s11',1,false,8),
  pi('p1','s3',1,true,9),  pi('p1','s10',1,true,10), pi('p1','f1',1,false,11),
  pi('p2','s1',1,false,0), pi('p2','s4',1,false,1), pi('p2','s8',1,false,2),
  pi('p2','s9',1,false,3), pi('p2','s11',1,false,4), pi('p2','s2',1,true,5),
  pi('p3','s1',1,false,0), pi('p3','s8',1,false,1), pi('p3','s11',1,false,2),
  pi('p4','s1',1,false,0), pi('p4','s2',1,false,1), pi('p4','s5',1,false,2),
  pi('p4','s7',1,false,3), pi('p4','s9',1,false,4), pi('p4','f1',1,false,5), pi('p4','f2',1,false,6),
]

const HOMES = [
  { id:'3605', name:'Forest Lawn Funeral Home', tax_rate:0.05,
    address:'3789 Royal Oak Ave, Burnaby BC', phone:'604-299-7720', website:'forestlawn.ca' },
  { id:'3644', name:'Ocean View Funeral Home', tax_rate:0.05,
    address:'4000 Imperial St, Burnaby BC', phone:'604-435-6688', website:'oceanview.ca' },
]

const QUOTES = [
  { id:'q1', contact_id:'C1', funeral_home_id:'3605', package_id:'p1',
    deceased_name:'Chen, Wai Man', customer_name:'Chen, Wai Man', purchaser_different:false,
    status:'draft', total:14250.75, subtotal:14800, discount_amount:605, tax_amount:55.75,
    arrangement_type:'burial', version_label:'Traditional burial', sort_order:0,
    quote_number:'Q-20261118-401', created_at:'2026-11-18T00:00:00Z', updated_at:'2026-11-18T00:00:00Z',
    beneficiary_birthdate:'1948-04-02', beneficiary_phone:'778-222-1111',
    beneficiary_email:'family@example.com', beneficiary_address:'123 Example St, Burnaby BC',
    purchaser_name:null, purchaser_phone:null, purchaser_email:null,
    purchaser_birthdate:null, purchaser_address:null,
    advisor_name:'Wells Wang', advisor_email:'w@x.com', advisor_phone:'778-866-8863',
    notes:'Family requests an afternoon service.', package_discount:605,
    discount_type:'amount', discount_value:0, user_id:'u1', gst_amount:55.75, pst_amount:0 },
  { id:'q2', contact_id:'C1', funeral_home_id:'3605', package_id:'p3',
    deceased_name:'Chen, Wai Man', customer_name:'Chen, Wai Man', purchaser_different:false,
    status:'draft', total:8640, subtotal:8900, discount_amount:415, tax_amount:155,
    arrangement_type:'cremation', version_label:'Cremation', sort_order:1,
    quote_number:'Q-20261117-402', created_at:'2026-11-17T00:00:00Z', updated_at:'2026-11-17T00:00:00Z',
    beneficiary_birthdate:'1948-04-02', advisor_name:'Wells Wang', package_discount:415,
    discount_type:'amount', discount_value:0, user_id:'u1' },
]

const ITEMS = [
  { id:'i1', quote_id:'q1', service_item_id:'s1', name:'Basic Professional Services of Funeral Director and Staff',
    price:2495, quantity:1, category_id:'c1', created_at:'2026-11-18T00:00:01Z',
    is_cash_advance:false, gst:false, pst:false, no_disc:false, section_id:null, from_package:true },
  { id:'i2', quote_id:'q1', service_item_id:'s2', name:'Embalming', price:795, quantity:1,
    category_id:'c1', created_at:'2026-11-18T00:00:02Z',
    is_cash_advance:false, gst:false, pst:false, no_disc:false, section_id:null, from_package:true },
  { id:'i3', quote_id:'q1', service_item_id:null, name:'Jade Solid Mahogany', price:8950, quantity:1,
    category_id:'c4', created_at:'2026-11-18T00:00:03Z',
    is_cash_advance:false, gst:true, pst:true, no_disc:false, section_id:null, casket_id:'k1' },
  { id:'i4', quote_id:'q1', service_item_id:'s11', name:'Remembrance Collection', price:395, quantity:1,
    category_id:'c4', created_at:'2026-11-18T00:00:04Z',
    is_cash_advance:false, gst:true, pst:false, no_disc:false, section_id:null, from_package:true },
  { id:'i5', quote_id:'q1', service_item_id:'s14', name:'Crematorium Fee', price:750, quantity:1,
    category_id:'c5', created_at:'2026-11-18T00:00:05Z',
    is_cash_advance:true, gst:false, pst:false, no_disc:true, section_id:null },
]

const PROFILES = [{ id:'u1', full_name:'Wells Wang', phone:'778-866-8863', advisor_email:'w@x.com' }]

const TABLES = {
  funeral_homes: HOMES, profiles: PROFILES, quotes: QUOTES, quote_items: ITEMS,
  packages: PACKAGES, package_items: PACKAGE_ITEMS, service_items: SERVICE_ITEMS,
  service_categories: CATS, funeral_home_caskets: FH_CASKETS, casket_catalog: CASKET_CATALOG,
}

const make = (table) => {
  const eqs = {}, ins = {}
  let op = 'select', payload = null
  const rows = () => (TABLES[table] || []).filter(r =>
    Object.entries(eqs).every(([k, v]) => r[k] === v) &&
    Object.entries(ins).every(([k, vs]) => vs.includes(r[k])))
  const settle = (res, rej) => {
    let data = rows()
    if (op === 'insert') {
      const list = Array.isArray(payload) ? payload : [payload]
      data = list.map(r => { const row = { ...r, id: uid(), created_at:new Date().toISOString() }
                             TABLES[table].push(row); return row })
    } else if (op === 'update') {
      data = rows(); data.forEach(r => Object.assign(r, payload))
    } else if (op === 'delete') {
      data = rows(); TABLES[table] = TABLES[table].filter(r => !data.includes(r))
    }
    return Promise.resolve({ data, error: null }).then(res, rej)
  }
  const chain = {
    select: () => chain, order: () => chain,
    eq: (c, v) => { eqs[c] = v; return chain },
    in: (c, v) => { ins[c] = v; return chain },
    is: (c, v) => { eqs[c] = v; return chain },
    insert: p => { op = 'insert'; payload = p; return chain },
    update: p => { op = 'update'; payload = p; return chain },
    upsert: p => { op = 'insert'; payload = p; return chain },
    delete: () => { op = 'delete'; return chain },
    single: () => settle(r => ({ ...r, data: r.data[0] ?? null }), e => e),
    maybeSingle: () => settle(r => ({ ...r, data: r.data[0] ?? null }), e => e),
    then: settle,
  }
  return chain
}

export const supabase = {
  from: make,
  schema: () => ({ from: make }),
  auth: { updateUser: async () => ({ data:null, error:null }) },
  storage: { from: () => ({ upload: async () => ({ data:null, error:null }),
                            getPublicUrl: () => ({ data:{ publicUrl:'' } }) }) },
}
