import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { calcAge, getPaymentPlans, getMonthlyPlans, MONTHLY_THRESHOLD } from '../lib/paymentPlans.js'
import { calcTotals } from '../lib/calcTotals.js'
import { useTranslations, getTranslations } from '../lib/useTranslations.js'
import { useChineseMode } from '../lib/useChineseMode.js'
import { versionNameOf } from '../lib/versionLabel.js'

// Each on-screen comparison column needs room for a version name and a figure
// like $13,419.00. At the old 220px, with px-8 taking 64 of them, the price
// overflowed its own cell on a phone and the second version was unreadable.
const COL_MIN_PX = 260

// Most columns a desktop comparison will draw.
const MAX_COLUMNS = 4

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

// ─── Shared HTML helpers (used by both print and web builders) ────────────────

function buildVersionHeaderCells({ shown, quotes, showArrangement, showTicker, lineWidth = 64, cellPadding = '24px 24px 28px' }) {
  return shown.map((q) => {
    const parts = [
      q.discount_amount > 0 && `${fmt(q.discount_amount)} off`,
      q.tax_amount > 0      && `${fmt(q.tax_amount)} tax incl.`,
    ].filter(Boolean)
    const title = versionNameOf(q, quotes.indexOf(q), quotes.length)
    // When an unnamed version falls back to its package, the package is
    // already the heading — printing it again underneath says nothing.
    const sub   = showArrangement && q.packages?.name && q.packages.name !== title
                    ? q.packages.name : ''
    return `
    <div style="text-align:center;padding:${cellPadding};">
      <p style="margin:0;font-size:17px;font-weight:700;color:#1d1d1f;font-family:-apple-system,sans-serif">
        ${esc(title)}
      </p>
      ${sub ? `<p style="margin:6px 0 0;font-size:13px;color:#86868b">${esc(sub)}</p>` : ''}
      ${showArrangement && q.arrangement_type ? `<p style="margin:3px 0 0;font-size:12px;color:#86868b;text-transform:capitalize">${esc(q.arrangement_type)}</p>` : ''}
      <p style="margin:12px 0 0;font-size:22px;font-weight:700;color:#1d1d1f;letter-spacing:-.02em">${fmt(q.total)}</p>
      ${showTicker && parts.length ? `<p style="margin:6px 0 0;font-size:12px;color:#a1a1aa">${parts.join(' · ')}</p>` : ''}
    </div>`
  }).join('')
}

const BOX_STYLE = 'background:#f5f5f7;border:1px solid #e5e5e5;border-radius:8px;padding:10px 12px;margin:0 0 12px;font-size:12px;'
const BOX_ROW   = 'display:flex;justify-content:space-between;color:#6b6b6b;'
const BOX_VAL   = 'font-weight:600;color:#3a3a3c;'
const BOX_SEP   = 'border-top:1px solid #e5e5e5;padding-top:6px;margin-top:6px;'

