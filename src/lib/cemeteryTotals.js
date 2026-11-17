// ─────────────────────────────────────────────────────────────────────────────
// Cemetery quote maths
//
// This is a faithful port of the old cemetery app's calculation (App.tsx:394-494).
// It is deliberately NOT merged with the funeral portal's calcTotals.js — the two
// quote models differ: the funeral side has a package discount and a single
// discount type, while the cemetery side has three interacting levers (a
// percentage discount, per-line waives, and a global dollar waive) plus the
// ECF 90/10 split.
//
// The three levers, and how they interact:
//
//   discountPercent        a percentage, applied ONLY to each line's
//                          "discountable portion"
//   isWaived (per line)    the line contributes 0
//   manualWaiveAmount      a global dollar waive, consumed across lines
//
//   If ANY line is explicitly waived, manualWaiveAmount is ignored entirely
//   and the displayed waive figure becomes the sum of the waived lines.
//   Otherwise the dollar waive is consumed against discountable portions
//   first (in line order), then against non-discountable portions.
//
// The discountable portion of a line is:
//   0                 when the line is not discountable
//   total x 0.9       Property lines whose price already includes ECF
//                     (the "90/10 rule" — the ECF tenth is not discountable)
//   total x 1.0       everything else
//
// Line ORDER matters: the dollar waive is allocated in order, so moving a line
// can change how much of it lands on discountable vs non-discountable amounts.
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_GST_RATE = 0.05
export const DEFAULT_PST_RATE = 0.07

/** ECF-included Property lines expose only this fraction to a percentage discount. */
export const ECF_DISCOUNTABLE_RATIO = 0.9

const r2 = n => Math.round(n * 100) / 100

/**
 * @param {Array} items  line items: { lineTotal, section, isDiscountable, isWaived,
 *                                     ecfIncluded, isGst, isPst }
 * @param {Object} opts  { discountPercent, manualWaiveAmount, gstRate, pstRate }
 * @returns totals plus a per-line breakdown (same order as `items`)
 */
export function calcCemeteryTotals(items = [], opts = {}) {
  const {
    discountPercent   = 0,
    manualWaiveAmount = 0,
    gstRate           = DEFAULT_GST_RATE,
    pstRate           = DEFAULT_PST_RATE,
  } = opts

  const lines = items.map(i => ({
    lineTotal:      Number(i.lineTotal) || 0,
    section:        i.section,
    isDiscountable: !!i.isDiscountable,
    isWaived:       !!i.isWaived,
    ecfIncluded:    !!i.ecfIncluded,
    isGst:          i.isGst !== false,
    isPst:          i.isPst === true,
  }))

  const subtotal         = lines.reduce((s, i) => s + i.lineTotal, 0)
  const waivedLinesTotal = lines.filter(i => i.isWaived).reduce((s, i) => s + i.lineTotal, 0)

  // An explicit per-line waive takes precedence over the global dollar waive.
  const useLineWaives  = waivedLinesTotal > 0
  const effectiveWaive = useLineWaives ? waivedLinesTotal : (Number(manualWaiveAmount) || 0)
  const percentMult    = 1 - (Number(discountPercent) || 0) / 100

  let unallocated = effectiveWaive

  // ── Pass 1: split each line, then consume the dollar waive against the
  //    discountable portions in line order.
  const prepped = lines.map(i => {
    const ratio = !i.isDiscountable
      ? 0
      : (i.section === 'Property' && i.ecfIncluded ? ECF_DISCOUNTABLE_RATIO : 1)

    const grossDisc    = i.lineTotal * ratio
    const grossNonDisc = i.lineTotal * (1 - ratio)

    let waivedDisc    = 0
    let waivedNonDisc = 0

    if (i.isWaived) {
      waivedDisc    = grossDisc
      waivedNonDisc = grossNonDisc
    } else if (!useLineWaives && unallocated > 0) {
      waivedDisc   = Math.min(grossDisc, unallocated)
      unallocated -= waivedDisc
    }

    return { line: i, grossDisc, grossNonDisc, waivedDisc, waivedNonDisc }
  })

  // ── Pass 2: any dollar waive still unspent now lands on the
  //    non-discountable portions, again in line order.
  const computed = prepped.map(p => {
    let waivedNonDisc = p.waivedNonDisc
    if (!p.line.isWaived && !useLineWaives && unallocated > 0) {
      const extra    = Math.min(p.grossNonDisc, unallocated)
      waivedNonDisc += extra
      unallocated   -= extra
    }

    const remainingDisc    = Math.max(0, p.grossDisc    - p.waivedDisc)
    const remainingNonDisc = Math.max(0, p.grossNonDisc - waivedNonDisc)

    const net = p.line.isWaived
      ? 0
      : remainingDisc * percentMult + remainingNonDisc

    return { ...p, waivedNonDisc, remainingDisc, remainingNonDisc, net }
  })

  const netSubtotal = computed.reduce((s, c) => s + c.net, 0)
  const gstTotal    = computed.filter(c => c.line.isGst)
                              .reduce((s, c) => s + c.net * gstRate, 0)
  const pstTotal    = computed.filter(c => c.line.isPst)
                              .reduce((s, c) => s + c.net * pstRate, 0)

  const grandTotal = r2(netSubtotal + gstTotal + pstTotal)

  // What the percentage discount actually saved, for display.
  const discountableBase = computed.reduce(
    (s, c) => s + (c.line.isWaived ? 0 : c.remainingDisc), 0)

  return {
    subtotal:        r2(subtotal),
    waiveAmount:     r2(effectiveWaive),
    waiveFromLines:  useLineWaives,
    percentSavings:  r2(discountableBase * ((Number(discountPercent) || 0) / 100)),
    netSubtotal:     r2(netSubtotal),
    gstTotal:        r2(gstTotal),
    pstTotal:        r2(pstTotal),
    taxTotal:        r2(gstTotal + pstTotal),
    grandTotal,
    unallocatedWaive: r2(Math.max(0, unallocated)),
    lines: computed.map(c => ({
      net:             r2(c.net),
      grossDisc:       r2(c.grossDisc),
      grossNonDisc:    r2(c.grossNonDisc),
      waivedDisc:      r2(c.waivedDisc),
      waivedNonDisc:   r2(c.waivedNonDisc),
      remainingDisc:   r2(c.remainingDisc),
      remainingNonDisc:r2(c.remainingNonDisc),
    })),
  }
}

