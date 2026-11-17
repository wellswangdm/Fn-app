// ─────────────────────────────────────────────────────────────────────────────
// Standalone HTML for the cemetery comparison — print sheet and share link.
//
// Mirrors the funeral portal's ComparisonView builders: the same Apple-style
// typography and greys, the same centred column layout, so a family sees one
// house style whichever portal the quote came from.
// ─────────────────────────────────────────────────────────────────────────────

const INK    = '#1d1d1f'
const GREY   = '#86868b'
const LIGHT  = '#a1a1aa'
const FAINT  = '#d1d1d6'
const FONT   = "-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,sans-serif"

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Tax rate as a label. Never render NaN% on something a family reads. */
function pct(rate, fallback) {
  const n = Number(rate)
  return `${((Number.isFinite(n) && n > 0 ? n : fallback) * 100).toFixed(0)}%`
}

function headerCells({ quotes, showTicker, zh, cellPadding = '24px 24px 28px' }) {
  return quotes.map((q, i) => {
    const parts = [
      q.totals.waiveAmount    > 0 && `${fmt(q.totals.waiveAmount)} waived`,
      q.totals.percentSavings > 0 && `${fmt(q.totals.percentSavings)} off`,
      q.totals.taxTotal       > 0 && `${fmt(q.totals.taxTotal)} tax incl.`,
    ].filter(Boolean)
    return `
    <div style="text-align:center;padding:${cellPadding};">
      <p style="margin:0;font-size:20px;font-weight:700;color:${INK};font-family:${FONT}">
        ${esc(q.label || `Option ${i + 1}`)}
      </p>
      ${q.parkName ? `<p style="margin:6px 0 0;font-size:13px;color:${GREY}">${esc(q.parkName)}</p>` : ''}
      <p style="margin:16px 0 0;font-size:30px;font-weight:700;color:${INK};letter-spacing:-.02em">${fmt(q.totals.grandTotal)}</p>
      ${showTicker && parts.length ? `<p style="margin:6px 0 0;font-size:12px;color:${LIGHT}">${esc(parts.join(' · '))}</p>` : ''}
    </div>`
  }).join('')
}

function sectionHTML({ section, quotes, gridCols, showPrices, showImages, zh, band = false, screen = false }) {
  const title = zh && section.nameZh ? section.nameZh : section.name
  // On screen the sections get alternating bands and hairline rules between
  // columns, so a long comparison reads as a structured table rather than
  // floating text. Print keeps the plain white sheet.
  const bg   = screen && band ? 'background:#fafafa;' : ''
  const cell = screen ? 'class="cmp-cell"' : ''
  return `
    <div style="text-align:center;padding:${screen ? '22px 0 8px' : '32px 0 10px'};${bg}">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${GREY}">${esc(title)}</span>
    </div>
    <div style="display:grid;grid-template-columns:${gridCols};${bg}">
      ${quotes.map(q => {
        const entries = section.byQuote[q.id] || []
        const pad = screen ? '4px 20px 18px' : '6px 24px 24px'
        if (!entries.length) {
          return `<div ${cell} style="text-align:center;padding:${pad};"><span style="font-size:13px;color:${FAINT}">${zh ? '未包含' : 'Not included'}</span></div>`
        }
        return `
        <div ${cell} style="text-align:center;padding:${pad};">
          ${entries.map(e => `
            <div style="margin-bottom:14px">
              ${showImages && e.imageUrl ? `<img src="${esc(e.imageUrl)}" style="max-width:220px;width:100%;height:auto;object-fit:contain;border-radius:10px;background:#f5f5f7;margin-bottom:10px">` : ''}
              <p style="margin:0;font-size:16px;font-weight:600;color:${INK};line-height:1.4">${esc(e.name)}${e.quantity > 1 ? ` × ${e.quantity}` : ''}</p>
              ${zh && e.nameZh && e.nameZh !== e.name ? `<p style="margin:2px 0 0;font-size:12px;color:${LIGHT}">${esc(e.nameZh)}</p>` : ''}
              ${e.description ? `<p style="margin:4px 0 0;font-size:13px;color:${GREY};line-height:1.4">${esc(e.description)}</p>` : ''}
              ${showPrices ? `<p style="margin:3px 0 0;font-size:13px;color:${GREY}">${e.waived ? (zh ? '已減免' : 'Waived') : fmt(e.amount)}</p>` : ''}
            </div>`).join('')}
        </div>`
      }).join('')}
    </div>`
}