function buildPaymentSectionHTML({ shown, paymentPlansByQuote, monthlyPlansByQuote = {}, paymentTerms = null, gridCols }) {
  const g = `display:grid;grid-template-columns:${gridCols};`
  return `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#86868b">Payment Options</span>
    </div>
    <div style="${g}">
      ${shown.map((q) => {
        if (q.total > MONTHLY_THRESHOLD) {
          const plans = monthlyPlansByQuote[q.id] || getMonthlyPlans(q.total, paymentTerms)
          const { downPayment, balance } = plans[0] || {}
          return `
            <div style="padding:6px 24px 24px;">
              <div style="${BOX_STYLE}">
                <div style="${BOX_ROW}">
                  <span>Down payment (10%)</span>
                  <span style="${BOX_VAL}">${fmt(downPayment)}</span>
                </div>
                <div style="${BOX_ROW}${BOX_SEP}">
                  <span>Financed balance</span>
                  <span style="${BOX_VAL}">${fmt(balance)}</span>
                </div>
              </div>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="border-bottom:1px solid #e5e5e5;">
                    <th style="text-align:left;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">Term</th>
                    <th style="text-align:right;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">Rate</th>
                    <th style="text-align:right;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">Monthly</th>
                    <th style="text-align:right;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${plans.map(p => `
                    <tr style="border-bottom:1px solid #f5f5f7;">
                      <td style="padding:6px 6px;color:#3a3a3c;font-weight:600;font-size:13px">${esc(p.label)}</td>
                      <td style="padding:6px 6px;text-align:right;color:#86868b;font-size:12px">${p.rate > 0 ? `${p.rate}%` : '0%'}</td>
                      <td style="padding:6px 6px;text-align:right;font-weight:700;color:#1d1d1f;font-size:14px">${fmt(p.monthly)}</td>
                      <td style="padding:6px 6px;text-align:right;color:#86868b;font-size:12px">${fmt(p.totalFinanced)}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>`
        }
        const plans = paymentPlansByQuote[q.id] || []
        const age   = calcAge(q.beneficiary_birthdate)
        const nameBox = q.beneficiary_birthdate
          ? `<div style="${BOX_STYLE}"><div style="${BOX_ROW}"><span>Beneficiary</span><span style="${BOX_VAL}">${esc(q.deceased_name || 'Beneficiary')} · Age ${age}</span></div></div>`
          : `<div style="${BOX_STYLE}"><span style="color:#d1d1d6">Calculation not available without birthdate.</span></div>`
        if (!q.beneficiary_birthdate || plans.length === 0) {
          return `<div style="padding:6px 24px 24px;">${nameBox}</div>`
        }
        return `
          <div style="padding:6px 24px 24px;">
            ${nameBox}
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="border-bottom:1px solid #e5e5e5;">
                  <th style="text-align:left;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">Plan</th>
                  <th style="text-align:right;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">Monthly</th>
                  <th style="text-align:right;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">Total</th>
                  <th style="text-align:right;padding:4px 6px;color:#86868b;font-weight:600;font-size:11px">+/day</th>
                </tr>
              </thead>
              <tbody>
                ${plans.map(p => `
                  <tr style="border-bottom:1px solid #f5f5f7;">
                    <td style="padding:6px 6px;color:#3a3a3c;font-weight:600;font-size:13px">${esc(p.label)}</td>
                    <td style="padding:6px 6px;text-align:right;font-weight:700;color:#1d1d1f;font-size:14px">${fmt(p.monthly)}</td>
                    <td style="padding:6px 6px;text-align:right;color:#86868b;font-size:12px">${fmt(p.totalInvestment)}</td>
                    <td style="padding:6px 6px;text-align:right;color:#86868b;font-size:12px">${fmt(p.perDay)}</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>`
      }).join('')}
    </div>`
}

const GREEN = '#059669'

// Mirrors the cemetery comparison's summary: what is behind each column's
// headline figure, with the money off in green.
function buildSummarySectionHTML({ shown, gridCols }) {
  const row = (label, value, colour = '#6b6b6b', weight = '600') => `
    <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:6px;color:${colour}">
      <span>${esc(label)}</span><span style="font-weight:${weight}">${esc(value)}</span>
    </div>`
  return `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#86868b">Summary</span>
    </div>
    <div style="display:grid;grid-template-columns:${gridCols};">
      ${shown.map(q => {
        const pct = q.discount_type === 'percentage' && Number(q.discount_value) > 0
          ? ` ${Number(q.discount_value)}%` : ''
        return `
        <div style="padding:4px 24px 24px;">
          <div style="${BOX_STYLE}">
            ${row('Subtotal', fmt(q.subtotal))}
            ${q.pkg_disc_amount  > 0 ? row('Package savings', `− ${fmt(q.pkg_disc_amount)}`,  GREEN) : ''}
            ${q.user_disc_amount > 0 ? row('Discount' + pct,  `− ${fmt(q.user_disc_amount)}`, GREEN) : ''}
            ${q.gst_amount > 0 ? row('GST 5%', fmt(q.gst_amount), '#a1a1aa') : ''}
            ${q.pst_amount > 0 ? row('PST 7%', fmt(q.pst_amount), '#a1a1aa') : ''}
            <div style="display:flex;justify-content:space-between;gap:12px;border-top:1px solid #e5e5e5;padding-top:8px;margin-top:8px;">
              <span style="font-weight:600;color:#3a3a3c">Total</span>
              <span style="font-size:16px;font-weight:700;color:#1d1d1f">${fmt(q.total)}</span>
            </div>
          </div>
        </div>`
      }).join('')}
    </div>`
}

function buildCategoryBlocks({ shown, categoryData, hasCaskets, casketByQuote, showPrices, showCasketImages, showTicker, showPayment, paymentPlansByQuote, monthlyPlansByQuote, paymentTerms, gridCols, translations = {}, showChinese = true }) {
  const g = `display:grid;grid-template-columns:${gridCols};`

  function catSectionHTML({ catName, itemsByVersion }) {
    return `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#86868b">${esc(catName)}</span>
    </div>
    <div style="${g}">
      ${shown.map((q) => `
        <div style="text-align:center;padding:6px 24px 24px;">
          ${(itemsByVersion[q.id] || []).map(item => `
            <div style="margin-bottom:14px">
              <p style="margin:0;font-size:16px;font-weight:600;color:#1d1d1f;line-height:1.4">${esc(item.name)}</p>
              ${showChinese && translations[item.name] ? `<p style="margin:2px 0 0;font-size:12px;color:#a1a1aa">${esc(translations[item.name])}</p>` : ''}
              ${showPrices ? `<p style="margin:3px 0 0;font-size:13px;color:#86868b">${fmt(item.amount)}</p>` : ''}
            </div>`).join('')}
        </div>`).join('')}
    </div>`
  }

  const casketHTML = hasCaskets ? `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#86868b">Casket Selection</span>
    </div>
    <div style="${g}">
      ${shown.map((q) => {
        const e = casketByQuote[q.id]; const csk = e?.casket
        return `
          <div style="text-align:center;padding:6px 24px 24px;">
            ${e ? `
              ${showCasketImages && csk?.imageUrl ? `<img src="${esc(csk.imageUrl)}" style="max-width:220px;width:100%;height:auto;object-fit:contain;border-radius:10px;background:#f5f5f7;margin-bottom:10px">` : ''}
              <p style="margin:0;font-size:16px;font-weight:600;color:#1d1d1f">${esc(e.name)}</p>
              ${showChinese ? `<p style="margin:2px 0 0;font-size:12px;color:#a1a1aa">棺木</p>` : ''}
              ${csk?.description ? `<p style="margin:4px 0 0;font-size:13px;color:#86868b;line-height:1.4">${esc(csk.description)}</p>` : ''}
              ${showPrices ? `<p style="margin:5px 0 0;font-size:13px;color:#86868b">${fmt(e.price)}</p>` : ''}
            ` : `<span style="font-size:13px;color:#d1d1d6">Not selected</span>`}
          </div>`
      }).join('')}
    </div>` : ''

  const pssCat   = categoryData.find(c => c.catId === 'pss')
  const transCat = categoryData.find(c => c.catId === 'trans')
  const caCat    = categoryData.find(c => c.catId === 'ca')

  const paymentHTML = showPayment && paymentPlansByQuote
    ? buildPaymentSectionHTML({ shown, paymentPlansByQuote, monthlyPlansByQuote, paymentTerms, gridCols })
    : ''

  const summaryHTML = showTicker ? buildSummarySectionHTML({ shown, gridCols }) : ''

  return `
    ${pssCat   ? catSectionHTML(pssCat)   : ''}
    ${casketHTML}
    ${transCat ? catSectionHTML(transCat) : ''}
    ${caCat    ? catSectionHTML(caCat)    : ''}
    ${summaryHTML}
    ${paymentHTML}`
}

// ─── Print HTML ───────────────────────────────────────────────────────────────
function buildPrintHTML(props) {
  const { shown } = props
  const n       = shown.length
  const gridCols = `repeat(${n},minmax(0,1fr))`

  const headers = buildVersionHeaderCells({ ...props, gridCols })
  const body    = buildCategoryBlocks({ ...props, gridCols })

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,sans-serif;max-width:960px;margin:0 auto;color:#1d1d1f">
      <div style="display:grid;grid-template-columns:${gridCols};">${headers}</div>
      ${body}
    </div>`
}

