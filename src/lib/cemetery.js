// ─────────────────────────────────────────────────────────────────────────────
// Cemetery data access
//
// All cemetery tables live in the `cemetery` Postgres schema, reached with
// supabase.schema('cemetery'). The funeral portal's `public` tables are never
// touched from here, and vice versa — the two portals share only auth.users
// and public.profiles.
//
// If every call here fails with "schema must be one of the following", the
// schema has not been exposed to the API yet:
//   Supabase → Settings → API → Exposed schemas → add `cemetery`
// (see the note at the end of supabase/cemetery_schema.sql)
// ─────────────────────────────────────────────────────────────────────────────

import { supabase } from './supabase.js'

const cem = () => supabase.schema('cemetery')

export class CemeterySchemaError extends Error {}

function check(error, what) {
  if (!error) return
  const msg = String(error.message || '')
  if (/schema must be one of|does not exist|not exposed/i.test(msg)) {
    throw new CemeterySchemaError(
      `The "cemetery" schema is not reachable. Add it under ` +
      `Supabase → Settings → API → Exposed schemas, then reload. (${msg})`)
  }
  throw new Error(`${what}: ${msg}`)
}

// ─── Parks ───────────────────────────────────────────────────────────────────

export async function fetchParks() {
  const { data, error } = await cem()
    .from('parks')
    .select('id, name, address, phone, website, fee_schedule_id, gst_rate, pst_rate')
    .eq('active', true)
    .order('sort_order')
  check(error, 'fetchParks')
  return data || []
}

// ─── Catalogue ───────────────────────────────────────────────────────────────

/** Properties (interment rights) for one park, grouped-ready. */
export async function fetchProperties(parkId) {
  const { data, error } = await cem()
    .from('properties')
    .select(`id, name, name_zh, hmis_code, section, section_zh, price, ecf_price,
             ecf_included, marker_style, marker_type_allowed, interment_category,
             interment_rights, flat_marker_codes, notes, sort_order,
             default_gst, default_pst, default_discountable,
             property_types ( id, name, name_zh, sort_order )`)
    .eq('park_id', parkId)
    .eq('active', true)
    .order('sort_order')
  check(error, 'fetchProperties')
  return (data || []).map(r => ({
    ...r,
    typeId:    r.property_types?.id   || null,
    typeName:  r.property_types?.name || 'Other',
    typeNameZh:r.property_types?.name_zh || null,
  }))
}

/**
 * Products available at one park, with the per-park price and fees plus the
 * category (which carries the labels for the automatic fee lines).
 */
export async function fetchProducts(parkId) {
  const { data, error } = await cem()
    .from('park_products')
    .select(`product_id, price, base_price, ecf_price, install_price, sort_order,
             products!inner (
               id, name, name_zh, hmis_code, description, series, model, variant,
               size, base_size, color, dimensions, vase_included, vase_count,
               catalog_page, image_url, notes, active,
               product_categories ( id, name, name_zh, sort_order,
                 install_label, install_label_zh, ecf_label, ecf_label_zh,
                 base_label_suffix, base_label_suffix_zh )
             )`)
    .eq('park_id', parkId)
    .eq('active', true)
    .order('sort_order')
  check(error, 'fetchProducts')
  return (data || [])
    .filter(r => r.products?.active !== false)
    .map(r => {
      const p = r.products || {}
      const c = p.product_categories || {}
      return {
        // identity
        id:         p.id,
        product_id: r.product_id,
        name:       p.name,
        name_zh:    p.name_zh,
        hmis_code:  p.hmis_code,
        description:p.description,
        // pricing for this park
        price:         Number(r.price) || 0,
        base_price:    r.base_price    == null ? null : Number(r.base_price),
        ecf_price:     r.ecf_price     == null ? null : Number(r.ecf_price),
        install_price: r.install_price == null ? null : Number(r.install_price),
        // specs
        series: p.series, model: p.model, variant: p.variant,
        size: p.size, base_size: p.base_size, color: p.color,
        dimensions: p.dimensions, vase_included: p.vase_included,
        vase_count: p.vase_count, catalog_page: p.catalog_page,
        image_url: p.image_url, notes: p.notes,
        // category + fee labels
        categoryId:   c.id || null,
        categoryName: c.name || 'Other',
        categoryNameZh: c.name_zh || null,
        categorySort: c.sort_order ?? 99,
        category: {
          install_label:        c.install_label,
          install_label_zh:     c.install_label_zh,
          ecf_label:            c.ecf_label,
          ecf_label_zh:         c.ecf_label_zh,
          base_label_suffix:    c.base_label_suffix,
          base_label_suffix_zh: c.base_label_suffix_zh,
        },
        sort_order: r.sort_order,
      }
    })
}

