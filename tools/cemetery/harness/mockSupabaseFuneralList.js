// Harness stand-in for the funeral portal's QuoteList.
//
// Representative rather than minimal: families with 1 / 2 / 3 versions, every
// status in play, a purchaser who differs from the beneficiary, two funeral
// homes, and a long name that has to truncate.
const QUOTES = [
  { id:'q1', contact_id:'C1', deceased_name:'Chen, Wai Man', customer_name:'Chen, Wai Man',
    status:'accepted', total:14250.75, created_at:'2026-11-18T00:00:00Z',
    version_label:'Traditional burial', sort_order:0, funeral_homes:{ name:'Forest Lawn Funeral Home' } },
  { id:'q2', contact_id:'C1', deceased_name:'Chen, Wai Man', customer_name:'Chen, Wai Man',
    status:'draft', total:8640.00, created_at:'2026-11-17T00:00:00Z',
    version_label:'Cremation', sort_order:1, funeral_homes:{ name:'Forest Lawn Funeral Home' } },
  { id:'q3', contact_id:'C1', deceased_name:'Chen, Wai Man', customer_name:'Chen, Wai Man',
    status:'draft', total:21980.50, created_at:'2026-11-16T00:00:00Z',
    version_label:null, sort_order:2, funeral_homes:{ name:'Forest Lawn Funeral Home' },
    packages:{ name:'Heritage Funeral Package' } },

  // purchaser differs from the beneficiary
  { id:'q4', contact_id:'C2', deceased_name:'Lee, Siu Ping', customer_name:'Lee, Kwok Fai',
    status:'finalized', total:9300.00, created_at:'2026-11-12T00:00:00Z',
    version_label:null, sort_order:0, funeral_homes:{ name:'Ocean View Funeral Home' },
    packages:{ name:'Tribute Burial Package' } },

  { id:'q5', contact_id:'C3', deceased_name:'Wong, Mei Ling — pre-need arrangement (companion plan)',
    customer_name:'Wong, Mei Ling', status:'draft', total:32400.00, created_at:'2026-10-20T00:00:00Z',
    version_label:'Full service', sort_order:0, funeral_homes:{ name:'Forest Lawn Funeral Home' } },
  { id:'q6', contact_id:'C3', deceased_name:'Wong, Mei Ling — pre-need arrangement (companion plan)',
    customer_name:'Wong, Mei Ling', status:'draft', total:18750.00, created_at:'2026-10-20T00:00:00Z',
    version_label:'Direct cremation', sort_order:1, funeral_homes:{ name:'Forest Lawn Funeral Home' } },

  { id:'q7', contact_id:'C4', deceased_name:'Ng, Chi Hang', customer_name:'Ng, Chi Hang',
    status:'accepted', total:11875.25, created_at:'2026-09-02T00:00:00Z',
    version_label:null, sort_order:0, funeral_homes:{ name:'Ocean View Funeral Home' },
    packages:{ name:'Honour Cremation Package' } },

  { id:'q8', contact_id:'C5', deceased_name:'Lau, Ho Yin', customer_name:'Lau, Ho Yin',
    status:'draft', total:7450.00, created_at:'2026-08-11T00:00:00Z',
    version_label:null, sort_order:0, funeral_homes:{ name:'Forest Lawn Funeral Home' } },
]

const make = (table) => {
  let data = table === 'quotes' ? QUOTES : []
  const chain = {
    select: () => chain, order: () => chain, in: () => chain, is: () => chain,
    insert: () => chain, update: () => chain, upsert: () => chain, delete: () => chain,
    eq: (col, val) => {
      if (col === 'contact_id') data = QUOTES.filter(q => q.contact_id === val)
      if (col === 'id')         data = QUOTES.filter(q => q.id === val)
      return chain
    },
    single: () => Promise.resolve({ data: data[0] ?? null, error: null }),
    then: (res, rej) => Promise.resolve({ data, error: null }).then(res, rej),
  }
  return chain
}
export const supabase = {
  from: make,
  schema: () => ({ from: make }),
  auth: { updateUser: async () => ({ data: null, error: null }) },
}