// ─── Payment plan ────────────────────────────────────────────────────────────
// The cemetery side keeps its own amortised plan (deposit + rate + term),
// which is a different model from the funeral side's fixed factor table in
// paymentPlans.js. Both are kept; neither replaces the other.

/** Default deposit: 10% of the total, rounded UP to the nearest $100. */
export function defaultDeposit(grandTotal) {
  return Math.ceil(((Number(grandTotal) || 0) * 0.1) / 100) * 100
}

/**
 * Amortised monthly payment on the balance after the deposit.
 * A zero rate divides evenly; otherwise standard annuity.
 */
export function monthlyPayment({ grandTotal, depositAmount, interestRate, paymentMonths }) {
  const financed = Math.max(0, (Number(grandTotal) || 0) - (Number(depositAmount) || 0))
  const n        = Number(paymentMonths) || 0
  const rate     = Number(interestRate)  || 0
  if (n <= 0) return 0
  if (rate <= 0) return r2(financed / n)
  const r = rate / 100 / 12
  return r2((financed * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
}

export function paymentPlanSummary(quote) {
  const deposit  = Number(quote.depositAmount) || 0
  const financed = Math.max(0, (Number(quote.grandTotal) || 0) - deposit)
  const monthly  = monthlyPayment({
    grandTotal:    quote.grandTotal,
    depositAmount: deposit,
    interestRate:  quote.interestRate,
    paymentMonths: quote.paymentMonths,
  })
  return {
    deposit,
    financed:   r2(financed),
    monthly,
    months:     Number(quote.paymentMonths) || 0,
    totalPaid:  r2(deposit + monthly * (Number(quote.paymentMonths) || 0)),
  }
}

// ─── Building quote lines from catalogue selections ──────────────────────────
// Replaces the old app's `extraMappings` config: the fee lines are now derived
// from real columns. A null or zero fee produces no line, exactly as the old
// app's `if (p > 0)` did.

const MS = 'Merchandise and Services'

let seq = 0
const nextId = () => `l${Date.now().toString(36)}${(seq++).toString(36)}`

/** A property (interment rights) → 1 line, or 2 when ECF is charged separately. */
export function linesForProperty(prop) {
  const price = Number(prop.price) || 0
  const main  = {
    id: nextId(),
    name:        prop.name,
    nameZh:      prop.name_zh || prop.name,
    hmisCode:    prop.hmis_code || null,
    unitPrice:   price,
    quantity:    1,
    lineTotal:   price,
    section:     'Property',
    isGst:        prop.default_gst !== false,
    isPst:        prop.default_pst === true,
    isDiscountable: prop.default_discountable !== false,
    isWaived:     false,
    ecfIncluded:  !!prop.ecf_included,
    sourceKind:  'property',
    propertyId:   prop.id,
  }
  const out = [main]

  const ecf = Number(prop.ecf_price) || 0
  if (!prop.ecf_included && ecf > 0) {
    out.push({
      id: nextId(),
      parentItemId: main.id,
      name:        `ECF - ${prop.name}`,
      nameZh:      `管理基金 - ${prop.name_zh || prop.name}`,
      hmisCode:     null,
      unitPrice:    ecf,
      quantity:     1,
      lineTotal:    ecf,
      section:      'Property',
      isGst:        true,
      isPst:        false,
      isDiscountable: false,   // ECF is never discountable
      isWaived:     false,
      ecfIncluded:  false,
      sourceKind:  'fee_ecf',
      propertyId:   prop.id,
    })
  }
  return out
}

/**
 * A product → the product line plus its granite base, installation and ECF
 * lines. `product` is a joined row: park_products + products + product_categories.
 * Fee labels come from the category; the base label is composed from base_size.
 *
 * Discountability: only ENDOWMENT CARE (ECF) is non-discountable. Installation
 * and the granite base are discountable like any other merchandise. The old
 * app marked every automatic fee non-discountable because it treated them all
 * as one undifferentiated "extra" attached to the marker.
 *
 * Tax defaults come from the product (default_gst / default_pst) rather than
 * being assumed, so e.g. urns can carry PST without a special case in code.
 */
export function linesForProduct(product) {
  const price = Number(product.price) || 0
  const cat   = product.category || {}

  // A product row may arrive with the flags at the top level or under
  // `category` when a park hasn't overridden them.
  const defGst = product.default_gst ?? cat.default_gst
  const defPst = product.default_pst ?? cat.default_pst

  const main = {
    id: nextId(),
    name:        product.name,
    nameZh:      product.name_zh || product.name,
    hmisCode:    product.hmis_code || null,
    unitPrice:   price,
    quantity:    1,
    lineTotal:   price,
    section:     MS,
    isGst:       defGst !== false,
    isPst:       defPst === true,
    isDiscountable: true,
    isWaived:    false,
    ecfIncluded: false,
    sourceKind: 'product',
    productId:   product.product_id || product.id,
  }
  const out = [main]

  const addFee = (amount, kind, label, labelZh) => {
    const v = Number(amount) || 0
    if (v <= 0) return                       // zero or null fee = no line
    out.push({
      id: nextId(),
      parentItemId: main.id,
      name:        label,
      nameZh:      labelZh || label,
      hmisCode:    null,
      unitPrice:   v,
      quantity:    1,
      lineTotal:   v,
      section:     MS,
      isGst:       true,
      isPst:       false,
      // Endowment care is the only non-discountable fee. Installation and the
      // granite base discount like anything else.
      isDiscountable: kind !== 'fee_ecf',
      isWaived:    false,
      ecfIncluded: false,
      sourceKind:  kind,
      productId:   main.productId,
    })
  }

  // Order matches the old app's extraMappings order: base, install, ECF.
  const baseSize = product.base_size || ''
  addFee(product.base_price, 'fee_base',
    [baseSize, cat.base_label_suffix].filter(Boolean).join(' ') || 'Granite Base',
    [baseSize, cat.base_label_suffix_zh].filter(Boolean).join(' ') || '石底座')
  addFee(product.install_price, 'fee_install',
    cat.install_label || 'Installation Fee', cat.install_label_zh)
  addFee(product.ecf_price, 'fee_ecf',
    cat.ecf_label || 'ECF', cat.ecf_label_zh)

  return out
}

/** A service → 1 line. */
export function linesForService(svc) {
  const price = Number(svc.price) || 0
  return [{
    id: nextId(),
    name:        svc.name,
    nameZh:      svc.name_zh || svc.name,
    hmisCode:    svc.hmis_code || null,
    unitPrice:   price,
    quantity:    1,
    lineTotal:   price,
    section:     MS,
    isGst:       svc.default_gst !== false,
    isPst:       svc.default_pst === true,
    isDiscountable: svc.default_discountable !== false,
    isWaived:    false,
    ecfIncluded: false,
    sourceKind: 'service',
    serviceTypeId: svc.service_type_id || svc.id,
  }]
}

/** An ad-hoc line the advisor types in. */
export function customLine({ name, nameZh, price, section = MS, ecfIncluded = false }) {
  const p = Number(price) || 0
  return {
    id: nextId(),
    name,
    nameZh:      nameZh || name,
    hmisCode:    null,
    unitPrice:   p,
    quantity:    1,
    lineTotal:   p,
    section,
    isGst:       true,
    isPst:       false,
    isDiscountable: true,
    isWaived:    false,
    ecfIncluded,
    sourceKind: 'custom',
  }
}

/** The $50 processing fee the old app seeded onto every new quote. */
export function processingFeeLine(price = 50) {
  return {
    id: nextId(),
    name:        'Processing Fee',
    nameZh:      '手續費',
    hmisCode:    'DOCPROCF',
    unitPrice:   price,
    quantity:    1,
    lineTotal:   price,
    section:     MS,
    isGst:       true,
    isPst:       false,
    isDiscountable: false,
    isWaived:    false,
    ecfIncluded: false,
    sourceKind: 'service',
  }
}

/** Print/quote ordering: Property first, then Merchandise and Services. */
export function orderedLines(lines = []) {
  const rank = l => (l.section === 'Property' ? 0 : l.section === MS ? 1 : 2)
  return [...lines].sort((a, b) => rank(a) - rank(b))
}

/** Removing a line removes the fee lines it produced. */
export function removeLine(lines, id) {
  return lines.filter(l => l.id !== id && l.parentItemId !== id)
}

export function setQuantity(lines, id, quantity) {
  const qty = Math.max(1, Number(quantity) || 1)
  return lines.map(l => l.id === id
    ? { ...l, quantity: qty, lineTotal: r2(l.unitPrice * qty) }
    : l)
}
