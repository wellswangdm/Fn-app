// Harness stand-in: serves funeral quote data so the real ComparisonView can
// be rendered without a backend. Two versions of one contact.
const QUOTES = [
  { id:'q1', contact_id:'C1', quote_number:'Q-1001', status:'finalized',
    version_label:'Heritage', sort_order:0, arrangement_type:'burial',
    package_discount:605, discount_type:'percentage', discount_value:0,
    beneficiary_birthdate:null, deceased_name:'Mary Chen',
    created_at:'2026-03-01T00:00:00Z', packages:{ name:'Dignity Memorial Heritage Funeral Service' } },
  { id:'q2', contact_id:'C1', quote_number:'Q-1002', status:'draft',
    version_label:'Tribute', sort_order:1, arrangement_type:'burial',
    package_discount:495, discount_type:'percentage', discount_value:5,
    beneficiary_birthdate:null, deceased_name:'Mary Chen',
    created_at:'2026-03-02T00:00:00Z', packages:{ name:'Dignity Memorial Tribute Funeral Service' } },
]
const ITEMS = [
  // q1
  { id:'i1', quote_id:'q1', service_item_id:'s1', name:'Professional Services Fees for Full Service', price:4695, quantity:1, is_gst:true,  is_pst:false, no_disc:false, is_casket_item:false, casket_id:null },
  { id:'i2', quote_id:'q1', service_item_id:'s2', name:'Transfer of Remains from Place of Death',     price:645,  quantity:1, is_gst:true,  is_pst:false, no_disc:false, is_casket_item:false, casket_id:null },
  { id:'i3', quote_id:'q1', service_item_id:'s3', name:'Death Certificate',                            price:27,   quantity:3, is_gst:false, is_pst:false, no_disc:true,  is_casket_item:false, casket_id:null },
  { id:'i4', quote_id:'q1', service_item_id:null, name:'Classic Mahogany',                             price:6499, quantity:1, is_gst:true,  is_pst:true,  no_disc:false, is_casket_item:true,  casket_id:'csk024' },
  // q2
  { id:'i5', quote_id:'q2', service_item_id:'s1', name:'Professional Services Fees for Full Service', price:4695, quantity:1, is_gst:true,  is_pst:false, no_disc:false, is_casket_item:false, casket_id:null },
  { id:'i6', quote_id:'q2', service_item_id:'s2', name:'Transfer of Remains from Place of Death',     price:645,  quantity:1, is_gst:true,  is_pst:false, no_disc:false, is_casket_item:false, casket_id:null },
  { id:'i7', quote_id:'q2', service_item_id:null, name:'Pine Shelter',                                 price:1995, quantity:1, is_gst:true,  is_pst:true,  no_disc:false, is_casket_item:true,  casket_id:'csk001' },
]
const SERVICE_ITEMS = [
  { id:'s1', category_id:'c1', service_categories:{ id:'c1', name:'Professional Staff & Services' } },
  { id:'s2', category_id:'c2', service_categories:{ id:'c2', name:'Transportation' } },
  { id:'s3', category_id:'c3', service_categories:{ id:'c3', name:'Cash Advance Items' } },
]
const CASKETS = [
  { id:'csk024', name:'Classic Mahogany', description:'Solid mahogany, velvet interior', image_url:null },
  { id:'csk001', name:'Pine Shelter',     description:'Unfinished pine',                 image_url:null },
]
const TABLES = {
  quotes: QUOTES, quote_items: ITEMS, service_items: SERVICE_ITEMS,
  casket_catalog: CASKETS, item_name_translations: [
    { item_name:'Professional Services Fees for Full Service', name_zh:'全套服務專業費用' },
    { item_name:'Death Certificate', name_zh:'死亡證明書' },
  ],
}
const make = (table) => {
  const chain = {
    select: () => chain, eq: () => chain, in: () => chain, order: () => chain,
    insert: () => chain, update: () => chain, delete: () => chain,
    single: () => Promise.resolve({ data: (TABLES[table] || [])[0] ?? null, error: null }),
    then: (res, rej) => Promise.resolve({ data: TABLES[table] || [], error: null }).then(res, rej),
  }
  return chain
}
export const supabase = { from: (t) => make(t), schema: () => ({ from: (t) => make(t) }) }