/** Services priced for the fee schedule a park points at. */
export async function fetchServices(feeScheduleId) {
  if (!feeScheduleId) return []
  const { data, error } = await cem()
    .from('service_prices')
    .select(`service_type_id, price,
             service_types!inner (
               id, name, name_zh, hmis_code, description, sort_order, active,
               default_gst, default_pst, default_discountable,
               service_categories ( id, name, name_zh, sort_order )
             )`)
    .eq('fee_schedule_id', feeScheduleId)
    .eq('active', true)
  check(error, 'fetchServices')
  return (data || [])
    .filter(r => r.service_types?.active !== false)
    .map(r => {
      const s = r.service_types || {}
      const c = s.service_categories || {}
      return {
        id: s.id,
        service_type_id: r.service_type_id,
        name: s.name,
        name_zh: s.name_zh,
        hmis_code: s.hmis_code,
        description: s.description,
        price: Number(r.price) || 0,
        default_gst: s.default_gst,
        default_pst: s.default_pst,
        default_discountable: s.default_discountable,
        categoryId: c.id || null,
        categoryName: c.name || 'Other',
        categoryNameZh: c.name_zh || null,
        categorySort: c.sort_order ?? 99,
        sort_order: s.sort_order ?? 0,
      }
    })
    .sort((a, b) => a.categorySort - b.categorySort || a.sort_order - b.sort_order)
}

/** Everything a park needs, in parallel. */
export async function fetchCatalog(park) {
  const [properties, products, services] = await Promise.all([
    fetchProperties(park.id),
    fetchProducts(park.id),
    fetchServices(park.fee_schedule_id),
  ])
  return { properties, products, services }
}

// ─── Quotes ──────────────────────────────────────────────────────────────────

const QUOTE_COLS = `id, park_id, user_id, contact_id, quote_number,
  client_name, client_email, client_phone,
  advisor_name, advisor_email, advisor_phone,
  discount_percent, manual_discount_amount, manual_discount_name,
  gst_rate, pst_rate, gst_total, pst_total, subtotal, grand_total,
  is_monthly_payment_enabled, deposit_amount, interest_rate, payment_months,
  monthly_payment_amount, is_chinese_enabled, terms, notes,
  image_url, image_height, status, is_template, template_name,
  created_at, updated_at`

export async function fetchQuotes({ parkId, templates = false } = {}) {
  let q = cem().from('quotes').select(QUOTE_COLS).eq('is_template', templates)
  if (parkId) q = q.eq('park_id', parkId)
  const { data, error } = await q.order('updated_at', { ascending: false })
  check(error, 'fetchQuotes')
  return data || []
}

export async function fetchQuote(id) {
  const { data, error } = await cem().from('quotes').select(QUOTE_COLS).eq('id', id).single()
  check(error, 'fetchQuote')
  const { data: items, error: iErr } = await cem()
    .from('quote_items')
    .select(`id, parent_item_id, name, name_zh, hmis_code, unit_price, quantity,
             line_total, section, is_gst, is_pst, is_discountable, is_waived,
             ecf_included, source_kind, property_id, product_id, service_type_id, sort_order`)
    .eq('quote_id', id)
    .order('sort_order')
  check(iErr, 'fetchQuoteItems')
  return { ...data, items: (items || []).map(fromDbItem) }
}

