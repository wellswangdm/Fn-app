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
import { CemeterySchemaError, isSchemaNotExposed } from './cemeterySchemaError.js'
import { groupIntoFamilies } from './cemeteryFamilies.js'
import { processingFeeLine } from './cemeteryTotals.js'

export { CemeterySchemaError, groupIntoFamilies }

const cem = () => supabase.schema('cemetery')

function check(error, what) {
  if (!error) return
  if (isSchemaNotExposed(error)) {
    throw new CemeterySchemaError(String(error.message || 'schema not exposed'))
  }
  throw new Error(`${what}: ${error.message || error}`)
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
               default_gst, default_pst, default_discountable,
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
        // quote-line defaults (urns carry PST; everything else is GST only)
        default_gst:          p.default_gst,
        default_pst:          p.default_pst,
        default_discountable: p.default_discountable,
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

// Columns added by migration_cemetery_quote_versions.sql. A database that
// has not had it run yet still works: queries fall back to the older column
// set and the portal behaves as it did before options existed, rather than
// failing and showing an empty list. Running the migration turns the feature
// on with no code change.
const VERSION_COLS = ['version_label', 'sort_order']

function isMissingColumn(error) {
  const t = `${error?.message || ''} ${error?.details || ''} ${error?.hint || ''}`
  return error?.code === '42703' ||
         /column .* does not exist|could not find the .* column/i.test(t)
}

const QUOTE_COLS_BASE = `id, park_id, user_id, contact_id, quote_number,
  client_name, client_email, client_phone,
  advisor_name, advisor_email, advisor_phone,
  discount_percent, manual_discount_amount, manual_discount_name,
  gst_rate, pst_rate, gst_total, pst_total, subtotal, grand_total,
  is_monthly_payment_enabled, deposit_amount, interest_rate, payment_months,
  monthly_payment_amount, is_chinese_enabled, terms, notes,
  image_url, image_height, status,
  is_template, template_name, created_at, updated_at`

const QUOTE_COLS = `${QUOTE_COLS_BASE}, ${VERSION_COLS.join(', ')}`

export async function fetchQuotes({ parkId, templates = false, contactId = null } = {}) {
  const run = async (cols, ordered) => {
    let q = cem().from('quotes').select(cols).eq('is_template', templates)
    if (parkId)    q = q.eq('park_id', parkId)
    if (contactId) q = q.eq('contact_id', contactId)
    return ordered
      ? await q.order('sort_order')
      : await q.order('updated_at', { ascending: false })
  }

  let { data, error } = await run(QUOTE_COLS, !!contactId)
  if (error && isMissingColumn(error)) {
    // migration not run yet — every quote is simply a family of one
    ;({ data, error } = await run(QUOTE_COLS_BASE, false))
  }
  check(error, 'fetchQuotes')
  return data || []
}

/**
 * Quotes grouped into families. A family is one contact_id; its members are
 * the OPTIONS being compared. Mirrors how the funeral portal groups versions.
 */
export async function fetchQuoteFamilies(parkId) {
  return groupIntoFamilies(await fetchQuotes({ parkId }))
}


export async function fetchQuote(id) {
  let { data, error } = await cem().from('quotes').select(QUOTE_COLS).eq('id', id).single()
  if (error && isMissingColumn(error)) {
    ;({ data, error } = await cem().from('quotes').select(QUOTE_COLS_BASE).eq('id', id).single())
  }
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
    // is_chinese_enabled is retained for older rows but no longer drives
    // anything: language is a viewing preference (see useChineseMode), not a
    // property of the quote.
    terms:  quote.terms || null,
    notes:  quote.notes || null,
    image_url:    quote.imageUrl || null,
    image_height: quote.imageHeight || null,
    status:        quote.status || 'draft',
    version_label: quote.versionLabel || null,
    sort_order:    Number(quote.sortOrder) || 0,
    // A quote never becomes a template by being saved. "Save as template"
    // inserts a separate row (saveAsTemplate below); previously it flipped
    // this flag on the quote itself, so the quote turned into a template and
    // every later save overwrote that template instead of the quote.
    is_template:   !!quote.isTemplate,
    template_name: quote.templateName || null,
    contact_id:    quote.contactId || null,
  }

  // Drop the version columns and retry if the migration has not been run,
  // so saving still works on an older database.
  const withoutVersionCols = r => {
    const copy = { ...r }
    for (const c of VERSION_COLS) delete copy[c]
    return copy
  }

  let quoteId = quote.id
  if (quoteId) {
    let { error } = await cem().from('quotes').update(row).eq('id', quoteId)
    if (error && isMissingColumn(error)) {
      ;({ error } = await cem().from('quotes').update(withoutVersionCols(row)).eq('id', quoteId))
    }
    check(error, 'updateQuote')
    const { error: dErr } = await cem().from('quote_items').delete().eq('quote_id', quoteId)
    check(dErr, 'clearQuoteItems')
  } else {
    let { data, error } = await cem().from('quotes').insert(row).select('id').single()
    if (error && isMissingColumn(error)) {
      ;({ data, error } = await cem().from('quotes')
        .insert(withoutVersionCols(row)).select('id').single())
    }
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

/**
 * Another OPTION for the same family: a copy sharing the contact_id, placed
 * after the existing options. This is how a family gets something to compare.
 */
export async function addOptionToFamily(quoteId, userId, { blank = false } = {}) {
  const src = await fetchQuote(quoteId)
  const { items, ...rest } = src
  const q = fromDbQuote(rest)
  const contactId = q.contactId || crypto.randomUUID()

  // If the source had no family yet, adopt it into the new one so both
  // options sit together rather than the original being left behind.
  if (!q.contactId) {
    let { error } = await cem().from('quotes')
      .update({ contact_id: contactId, sort_order: 0 }).eq('id', quoteId)
    if (error && isMissingColumn(error)) {
      ;({ error } = await cem().from('quotes')
        .update({ contact_id: contactId }).eq('id', quoteId))
    }
    check(error, 'adoptQuoteIntoFamily')
  }

  const siblings = await fetchQuotes({ contactId })
  const nextOrder = siblings.reduce((m, s) => Math.max(m, s.sort_order ?? 0), 0) + 1

  // `blank` starts the option from nothing but the family's details — the
  // point of a second option is often a different approach, not a tweak of
  // the first one.
  const lines = blank ? [processingFeeLine()] : items

  return saveQuote({
    ...q,
    id: null,
    contactId,
    sortOrder:    nextOrder,
    // No name: an option is named after the property it is built around
    // unless somebody types one. Storing "Option 2" here left a blank option
    // stuck with that name even after it had a property.
    versionLabel: '',
    isTemplate:   false,
    templateName: '',
    status:       'draft',
    ...(blank ? {
      discountPercent: 0, manualWaiveAmount: 0,
      isMonthlyPaymentEnabled: false, imageUrl: null, notes: '',
    } : {}),
  }, lines, userId)
}

/**
 * Save the current quote AS a template — a separate row. The quote itself is
 * untouched and stays a quote.
 */
export async function saveAsTemplate(quote, lines, userId, templateName) {
  return saveQuote({
    ...quote,
    id: null,
    contactId:    null,
    sortOrder:    0,
    isTemplate:   true,
    templateName,
    clientName:   '',
    clientEmail:  '',
    clientPhone:  '',
  }, lines, userId)
}

/** Start a new quote (and a new family) from a template. */
export async function newQuoteFromTemplate(templateId, userId, { clientName = '' } = {}) {
  const t = await fetchQuote(templateId)
  const { items, ...rest } = t
  const q = fromDbQuote(rest)
  return saveQuote({
    ...q,
    id: null,
    contactId:    crypto.randomUUID(),
    sortOrder:    0,
    isTemplate:   false,
    templateName: '',
    versionLabel: '',
    clientName,
    status:       'draft',
  }, items, userId)
}

/**
 * The property each quote is built around, for screens that show an option's
 * name without loading its line items. One query for the whole list.
 */
export async function fetchPropertyNames(quoteIds = []) {
  const ids = [...new Set(quoteIds.filter(Boolean))]
  if (!ids.length) return {}
  const { data, error } = await cem()
    .from('quote_items')
    .select('quote_id, name, sort_order')
    .in('quote_id', ids)
    .eq('section', 'Property')
    .is('parent_item_id', null)
    .order('sort_order')
  check(error, 'fetchPropertyNames')
  const out = {}
  for (const r of data || []) if (!(r.quote_id in out)) out[r.quote_id] = r.name
  return out
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
    terms: r.terms || '',
    notes: r.notes || '',
    imageUrl:    r.image_url || null,
    imageHeight: r.image_height || null,
    status:      r.status || 'draft',
    versionLabel:r.version_label || '',
    sortOrder:   r.sort_order ?? 0,
    isTemplate:  !!r.is_template,
    templateName:r.template_name || '',
    updatedAt:   r.updated_at,
    createdAt:   r.created_at,
  }
}

/**
 * Presentation extras for quote lines. A quote line snapshots its name and
 * price but not the product's photo or description, so a comparison looks
 * those up from the catalogue.
 */
export async function fetchProductMeta(productIds = []) {
  const ids = [...new Set(productIds.filter(Boolean))]
  if (!ids.length) return {}
  const { data, error } = await cem()
    .from('products')
    .select('id, image_url, description')
    .in('id', ids)
  check(error, 'fetchProductMeta')
  const out = {}
  for (const r of data || []) {
    out[r.id] = { imageUrl: r.image_url || null, description: r.description || null }
  }
  return out
}

/** Store a rendered comparison and return its share id (reuses the funeral portal's table). */
export async function createComparisonShare(html) {
  const { data, error } = await supabase
    .from('comparison_shares')
    .insert({ html })
    .select('id')
    .single()
  if (error) throw new Error(`createComparisonShare: ${error.message}`)
  return data.id
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