// ─── Web (sticky-header) HTML ─────────────────────────────────────────────────
function buildWebHTML(props) {
  const { shown } = props
  const n       = shown.length
  const colMin  = 260
  const compact = n <= 2

  // ≤2 columns: fluid grid that fills the viewport — no horizontal scroll needed
  // 3+ columns: each column gets a 260px floor so content stays readable
  const gridCols  = compact
    ? `repeat(${n},minmax(0,1fr))`
    : `repeat(${n},minmax(${colMin}px,1fr))`
  const wrapStyle = compact
    ? 'width:100%;padding-bottom:80px'
    : `min-width:${n * colMin}px;margin:0 auto;padding-bottom:80px`

  const headers = buildVersionHeaderCells({ ...props, gridCols, cellPadding: '20px 16px 20px' })
  const body    = buildCategoryBlocks({ ...props, gridCols })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Quote Comparison</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{background:#fff;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,sans-serif;color:#1d1d1f;-webkit-font-smoothing:antialiased}
    .wrap{${wrapStyle}}
    .sticky{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #e5e5e5;}
    .hgrid{display:grid;grid-template-columns:${gridCols};}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="sticky">
      <div class="hgrid">${headers}</div>
    </div>
    ${body}
  </div>
</body>
</html>`
}

// ─── Component ────────────────────────────────────────────────────────────────

function SumRow({ label, value, green, muted }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className={green ? 'text-emerald-600' : muted ? 'text-stone-400' : 'text-stone-500'}>{label}</dt>
      <dd className={green ? 'text-emerald-600 font-semibold'
                           : muted ? 'text-stone-400' : 'font-semibold text-stone-700'}>{value}</dd>
    </div>
  )
}


export default function ComparisonView({ contactId, currentQuoteId, versionOrder = [], onClose, paymentTerms = null }) {
  const [quotes,           setQuotes]           = useState([])
  const [itemsByQuote,     setItemsByQuote]      = useState({})
  const [categoryMap,      setCategoryMap]       = useState({})
  const [casketMap,        setCasketMap]         = useState({})
  const [selected,         setSelected]          = useState(new Set())
  const [showPrices,       setShowPrices]        = useState(true)
  const [showCasketImages, setShowCasketImages]  = useState(true)
  const [showTicker,       setShowTicker]        = useState(true)
  const [showArrangement,  setShowArrangement]   = useState(true)
  const [showPayment,      setShowPayment]       = useState(false)
  const [loading,          setLoading]           = useState(true)
  const [shareStatus,      setShareStatus]       = useState(null) // null | 'uploading' | 'done' | 'error'
  // Two columns side by side on a phone, scaled to fit, rather than a sheet
  // that scrolls sideways.
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches)
  const translations = useTranslations()
  const [showChinese, setShowChinese] = useChineseMode()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const onChange = e => setIsNarrow(e.matches)
    setIsNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    async function load() {
      const { data: raw } = await supabase
        .from('quotes')
        .select('id, quote_number, status, total, subtotal, discount_amount, tax_amount, arrangement_type, created_at, version_label, sort_order, beneficiary_birthdate, deceased_name, package_discount, discount_type, discount_value, packages(name)')
        .eq('contact_id', contactId)

      if (!raw?.length) { setLoading(false); return }

      // Sort by the user-defined order when available, fall back to created_at
      const orderMap = Object.fromEntries(versionOrder.map((id, i) => [id, i]))
      const qs = raw.slice().sort((a, b) => {
        const ai = orderMap[a.id] ?? (a.sort_order ?? 999999)
        const bi = orderMap[b.id] ?? (b.sort_order ?? 999999)
        return ai !== bi ? ai - bi : new Date(a.created_at) - new Date(b.created_at)
      })

      const { data: items } = await supabase
        .from('quote_items').select('*').in('quote_id', qs.map(q => q.id))

      const grouped = {}
      qs.forEach(q => { grouped[q.id] = [] })
      ;(items || []).forEach(i => { grouped[i.quote_id]?.push(i) })

      const sids = [...new Set((items || []).filter(i => i.service_item_id).map(i => i.service_item_id))]
      let catMap = {}
      if (sids.length) {
        const { data: siData } = await supabase
          .from('service_items').select('id, category_id, service_categories(id, name)').in('id', sids)
        ;(siData || []).forEach(si => {
          catMap[si.id] = { categoryName: si.service_categories?.name || '' }
        })
      }

      const cids = [...new Set((items || []).filter(i => i.is_casket_item && i.casket_id).map(i => i.casket_id))]
      let cskMap = {}
      if (cids.length) {
        const { data: d } = await supabase.from('casket_catalog').select('id, name, description, image_url').in('id', cids)
        ;(d || []).forEach(c => { cskMap[c.id] = { name: c.name, description: c.description, imageUrl: c.image_url } })
      }

      // Recalculate totals fresh from items using the current rounding logic
      const recalcQs = qs.map(q => {
        const qItems = (grouped[q.id] || []).map(i => ({
          price:    Number(i.price),
          quantity: Number(i.quantity),
          gst:      i.is_gst  ?? true,
          pst:      i.is_pst  ?? false,
          noDisc:   i.no_disc ?? false,
        }))
        const t = calcTotals(qItems, Number(q.package_discount) || 0, q.discount_type || 'percentage', Number(q.discount_value) || 0)
        // Keep the whole breakdown, not just the rolled-up figures — the
        // summary at the bottom shows package savings, any further discount,
        // and GST and PST separately.
        return { ...q, total: t.total, subtotal: t.subtotal,
                 discount_amount: t.discountAmount, tax_amount: t.taxAmount,
                 pkg_disc_amount: t.pkgDiscAmount, user_disc_amount: t.userDiscAmount,
                 gst_amount: t.gstAmount, pst_amount: t.pstAmount }
      })

      setQuotes(recalcQs); setItemsByQuote(grouped); setCategoryMap(catMap)
      setCasketMap(cskMap)
      setSelected(new Set(qs.map(q => q.id))); setLoading(false)
    }
    load()
  }, [contactId])

  // A phone shows two versions side by side and no more — three columns in
  // 390px is not a comparison, it is a word search. Picking a third swaps out
  // the one selected longest ago, so the chips are what choose the pair.
  const MAX_ON_NARROW = 2

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); return next }
      const cap = isNarrow ? MAX_ON_NARROW : MAX_COLUMNS
      if (next.size >= cap) {
        const oldest = quotes.find(q => next.has(q.id))
        if (oldest) next.delete(oldest.id)
      }
      next.add(id)
      return next
    })
  }

  const selectedQuotes = quotes.filter(q => selected.has(q.id))
  // Rotating a tablet must not silently change what is selected, so the cap is
  // applied to what is drawn rather than to the selection itself.
  const shown = isNarrow ? selectedQuotes.slice(0, MAX_ON_NARROW) : selectedQuotes
  const cols  = shown.length

  function buildCategoryData() {
    const PSS   = { catId: 'pss',   catName: 'Professional Staff & Services', itemsByVersion: {} }
    const TRANS = { catId: 'trans', catName: 'Transportation',                itemsByVersion: {} }
    const CA    = { catId: 'ca',    catName: 'Third Party Items',           itemsByVersion: {} }

    shown.forEach(q => {
      ;(itemsByQuote[q.id] || []).forEach(item => {
        if (item.is_casket_item) return
        const catName = item.service_item_id ? (categoryMap[item.service_item_id]?.categoryName || '') : ''
        const n = catName.toLowerCase()
        const bucket = n.includes('cash') ? CA : n.includes('transport') ? TRANS : PSS
        const entry  = { name: item.name, amount: item.price * item.quantity }
        if (!bucket.itemsByVersion[q.id]) bucket.itemsByVersion[q.id] = []
        bucket.itemsByVersion[q.id].push(entry)
      })
    })

    const result = []
    if (shown.some(q => PSS.itemsByVersion[q.id]?.length))   result.push(PSS)
    if (shown.some(q => TRANS.itemsByVersion[q.id]?.length)) result.push(TRANS)
    if (shown.some(q => CA.itemsByVersion[q.id]?.length))    result.push(CA)
    return result
  }

  function getCasketByQuote() {
    const r = {}
    shown.forEach(q => {
      const item = (itemsByQuote[q.id] || []).find(i => i.is_casket_item)
      if (item) r[q.id] = { name: item.name, price: item.price, casket: item.casket_id ? casketMap[item.casket_id] : null }
    })
    return r
  }

  const hasCaskets    = shown.some(q => (itemsByQuote[q.id] || []).some(i => i.is_casket_item))
  const casketByQuote = hasCaskets ? getCasketByQuote() : {}
  const categoryData  = shown.length ? buildCategoryData() : []

  const paymentPlansByQuote  = {}
  const monthlyPlansByQuote  = {}
  if (showPayment) {
    shown.forEach(q => {
      if (q.total > MONTHLY_THRESHOLD) {
        monthlyPlansByQuote[q.id] = getMonthlyPlans(q.total, paymentTerms)
      } else {
        const age = calcAge(q.beneficiary_birthdate)
        paymentPlansByQuote[q.id] = getPaymentPlans(age, q.total)
      }
    })
  }

  const sharedProps = { shown, quotes, categoryData, hasCaskets, casketByQuote, showPrices, showCasketImages, showTicker, showArrangement, showPayment, paymentPlansByQuote, monthlyPlansByQuote, paymentTerms, translations, showChinese }

  function handlePrint() {
    const win = window.open('', '_blank')
    if (!win) { alert('Allow popups for this site to print.'); return }
    const html = buildPrintHTML(sharedProps)
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote Comparison</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;padding:24px}@page{margin:1.5cm}@media print{body{padding:0}}</style>
</head>
<body>${html}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),400))<\/script></body>
</html>`)
    win.document.close()
  }

  async function handleOpenHTML() {
    const win = window.open('', '_blank')
    if (!win) { alert('Allow popups for this site to preview.'); return }
    const t = await getTranslations()
    win.document.write(buildWebHTML({ ...sharedProps, translations: t }))
    win.document.close()
  }

  async function handleShare() {
    if (shareStatus === 'uploading') return
    setShareStatus('uploading')
    try {
      const t    = await getTranslations()
      const html = buildWebHTML({ ...sharedProps, translations: t })
      const { data, error } = await supabase
        .from('comparison_shares')
        .insert({ html })
        .select('id')
        .single()
      if (error) throw error
      const url = `${window.location.origin}/share/${data.id}`
      await navigator.clipboard.writeText(url)
      setShareStatus('done')
      setTimeout(() => setShareStatus(null), 4000)
    } catch (e) {
      console.error('Share failed:', e?.message ?? e)
      setShareStatus('error')
      setTimeout(() => setShareStatus(null), 3000)
    }
  }

  const gridStyle = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }

  function renderCatSection({ catId, catName, itemsByVersion }) {
    return (
      <div key={catId}>
        <div className="pt-5 sm:pt-8 pb-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{catName}</span>
        </div>
        <div className="grid" style={gridStyle}>
          {shown.map((q) => (
            <div key={q.id} className="px-2 sm:px-8 pb-6 sm:pb-8 text-center">
              {(itemsByVersion[q.id] || []).map((item, i) => (
                <div key={i} className="mt-3 sm:mt-4">
                  <p className="text-[13px] sm:text-base font-semibold text-stone-800 leading-snug">{item.name}</p>
                  {showChinese && translations[item.name] && <p className="text-xs text-stone-400 leading-tight">{translations[item.name]}</p>}
                  {showPrices && <p className="text-xs sm:text-sm text-stone-400 mt-0.5 sm:mt-1">{fmt(item.amount)}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const pssCat   = categoryData.find(c => c.catId === 'pss')
  const transCat = categoryData.find(c => c.catId === 'trans')
  const caCat    = categoryData.find(c => c.catId === 'ca')

  const hasDiscountOrTax = shown.some(q => q.discount_amount > 0 || q.tax_amount > 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-4">

        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-100 flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-stone-800">Compare options</h2>
            {/* The explanation is the first thing to go when space is tight;
                on a phone it had been pushing Print onto four lines. */}
            <p className="hidden sm:block text-xs text-stone-400 mt-0.5">Each column shows everything included in that option</p>
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={handleShare}
              disabled={shareStatus === 'uploading'}
              className={`text-xs font-medium border px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50
                ${shareStatus === 'done'  ? 'border-emerald-300 text-emerald-600 bg-emerald-50' :
                  shareStatus === 'error' ? 'border-red-300 text-red-500' :
                  'border-stone-200 text-stone-500 hover:text-primary-700 hover:border-primary-300'}`}
            >
              {shareStatus === 'uploading' ? 'Uploading…' :
               shareStatus === 'done'      ? 'Link copied!' :
               shareStatus === 'error'     ? 'Error — retry?' :
               'Share link'}
            </button>
            <button onClick={handleOpenHTML} className="text-xs font-medium text-stone-500 hover:text-primary-700 border border-stone-200 hover:border-primary-300 px-3 py-1.5 rounded-lg transition-colors">
              Open HTML
            </button>
            <button onClick={handlePrint} className="text-xs font-medium text-stone-500 hover:text-primary-700 border border-stone-200 hover:border-primary-300 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
              <span className="sm:hidden">PDF</span>
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none ml-1">×</button>
          </div>
        </div>

        {loading ? <p className="text-sm text-stone-400 p-8 text-center">Loading…</p> : (
          <>
            {/* Toolbar */}
            <div className="flex gap-2 px-4 sm:px-6 py-3 border-b border-stone-100 flex-wrap items-center bg-stone-50/50">
              {quotes.map((q, i) => (
                <button key={q.id} onClick={() => toggle(q.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${selected.has(q.id) ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-stone-200 bg-white text-stone-400'}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selected.has(q.id) ? 'bg-primary-500' : 'bg-stone-300'}`} />
                  {versionNameOf(q, i, quotes.length)}
                  {q.id === currentQuoteId && <span className="text-xs opacity-60 ml-1">current</span>}
                </button>
              ))}
              <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <label className="flex items-center gap-1.5 text-sm text-stone-500 cursor-pointer select-none">
                  <input type="checkbox" checked={showChinese} onChange={e => setShowChinese(e.target.checked)} className="rounded" />
                  中文
                </label>
                <label className="flex items-center gap-1.5 text-sm text-stone-500 cursor-pointer select-none">
                  <input type="checkbox" checked={showPrices} onChange={e => setShowPrices(e.target.checked)} className="rounded" />
                  Show prices
                </label>
                <label className="flex items-center gap-1.5 text-sm text-stone-500 cursor-pointer select-none">
                  <input type="checkbox" checked={showArrangement} onChange={e => setShowArrangement(e.target.checked)} className="rounded" />
                  Service type
                </label>
                {hasDiscountOrTax && (
                  <label className="flex items-center gap-1.5 text-sm text-stone-500 cursor-pointer select-none">
                    <input type="checkbox" checked={showTicker} onChange={e => setShowTicker(e.target.checked)} className="rounded" />
                    Discount & tax
                  </label>
                )}
                {hasCaskets && (
                  <label className="flex items-center gap-1.5 text-sm text-stone-500 cursor-pointer select-none">
                    <input type="checkbox" checked={showCasketImages} onChange={e => setShowCasketImages(e.target.checked)} className="rounded" />
                    Casket images
                  </label>
                )}
                <label className="flex items-center gap-1.5 text-sm text-stone-500 cursor-pointer select-none">
                  <input type="checkbox" checked={showPayment} onChange={e => setShowPayment(e.target.checked)} className="rounded" />
                  Payment options
                </label>
              </div>
            </div>

            {shown.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-16">Select at least one option.</p>
            ) : (
              <div className="overflow-x-auto">
                <div style={isNarrow ? undefined : { minWidth: `${cols * COL_MIN_PX}px` }}>

                  {/* Version headers */}
                  <div className="grid" style={gridStyle}>
                    {shown.map((q) => {
                      const parts = [
                        q.discount_amount > 0 && `${fmt(q.discount_amount)} off`,
                        q.tax_amount > 0      && `${fmt(q.tax_amount)} tax incl.`,
                      ].filter(Boolean)
                      return (
                        <div key={q.id} className="px-2 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-6 text-center">
                          <p className={`text-sm leading-snug sm:text-2xl font-bold ${q.id === currentQuoteId ? 'text-primary-700' : 'text-stone-900'}`}>
                            {versionNameOf(q, quotes.indexOf(q), quotes.length)}
                          </p>
                          {showArrangement && q.packages?.name
                            && q.packages.name !== versionNameOf(q, quotes.indexOf(q), quotes.length)
                            && <p className="text-[11px] sm:text-sm text-stone-400 mt-1 sm:mt-1.5 leading-snug">{q.packages.name}</p>}
                          {showArrangement && q.arrangement_type && <p className="text-[11px] sm:text-xs text-stone-400 capitalize mt-0.5">{q.arrangement_type}</p>}
                          <p className="text-lg sm:text-2xl font-bold text-stone-900 mt-2 sm:mt-3 tracking-tight">{fmt(q.total)}</p>
                          {showTicker && parts.length > 0 && (
                            <p className="text-[10px] sm:text-xs text-stone-400 mt-1 sm:mt-1.5 leading-snug">{parts.join(' · ')}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Professional Staff & Services */}
                  {pssCat && renderCatSection(pssCat)}

                  {/* Caskets */}
                  {hasCaskets && (
                    <div>
                      <div className="pt-5 sm:pt-8 pb-2 text-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Casket Selection</span>
                      </div>
                      <div className="grid" style={gridStyle}>
                        {shown.map((q) => {
                          const entry = casketByQuote[q.id]; const csk = entry?.casket
                          return (
                            <div key={q.id} className="px-2 sm:px-8 pb-6 sm:pb-8 text-center">
                              {entry ? (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  {showCasketImages && (
                                    csk?.imageUrl
                                      ? <img src={csk.imageUrl} alt={entry.name} className="max-w-[220px] w-full object-contain rounded-xl bg-stone-50 max-h-32 sm:max-h-48" />
                                      : <div className="w-44 h-28 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-[10px]">No image</div>
                                  )}
                                  <p className="text-[13px] sm:text-base font-semibold text-stone-800 leading-snug">{entry.name}</p>
                                  {showChinese && <p className="text-xs text-stone-400 leading-tight">棺木</p>}
                                  {csk?.description && <p className="hidden sm:block text-xs text-stone-400 leading-tight max-w-[220px]">{csk.description}</p>}
                                  {showPrices && <p className="text-xs sm:text-sm text-stone-400">{fmt(entry.price)}</p>}
                                </div>
                              ) : <p className="text-sm text-stone-300 mt-4">Not selected</p>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Transportation */}
                  {transCat && renderCatSection(transCat)}

                  {/* Cash Advanced */}
                  {caCat && renderCatSection(caCat)}

                  {/* Summary — the breakdown behind each column's headline
                      figure. Shares the "Discount & tax" toggle rather than
                      adding another checkbox. */}
                  {showTicker && (
                    <div>
                      <div className="pt-5 sm:pt-8 pb-2 text-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Summary</span>
                      </div>
                      <div className="grid" style={gridStyle}>
                        {shown.map(q => {
                          const pct = q.discount_type === 'percentage' && Number(q.discount_value) > 0
                            ? ` ${Number(q.discount_value)}%` : ''
                          return (
                            <div key={q.id} className="px-6 pb-8 pt-1">
                              <dl className="bg-stone-50 rounded-lg p-3 border border-stone-100 text-[13px] space-y-1.5">
                                <SumRow label="Subtotal" value={fmt(q.subtotal)} />
                                {q.pkg_disc_amount > 0 && (
                                  <SumRow label="Package savings" value={`− ${fmt(q.pkg_disc_amount)}`} green />
                                )}
                                {q.user_disc_amount > 0 && (
                                  <SumRow label={`Discount${pct}`} value={`− ${fmt(q.user_disc_amount)}`} green />
                                )}
                                {q.gst_amount > 0 && <SumRow label="GST 5%" value={fmt(q.gst_amount)} muted />}
                                {q.pst_amount > 0 && <SumRow label="PST 7%" value={fmt(q.pst_amount)} muted />}
                                <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-stone-200">
                                  <dt className="font-semibold text-stone-700">Total</dt>
                                  <dd className="text-base font-bold text-stone-900">{fmt(q.total)}</dd>
                                </div>
                              </dl>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Payment Options */}
                  {showPayment && (
                    <div>
                      <div className="pt-5 sm:pt-8 pb-2 text-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Payment Options</span>
                      </div>
                      <div className="grid" style={gridStyle}>
                        {shown.map((q) => {
                          if (q.total > MONTHLY_THRESHOLD) {
                            const plans = monthlyPlansByQuote[q.id] || []
                            return (
                              <div key={q.id} className="px-6 pb-8 pt-3">
                                <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100 text-[11px] space-y-1 mb-3">
                                  <div className="flex justify-between text-stone-500">
                                    <span>Down payment (10%)</span>
                                    <span className="font-semibold text-stone-700">{fmt(plans[0]?.downPayment)}</span>
                                  </div>
                                  <div className="flex justify-between text-stone-500 border-t border-stone-200 pt-1">
                                    <span>Financed balance</span>
                                    <span className="font-semibold text-stone-700">{fmt(plans[0]?.balance)}</span>
                                  </div>
                                </div>
                                <table className="w-full text-sm border-collapse">
                                  <thead>
                                    <tr className="border-b border-stone-100">
                                      <th className="text-left py-1.5 text-xs font-semibold text-stone-400">Term</th>
                                      <th className="text-right py-1.5 text-xs font-semibold text-stone-400">Rate</th>
                                      <th className="text-right py-1.5 text-xs font-semibold text-stone-400">Monthly</th>
                                      <th className="text-right py-1.5 text-xs font-semibold text-stone-400">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {plans.map(p => (
                                      <tr key={p.months} className="border-b border-stone-50">
                                        <td className="py-2 text-stone-700 font-semibold">{p.label}</td>
                                        <td className="py-2 text-right text-stone-400 text-xs">{p.rate > 0 ? `${p.rate}%` : '0%'}</td>
                                        <td className="py-2 text-right font-bold text-stone-900">{fmt(p.monthly)}</td>
                                        <td className="py-2 text-right text-stone-400 text-xs">{fmt(p.totalFinanced)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          }
                          const plans = paymentPlansByQuote[q.id] || []
                          const age   = calcAge(q.beneficiary_birthdate)
                          return (
                            <div key={q.id} className="px-6 pb-8 pt-3">
                              <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100 text-[11px] mb-3">
                                {q.beneficiary_birthdate ? (
                                  <div className="flex justify-between text-stone-500">
                                    <span>Beneficiary</span>
                                    <span className="font-semibold text-stone-700">{q.deceased_name || 'Beneficiary'} · Age {age}</span>
                                  </div>
                                ) : (
                                  <span className="text-stone-300">Calculation not available without birthdate.</span>
                                )}
                              </div>
                              {q.beneficiary_birthdate && plans.length > 0 && (
                                <table className="w-full text-sm border-collapse">
                                  <thead>
                                    <tr className="border-b border-stone-100">
                                      <th className="text-left py-1.5 text-xs font-semibold text-stone-400">Plan</th>
                                      <th className="text-right py-1.5 text-xs font-semibold text-stone-400">Monthly</th>
                                      <th className="text-right py-1.5 text-xs font-semibold text-stone-400">Total</th>
                                      <th className="text-right py-1.5 text-xs font-semibold text-stone-400">+/day</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {plans.map(p => (
                                      <tr key={p.years} className="border-b border-stone-50">
                                        <td className="py-2 text-stone-700 font-semibold">{p.label}</td>
                                        <td className="py-2 text-right font-bold text-stone-900">{fmt(p.monthly)}</td>
                                        <td className="py-2 text-right text-stone-400 text-xs">{fmt(p.totalInvestment)}</td>
                                        <td className="py-2 text-right text-stone-400 text-xs">{fmt(p.perDay)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pb-8" />

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