function fromDbItem(r) {
  return {
    id:           r.id,
    parentItemId: r.parent_item_id || undefined,
    name:         r.name,
    nameZh:       r.name_zh || r.name,
    hmisCode:     r.hmis_code || null,
    unitPrice:    Number(r.unit_price) || 0,
    quantity:     r.quantity || 1,
    lineTotal:    Number(r.line_total) || 0,
    section:      r.section,
    isGst:        r.is_gst,
    isPst:        r.is_pst,
    isDiscountable: r.is_discountable,
    isWaived:     r.is_waived,
    ecfIncluded:  r.ecf_included,
    sourceKind:   r.source_kind,
    propertyId:   r.property_id,
    productId:    r.product_id,
    serviceTypeId:r.service_type_id,
  }
}

function toDbItem(l, quoteId, idx, idMap) {
  return {
    quote_id:        quoteId,
    parent_item_id:  l.parentItemId ? (idMap[l.parentItemId] ?? null) : null,
    name:            l.name,
    name_zh:         l.nameZh || null,
    hmis_code:       l.hmisCode || null,
    unit_price:      l.unitPrice,
    quantity:        l.quantity,
    line_total:      l.lineTotal,
    section:         l.section,
    is_gst:          l.isGst !== false,
    is_pst:          l.isPst === true,
    is_discountable: l.isDiscountable !== false,
    is_waived:       l.isWaived === true,
    ecf_included:    l.ecfIncluded === true,
    source_kind:     l.sourceKind || null,
    property_id:     l.propertyId || null,
    product_id:      l.productId || null,
    service_type_id: l.serviceTypeId || null,
    sort_order:      idx,
  }
}

/**
 * Save (insert or update) a quote and replace its line items.
 *
 * Items are written in two passes so parent_item_id can point at the real
 * row ids: parents first, then children with their parent's new id.
 */
export async function saveQuote(quote, lines, userId) {
  const row = {
    park_id:        quote.parkId,
    user_id:        userId,
    contact_id:     quote.contactId || null,
    quote_number:   quote.quoteNumber || null,
    client_name:    quote.clientName || null,
    client_email:   quote.clientEmail || null,
    client_phone:   quote.clientPhone || null,
    advisor_name:   quote.advisorName || null,
    advisor_email:  quote.advisorEmail || null,
    advisor_phone:  quote.advisorPhone || null,
    discount_percent:       Number(quote.discountPercent) || 0,
    manual_discount_amount: Number(quote.manualWaiveAmount) || 0,
    manual_discount_name:   quote.manualWaiveName || 'Miscellaneous Waived',
    gst_rate:   Number(quote.gstRate) || 0.05,
    pst_rate:   Number(quote.pstRate) || 0.07,
    gst_total:  Number(quote.totals?.gstTotal) || 0,
    pst_total:  Number(quote.totals?.pstTotal) || 0,
    subtotal:   Number(quote.totals?.subtotal) || 0,
    grand_total:Number(quote.totals?.grandTotal) || 0,
    is_monthly_payment_enabled: !!quote.isMonthlyPaymentEnabled,
    deposit_amount:  Number(quote.depositAmount) || 0,
    interest_rate:   Number(quote.interestRate) || 0,
    payment_months:  Number(quote.paymentMonths) || 60,
    monthly_payment_amount: quote.monthlyPaymentAmount ?? null,
    is_chinese_enabled: !!quote.isChineseEnabled,
    terms:  quote.terms || null,
    notes:  quote.notes || null,
    image_url:    quote.imageUrl || null,
    image_height: quote.imageHeight || null,
    status:        quote.status || 'draft',
    is_template:   !!quote.isTemplate,
    template_name: quote.templateName || null,
  }

  let quoteId = quote.id
  if (quoteId) {
    const { error } = await cem().from('quotes').update(row).eq('id', quoteId)
    check(error, 'updateQuote')
    const { error: dErr } = await cem().from('quote_items').delete().eq('quote_id', quoteId)
    check(dErr, 'clearQuoteItems')
  } else {
    const { data, error } = await cem().from('quotes').insert(row).select('id').single()
    check(error, 'insertQuote')
    quoteId = data.id
  }

  const ordered  = lines
  const parents  = ordered.filter(l => !l.parentItemId)
  const children = ordered.filter(l =>  l.parentItemId)
  const idMap    = {}

  if (parents.length) {
    const { data, error } = await cem()
      .from('quote_items')
      .insert(parents.map((l, i) => toDbItem(l, quoteId, ordered.indexOf(l), idMap)))
      .select('id')
    check(error, 'insertQuoteItems(parents)')
    parents.forEach((l, i) => { idMap[l.id] = data[i].id })
  }
  if (children.length) {
    const { error } = await cem()
      .from('quote_items')
      .insert(children.map(l => toDbItem(l, quoteId, ordered.indexOf(l), idMap)))
    check(error, 'insertQuoteItems(children)')
  }

  return quoteId
}