const GREEN = '#059669'

function summaryHTML({ quotes, gridCols, zh, screen = false }) {
  const cell = screen ? 'class="cmp-cell"' : ''
  const BOX = 'background:#f5f5f7;border:1px solid #e5e5e5;border-radius:8px;padding:12px;font-size:13px;'
  const row = (label, value, colour = '#6b6b6b', weight = '600') => `
    <div style="display:flex;justify-content:space-between;gap:12px;margin-bottom:6px;color:${colour}">
      <span>${esc(label)}</span><span style="font-weight:${weight}">${esc(value)}</span>
    </div>`
  return `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${GREY}">${zh ? '費用明細' : 'Summary'}</span>
    </div>
    <div style="display:grid;grid-template-columns:${gridCols};">
      ${quotes.map(q => {
        const t = q.totals
        return `
        <div ${cell} style="padding:4px 20px 22px;">
          <div style="${BOX}">
            ${row(zh ? '小計' : 'Subtotal', fmt(t.subtotal))}
            ${t.waiveAmount > 0 ? row(q.manualWaiveName || (zh ? '減免' : 'Waived'), `− ${fmt(t.waiveAmount)}`, GREEN) : ''}
            ${t.percentSavings > 0 ? row(`${zh ? '折扣' : 'Discount'} ${q.discountPercent}%`, `− ${fmt(t.percentSavings)}`, GREEN) : ''}
            ${t.gstTotal > 0 ? row(`GST ${pct(q.gstRate, 0.05)}`, fmt(t.gstTotal), LIGHT) : ''}
            ${t.pstTotal > 0 ? row(`PST ${pct(q.pstRate, 0.07)}`, fmt(t.pstTotal), LIGHT) : ''}
            <div style="display:flex;justify-content:space-between;gap:12px;border-top:1px solid #e5e5e5;padding-top:8px;margin-top:8px;">
              <span style="font-weight:600;color:#3a3a3c">${zh ? '總額' : 'Total'}</span>
              <span style="font-size:16px;font-weight:700;color:${INK}">${fmt(t.grandTotal)}</span>
            </div>
          </div>
        </div>`
      }).join('')}
    </div>`
}

function paymentHTML({ quotes, gridCols, zh, screen = false }) {
  const cell = screen ? 'class="cmp-cell"' : ''
  if (!quotes.some(q => q.isMonthlyPaymentEnabled && q.plan?.monthly > 0)) return ''
  const BOX = 'background:#f5f5f7;border:1px solid #e5e5e5;border-radius:8px;padding:10px 12px;font-size:12px;'
  const ROW = 'display:flex;justify-content:space-between;color:#6b6b6b;'
  const VAL = 'font-weight:600;color:#3a3a3c;'
  return `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${GREY}">${zh ? '付款方式' : 'Payment Options'}</span>
    </div>
    <div style="display:grid;grid-template-columns:${gridCols};">
      ${quotes.map(q => {
        if (!q.isMonthlyPaymentEnabled || !(q.plan?.monthly > 0)) {
          return `<div ${cell} style="padding:6px 20px 22px;text-align:center;"><span style="font-size:13px;color:${FAINT}">${zh ? '一次付清' : 'Paid in full'}</span></div>`
        }
        return `
        <div ${cell} style="padding:6px 20px 22px;">
          <div style="${BOX}">
            <div style="${ROW}"><span>${zh ? '首期' : 'Deposit'}</span><span style="${VAL}">${fmt(q.plan.deposit)}</span></div>
            <div style="${ROW}border-top:1px solid #e5e5e5;padding-top:6px;margin-top:6px;">
              <span>${zh ? '融資額' : 'Financed balance'}</span><span style="${VAL}">${fmt(q.plan.financed)}</span>
            </div>
          </div>
          <p style="margin:14px 0 0;text-align:center;font-size:26px;font-weight:700;color:${INK};letter-spacing:-.02em">${fmt(q.plan.monthly)}</p>
          <p style="margin:2px 0 0;text-align:center;font-size:12px;color:${GREY}">
            ${zh ? `每月 · 共 ${q.plan.months} 期` : `per month · ${q.plan.months} months`}${Number(q.interestRate) > 0 ? ` · ${q.interestRate}%` : ''}
          </p>
        </div>`
      }).join('')}
    </div>`
}

