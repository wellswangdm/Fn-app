import { useMemo } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Comparison table (presentational)
//
// Split out from CemeteryCompare so it can be rendered with fixture data and
// proven not to break as the number of quotes or items grows.
//
// Why the old comparison broke: it measured content and guessed at font sizes,
// padding and image heights to force every column into the viewport
// (isDenseCompare / comparisonScale / compareImgHeight). Past about three
// quotes or a handful of items the guesses stopped holding.
//
// This version never guesses. Columns have a fixed width and the container
// scrolls horizontally with the item column pinned, so the layout is the same
// for two quotes as for six, with three items or forty.
// ─────────────────────────────────────────────────────────────────────────────

const MS = 'Merchandise and Services'
const COL = 'min-w-[180px] w-[180px]'

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

/** Align lines across quotes on (section, name). */
export function buildComparisonRows(quotes) {
  const keyOf = l => `${l.section}\u0000${l.name}`
  const order = []
  const seen  = new Set()
  for (const q of quotes) {
    for (const l of q.items) {
      const k = keyOf(l)
      if (!seen.has(k)) {
        seen.add(k)
        order.push({ key: k, section: l.section, name: l.name, nameZh: l.nameZh })
      }
    }
  }
  const rank = s => (s === 'Property' ? 0 : s === MS ? 1 : 2)
  order.sort((a, b) => rank(a.section) - rank(b.section))

  return order.map(o => {
    const cells = quotes.map(q => {
      const hits = q.items.filter(l => keyOf(l) === o.key)
      if (hits.length === 0) return null
      return {
        amount:   hits.reduce((s, l) => s + (l.isWaived ? 0 : l.lineTotal), 0),
        waived:   hits.every(l => l.isWaived),
        quantity: hits.reduce((s, l) => s + l.quantity, 0),
      }
    })
    const present = cells.filter(Boolean)
    const differs = present.length !== quotes.length ||
      new Set(present.map(c => `${c.amount}|${c.waived}`)).size > 1
    return { ...o, cells, differs }
  })
}

export default function CemeteryCompareTable({ quotes = [], zh = false, onlyDiffs = false }) {
  const rows = useMemo(() => buildComparisonRows(quotes), [quotes])
  const visible = onlyDiffs ? rows.filter(r => r.differs) : rows

  const sections = [
    ['Property', zh ? '墓地選擇' : 'Property'],
    [MS,         zh ? '服務及項目' : 'Merchandise & Services'],
  ]

  if (quotes.length === 0) return null

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-stone-50 border-b border-r border-stone-200
                             px-4 py-3 text-left text-[11px] font-semibold uppercase
                             tracking-wider text-stone-500 min-w-[220px]">
                {zh ? '項目' : 'Item'}
              </th>
              {quotes.map((q, i) => (
                <th key={q.id ?? i}
                    className={`${COL} bg-stone-50 border-b border-stone-200 px-4 py-3 text-center`}>
                  <span className="block text-sm font-bold text-stone-800 truncate">
                    {q.clientName || q.templateName || `Option ${i + 1}`}
                  </span>
                  <span className="block text-lg font-bold text-primary-800 mt-1">
                    {fmt(q.totals.grandTotal)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sections.map(([sec, title]) => {
              const secRows = visible.filter(r => r.section === sec)
              if (secRows.length === 0) return null
              return [
                <tr key={`${sec}-h`}>
                  <td colSpan={quotes.length + 1}
                      className="sticky left-0 bg-stone-100/70 px-4 py-1.5 text-[10px]
                                 font-semibold uppercase tracking-widest text-stone-500">
                    {title}
                  </td>
                </tr>,
                ...secRows.map(r => (
                  <tr key={r.key} className="border-b border-stone-100" style={{ breakInside: 'avoid' }}>
                    <td className={`sticky left-0 z-10 border-r border-stone-200 px-4 py-2
                                    text-[13px] align-top ${
                        r.differs ? 'bg-amber-50 text-stone-800 font-medium'
                                  : 'bg-white text-stone-600'}`}>
                      {zh ? (r.nameZh || r.name) : r.name}
                    </td>
                    {r.cells.map((c, i) => (
                      <td key={i}
                          className={`${COL} px-4 py-2 text-center text-[13px] align-top ${
                            c == null ? 'text-stone-300' : 'text-stone-700'} ${
                            r.differs ? 'bg-amber-50/40' : ''}`}>
                        {c == null ? '—'
                          : c.waived
                            ? <span className="text-emerald-700">{zh ? '已減免' : 'Waived'}</span>
                            : <>
                                {fmt(c.amount)}
                                {c.quantity > 1 && <span className="text-stone-400"> ×{c.quantity}</span>}
                              </>}
                      </td>
                    ))}
                  </tr>
                )),
              ]
            })}
          </tbody>

          <tfoot>
            <FootRow label={zh ? '小計' : 'Subtotal'} quotes={quotes} value={q => fmt(q.totals.subtotal)} />
            <FootRow label={zh ? '減免' : 'Waived'} quotes={quotes} muted
                     value={q => q.totals.waiveAmount > 0 ? `− ${fmt(q.totals.waiveAmount)}` : '—'} />
            <FootRow label={zh ? '折扣' : 'Discount'} quotes={quotes} muted
                     value={q => q.totals.percentSavings > 0
                       ? `− ${fmt(q.totals.percentSavings)}` : '—'} />
            <FootRow label={zh ? '稅項' : 'Tax'} quotes={quotes} muted
                     value={q => fmt(q.totals.taxTotal)} />
            <FootRow label={zh ? '總額' : 'Total'} quotes={quotes} strong
                     value={q => fmt(q.totals.grandTotal)} />
            {quotes.some(q => q.isMonthlyPaymentEnabled && q.plan?.monthly > 0) && (
              <FootRow label={zh ? '每月付款' : 'Monthly'} quotes={quotes}
                       value={q => q.isMonthlyPaymentEnabled && q.plan?.monthly > 0
                         ? `${fmt(q.plan.monthly)} × ${q.plan.months}` : '—'} />
            )}
          </tfoot>
        </table>
      </div>

      {rows.some(r => r.differs) && (
        <p className="px-4 py-2 text-[11px] text-stone-400 border-t border-stone-100 print:hidden">
          {zh ? '淺黃色行表示各方案之間有差異。' : 'Rows shaded amber differ between options.'}
        </p>
      )}
    </div>
  )
}

function FootRow({ label, quotes, value, strong, muted }) {
  return (
    <tr className={`border-t ${strong ? 'border-stone-800 border-t-2' : 'border-stone-200'}`}
        style={{ breakInside: 'avoid' }}>
      <td className={`sticky left-0 z-10 bg-white border-r border-stone-200 px-4 py-2 text-[13px] ${
          strong ? 'font-bold text-stone-900' : muted ? 'text-stone-500' : 'text-stone-700'}`}>
        {label}
      </td>
      {quotes.map((q, i) => (
        <td key={q.id ?? i}
            className={`${COL} px-4 py-2 text-center text-[13px] ${
              strong ? 'font-bold text-primary-800 text-base'
                     : muted ? 'text-stone-500' : 'text-stone-700'}`}>
          {value(q)}
        </td>
      ))}
    </tr>
  )
}