export async function deleteQuote(id) {
  const { error } = await cem().from('quotes').delete().eq('id', id)
  check(error, 'deleteQuote')
}

/** Duplicate a quote (used for "save as template" and for comparison versions). */
export async function duplicateQuote(id, overrides = {}, userId) {
  const q = await fetchQuote(id)
  const { items, ...rest } = q
  return saveQuote({
    ...fromDbQuote(rest),
    id: null,
    ...overrides,
  }, items, userId)
}

export function fromDbQuote(r) {
  return {
    id:            r.id,
    parkId:        r.park_id,
    contactId:     r.contact_id,
    quoteNumber:   r.quote_number,
    clientName:    r.client_name || '',
    clientEmail:   r.client_email || '',
    clientPhone:   r.client_phone || '',
    advisorName:   r.advisor_name || '',
    advisorEmail:  r.advisor_email || '',
    advisorPhone:  r.advisor_phone || '',
    discountPercent:   Number(r.discount_percent) || 0,
    manualWaiveAmount: Number(r.manual_discount_amount) || 0,
    manualWaiveName:   r.manual_discount_name || 'Miscellaneous Waived',
    gstRate: Number(r.gst_rate) || 0.05,
    pstRate: Number(r.pst_rate) || 0.07,
    isMonthlyPaymentEnabled: !!r.is_monthly_payment_enabled,
    depositAmount:  Number(r.deposit_amount) || 0,
    interestRate:   Number(r.interest_rate) || 0,
    paymentMonths:  Number(r.payment_months) || 60,
    monthlyPaymentAmount: r.monthly_payment_amount,
    isChineseEnabled: !!r.is_chinese_enabled,
    terms: r.terms || '',
    notes: r.notes || '',
    imageUrl:    r.image_url || null,
    imageHeight: r.image_height || null,
    status:      r.status || 'draft',
    isTemplate:  !!r.is_template,
    templateName:r.template_name || '',
    updatedAt:   r.updated_at,
    createdAt:   r.created_at,
  }
}

// ─── Advisor profile (shared with the funeral portal) ────────────────────────

export async function fetchAdvisor(user) {
  const fallback = {
    name:  user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '',
  }
  if (!user?.id) return fallback
  const { data } = await supabase
    .from('profiles')
    .select('full_name, phone, advisor_email')
    .eq('id', user.id)
    .single()
  if (!data) return fallback
  return {
    name:  data.full_name   || fallback.name,
    email: data.advisor_email || fallback.email,
    phone: data.phone       || '',
  }
}
