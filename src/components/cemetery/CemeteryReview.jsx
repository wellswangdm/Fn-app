import { useState } from 'react'
import { orderedLines } from '../../lib/cemeteryTotals.js'
import { useChineseMode } from '../../lib/useChineseMode.js'
import { termsFor } from '../../lib/cemeteryTerms.js'

// ─────────────────────────────────────────────────────────────────────────────
// Cemetery quote review / print sheet
//
// The old app forced everything onto one page by measuring item counts and
// shrinking fonts and images to fit (isDense / getAdaptiveImageHeight /
// containerPaddingClass). That is what broke when a quote grew.
//
// Here the sheet is a normal A4-width document that reflows, and PRINT
// pagination is left to the browser with `break-inside: avoid` on each row so
// lines are never cut in half. Font size stays an explicit choice rather than
// something the layout guesses at.
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

/** Tax rate as a label. Never render NaN% on something a family reads. */
function pct(rate, fallback) {
  const n = Number(rate)
  return `${((Number.isFinite(n) && n > 0 ? n : fallback) * 100).toFixed(0)}%`
}

const SIZES = {
  standard: { body: 'text-[12px]', row: 'py-1.5', head: 'text-[11px]' },
  medium:   { body: 'text-[13px]', row: 'py-2',   head: 'text-[12px]' },
  large:    { body: 'text-[15px]', row: 'py-2.5', head: 'text-[13px]' },
}