function body(props) {
  const { sections, quotes, gridCols, screen = false } = props
  return sections.map((section, i) =>
      sectionHTML({ ...props, section, band: i % 2 === 1, screen })).join('')
    + summaryHTML({ quotes, gridCols, zh: props.zh, screen })
    + paymentHTML({ quotes, gridCols, zh: props.zh, screen })
}

/** Print sheet: fixed 960px, equal columns. */
export function buildCemeteryPrintHTML(props) {
  const gridCols = `repeat(${props.quotes.length},minmax(0,1fr))`
  return `
    <div style="font-family:${FONT};max-width:960px;margin:0 auto;color:${INK}">
      <div style="display:grid;grid-template-columns:${gridCols};">
        ${headerCells({ ...props, gridCols })}
      </div>
      ${body({ ...props, gridCols })}
    </div>`
}

/**
 * Shared link / on-screen preview.
 *
 * This is the version shown on a monitor, so unlike the print sheet it is
 * sized for a screen: the whole comparison is a centred card of bounded
 * width. Previously the wrapper was `width:100%`, so on a wide display two
 * columns stretched to the screen edges with their content centred in each,
 * leaving a canyon of empty space down the middle.
 *
 * Columns are capped at COL_MAX and the card never exceeds the room they
 * need, so it stays compact on a large monitor and still scrolls sideways on
 * a phone.
 */
export function buildCemeteryWebHTML(props) {
  const n       = props.quotes.length
  const COL_MIN = 260
  const COL_MAX = 330
  const GUTTER  = 48

  const gridCols = `repeat(${n},minmax(${COL_MIN}px,1fr))`
  const cardMax  = n * COL_MAX + GUTTER

  return `<!DOCTYPE html>
<html lang="${props.zh ? 'zh-Hant' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(props.title || 'Cemetery Quote Comparison')}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    html,body{background:#f5f5f7;font-family:${FONT};color:${INK};-webkit-font-smoothing:antialiased}
    body{padding:28px 20px 56px}
    .card{
      max-width:${cardMax}px;margin:0 auto;background:#fff;
      border:1px solid #e8e8ea;border-radius:16px;overflow:hidden;
      box-shadow:0 1px 2px rgba(0,0,0,.04),0 10px 30px rgba(0,0,0,.05);
    }
    .scroll{overflow-x:auto}
    .inner{min-width:${n * COL_MIN}px}
    .sticky{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #e8e8ea}
    .hgrid{display:grid;grid-template-columns:${gridCols}}
    /* hairline between columns, so a long list stays readable across */
    .cmp-cell + .cmp-cell{box-shadow:inset 1px 0 0 #efeff1}
    .foot{max-width:${cardMax}px;margin:14px auto 0;text-align:center;font-size:11px;color:#a1a1aa}
    @media print{
      html,body{background:#fff}
      body{padding:0}
      .card{max-width:none;border:0;border-radius:0;box-shadow:none}
      .sticky{position:static}
      .foot{display:none}
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="scroll"><div class="inner">
      <div class="sticky"><div class="hgrid">${headerCells({ ...props, gridCols, cellPadding: '20px 16px 20px' })}</div></div>
      ${body({ ...props, gridCols, screen: true })}
    </div></div>
  </div>
  ${props.title ? `<p class="foot">${esc(props.title)}</p>` : ''}
</body>
</html>`
}