export default function CemeteryReview({ park, quote, lines, totals, plan, onClose }) {
  const [size, setSize] = useState('standard')
  // Language is chosen HERE, at the point the quote is shown, rather than
  // being baked into the quote when it was built. Two quotes saved at
  // different times always display in the same language.
  const [zh, setZh] = useChineseMode()
  const S = SIZES[size]

  const hasPlan  = !!quote.isMonthlyPaymentEnabled && plan?.monthly > 0
  const ordered  = orderedLines(lines)
  const property = ordered.filter(l => l.section === 'Property')
  const ms       = ordered.filter(l => l.section !== 'Property')

  const label = l => (zh ? (l.nameZh || l.name) : l.name)

  const groups = [
    [zh ? '墓地選擇' : 'Property',               property],
    [zh ? '服務及項目' : 'Merchandise & Services', ms],
  ].filter(([, g]) => g.length > 0)

  return (
    <div className="min-h-screen bg-stone-100">

      {/* Controls — never printed */}
      <div className="print:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
          <button onClick={onClose} className="btn-ghost">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            {zh ? '返回編輯' : 'Back to editor'}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setZh(!zh)} className="btn-secondary text-xs">
              {zh ? 'English' : '中文'}
            </button>
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider ml-1">
              {zh ? '字體' : 'Font'}
            </span>
            <select value={size} onChange={e => setSize(e.target.value)}
                    className="input text-xs w-28 py-1.5">
              <option value="standard">Standard</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <button onClick={() => window.print()} className="btn-primary text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />
              </svg>
              {zh ? '列印' : 'Print'}
            </button>
          </div>
        </div>
      </div>

      {/* A4 sheet */}
      <div className="py-6 px-3 print:p-0">
        <div id="print-zone"
             className={`mx-auto bg-white shadow-sm print:shadow-none border border-stone-200
                         print:border-0 ${S.body} text-stone-800`}
             style={{ maxWidth: '210mm', padding: '14mm' }}>

          {/* Letterhead: park supplies name + address, advisor supplies the rest */}
          <header className="flex justify-between items-start gap-6 pb-4 border-b border-stone-300">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-stone-900">{park.name}</h1>
              {park.address && <p className="text-[11px] text-stone-500 mt-0.5">{park.address}</p>}
              {park.phone   && <p className="text-[11px] text-stone-500">{park.phone}</p>}
            </div>
            {/* Advisor sits in the letterhead; the Quotation/date block it
                replaced was repeating what the page already says. */}
            <div className="text-right shrink-0">
              {quote.advisorName && (
                <p className="font-semibold text-stone-800">{quote.advisorName}</p>
              )}
              {quote.advisorPhone && <p className="text-[11px] text-stone-500">{quote.advisorPhone}</p>}
              {quote.advisorEmail && <p className="text-[11px] text-stone-500">{quote.advisorEmail}</p>}
            </div>
          </header>

          {/* Client on one slim line, and only when there is one — the old
              block left a "—" and a row of dead space on most quotes. */}
          {(quote.clientName || quote.clientPhone || quote.clientEmail) && (
            <p className="text-[11px] text-stone-500 pt-2.5">
              <span className="font-semibold uppercase tracking-widest text-stone-400 mr-2">
                {zh ? '客戶' : 'Prepared for'}
              </span>
              <span className="font-semibold text-stone-700">{quote.clientName}</span>
              {[quote.clientPhone, quote.clientEmail].filter(Boolean).map((v, i) => (
                <span key={i} className="text-stone-500"> · {v}</span>
              ))}
            </p>
          )}

          {quote.imageUrl && (
            <div className="pt-4 pb-1" style={{ breakInside: 'avoid' }}>
              <img src={quote.imageUrl} alt=""
                   className="w-full object-contain rounded"
                   style={{ height: quote.imageHeight || 320 }} />
            </div>
          )}

          {/* Line items */}
          <div className="pt-4">
          {groups.map(([title, group]) => (
            <section key={title} className="mb-4">
              <h2 className={`${S.head} font-semibold uppercase tracking-widest text-stone-500
                              bg-stone-50 px-2 py-1.5 rounded`}>
                {title}
              </h2>
              <table className="w-full border-collapse">
                <tbody>
                  {group.map(l => (
                    <tr key={l.id} className="border-b border-stone-100"
                        style={{ breakInside: 'avoid' }}>
                      <td className={`${S.row} pr-3 align-top`}>
                        <span className={l.isWaived ? 'line-through text-stone-400' : ''}>
                          {label(l)}
                        </span>
                        {l.quantity > 1 && (
                          <span className="text-stone-400"> × {l.quantity}</span>
                        )}
                      </td>
                      <td className={`${S.row} text-right align-top whitespace-nowrap w-28`}>
                        {l.isWaived ? (
                          <span className="text-emerald-700 font-medium">
                            {zh ? '已減免' : 'Waived'}
                          </span>
                        ) : fmt(l.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
          </div>

          {/* Payment plan sits beside the totals rather than under them —
              the column to the left of a totals block is otherwise dead space. */}
          <section className="flex flex-col sm:flex-row sm:items-start gap-5 pt-1"
                   style={{ breakInside: 'avoid' }}>

            {hasPlan ? (
              <div className="flex-1 bg-stone-50 rounded p-3 self-stretch">
                <h2 className={`${S.head} font-semibold uppercase tracking-widest text-stone-500 mb-2`}>
                  {zh ? '分期付款' : 'Payment plan'}
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Cell label={zh ? '首期' : 'Deposit'}   value={fmt(plan.deposit)} />
                  <Cell label={zh ? '融資額' : 'Financed'} value={fmt(plan.financed)} />
                  <Cell label={`${plan.months} ${zh ? '個月' : 'months'}`}
                        value={fmt(plan.monthly)} strong />
                  <Cell label={zh ? '總付款' : 'Total paid'} value={fmt(plan.totalPaid)} />
                </div>
                {Number(quote.interestRate) > 0 && (
                  <p className="text-[10px] text-stone-400 mt-2">
                    {zh ? '年利率' : 'Annual rate'} {quote.interestRate}%
                  </p>
                )}
              </div>
            ) : <div className="flex-1" />}

            <dl className="w-full sm:w-72 shrink-0 space-y-1">
              <Line label={zh ? '小計' : 'Subtotal'} value={fmt(totals.subtotal)} />
              {totals.waiveAmount > 0 && (
                <Line label={quote.manualWaiveName || (zh ? '減免' : 'Waived')}
                      value={`− ${fmt(totals.waiveAmount)}`} muted />
              )}
              {totals.percentSavings > 0 && (
                <Line label={`${quote.discountPercent}% ${zh ? '折扣' : 'discount'}`}
                      value={`− ${fmt(totals.percentSavings)}`} muted />
              )}
              {/* A zero tax line is noise on a printed quote */}
              {totals.gstTotal > 0 && (
                <Line label={`GST (${pct(quote.gstRate, 0.05)})`} value={fmt(totals.gstTotal)} muted />
              )}
              {totals.pstTotal > 0 && (
                <Line label={`PST (${pct(quote.pstRate, 0.07)})`} value={fmt(totals.pstTotal)} muted />
              )}
              <div className="flex justify-between items-baseline pt-2 mt-1 border-t-2 border-stone-800">
                <dt className="font-bold text-stone-900">{zh ? '總額' : 'Total'}</dt>
                <dd className="text-lg font-bold text-stone-900">{fmt(totals.grandTotal)}</dd>
              </div>
            </dl>
          </section>

          {termsFor(quote.terms, zh) && (
            <footer className="mt-6 pt-3 border-t border-stone-200" style={{ breakInside: 'avoid' }}>
              <p className="text-[10px] text-stone-400 leading-relaxed whitespace-pre-line">
                {termsFor(quote.terms, zh)}
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

function Line({ label, value, muted }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={muted ? 'text-stone-500' : 'text-stone-600'}>{label}</dt>
      <dd className={muted ? 'text-stone-500' : 'text-stone-800'}>{value}</dd>
    </div>
  )
}

function Cell({ label, value, strong }) {
  return (
    <div>
      <p className="text-[10px] text-stone-400 uppercase tracking-wider">{label}</p>
      <p className={strong ? 'font-bold text-stone-900' : 'text-stone-700'}>{value}</p>
    </div>
  )
}
