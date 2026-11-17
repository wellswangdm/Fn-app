// ─────────────────────────────────────────────────────────────────────────────
// Cemetery comparison — the customer-facing presentation.
//
// Deliberately the same shape as the funeral portal's ComparisonView: one
// column per option, a large total at the top of each, then centred sections
// with the item name, its Chinese name beneath, and the price in light grey.
//
// This is what a family looks at. It is not a diff table.
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

/** Tax rate as a label. Never render NaN% on something a family reads. */
function pct(rate, fallback) {
  const n = Number(rate)
  return `${((Number.isFinite(n) && n > 0 ? n : fallback) * 100).toFixed(0)}%`
}

export default function CemeteryCompareSheet({
  quotes = [], sections = [],
  showPrices = true, showImages = true, showTicker = true, showPayment = true,
  zh = false,
}) {
  if (quotes.length === 0) return null

  const cols      = quotes.length
  const gridStyle = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
  const hasPlans  = quotes.some(q => q.isMonthlyPaymentEnabled && q.plan?.monthly > 0)

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: cols > 2 ? `${cols * 240}px` : undefined }}>

        {/* Column headers */}
        <div className="grid" style={gridStyle}>
          {quotes.map((q, i) => {
            const parts = [
              q.totals.waiveAmount    > 0 && `${fmt(q.totals.waiveAmount)} waived`,
              q.totals.percentSavings > 0 && `${fmt(q.totals.percentSavings)} off`,
              q.totals.taxTotal       > 0 && `${fmt(q.totals.taxTotal)} tax incl.`,
            ].filter(Boolean)
            return (
              <div key={q.id} className="px-8 pt-7 pb-6 text-center">
                <p className="text-2xl font-bold text-stone-900">
                  {q.label || `Option ${i + 1}`}
                </p>
                {q.parkName && <p className="text-sm text-stone-400 mt-1.5">{q.parkName}</p>}
                <p className="text-4xl font-bold text-stone-900 mt-4 tracking-tight">
                  {fmt(q.totals.grandTotal)}
                </p>
                {showTicker && parts.length > 0 && (
                  <p className="text-xs text-stone-400 mt-1.5">{parts.join(' · ')}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Sections */}
        {sections.map(section => (
          <div key={section.id}>
            <div className="pt-8 pb-2 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                {zh && section.nameZh ? section.nameZh : section.name}
              </span>
            </div>
            <div className="grid" style={gridStyle}>
              {quotes.map(q => {
                const entries = section.byQuote[q.id] || []
                return (
                  <div key={q.id} className="px-8 pb-8 text-center">
                    {entries.length === 0 ? (
                      <p className="text-sm text-stone-300 mt-4">
                        {zh ? '未包含' : 'Not included'}
                      </p>
                    ) : entries.map((e, i) => (
                      <div key={i} className="mt-4 flex flex-col items-center gap-1.5">
                        {showImages && e.imageUrl && (
                          <img src={e.imageUrl} alt={e.name}
                               className="max-w-[220px] w-full object-contain rounded-xl bg-stone-50 max-h-48" />
                        )}
                        {/* English stays primary with Chinese beneath, as in the
                            funeral portal. Swapping them loses meaning here: every
                            vase in the price list shares the CHI value 花瓶. */}
                        <p className="text-base font-semibold text-stone-800 leading-snug">
                          {e.name}
                          {e.quantity > 1 && <span className="text-stone-400"> × {e.quantity}</span>}
                        </p>
                        {zh && e.nameZh && e.nameZh !== e.name && (
                          <p className="text-xs text-stone-400 leading-tight">{e.nameZh}</p>
                        )}
                        {e.description && (
                          <p className="text-xs text-stone-400 leading-tight max-w-[220px]">{e.description}</p>
                        )}
                        {showPrices && (
                          <p className="text-sm text-stone-400">
                            {e.waived ? (zh ? '已減免' : 'Waived') : fmt(e.amount)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Summary — the breakdown behind each column's headline figure */}
        <div>
          <div className="pt-8 pb-2 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
              {zh ? '費用明細' : 'Summary'}
            </span>
          </div>
          <div className="grid" style={gridStyle}>
            {quotes.map(q => {
              const t = q.totals
              return (
                <div key={q.id} className="px-6 pb-8 pt-1">
                  <dl className="bg-stone-50 rounded-lg p-3 border border-stone-100 text-[13px] space-y-1.5">
                    <Row label={zh ? '小計' : 'Subtotal'} value={fmt(t.subtotal)} />
                    {t.waiveAmount > 0 && (
                      <Row label={q.manualWaiveName || (zh ? '減免' : 'Waived')}
                           value={`− ${fmt(t.waiveAmount)}`} green />
                    )}
                    {t.percentSavings > 0 && (
                      <Row label={`${zh ? '折扣' : 'Discount'} ${q.discountPercent}%`}
                           value={`− ${fmt(t.percentSavings)}`} green />
                    )}
                    {t.gstTotal > 0 && (
                      <Row label={`GST ${pct(q.gstRate, 0.05)}`} value={fmt(t.gstTotal)} muted />
                    )}
                    {t.pstTotal > 0 && (
                      <Row label={`PST ${pct(q.pstRate, 0.07)}`} value={fmt(t.pstTotal)} muted />
                    )}
                    <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-stone-200">
                      <dt className="font-semibold text-stone-700">{zh ? '總額' : 'Total'}</dt>
                      <dd className="text-base font-bold text-stone-900">{fmt(t.grandTotal)}</dd>
                    </div>
                  </dl>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment options */}
        {showPayment && hasPlans && (
          <div>
            <div className="pt-8 pb-2 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                {zh ? '付款方式' : 'Payment Options'}
              </span>
            </div>
            <div className="grid" style={gridStyle}>
              {quotes.map(q => (
                <div key={q.id} className="px-6 pb-8 pt-3">
                  {q.isMonthlyPaymentEnabled && q.plan?.monthly > 0 ? (
                    <>
                      <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100 text-[11px] space-y-1">
                        <div className="flex justify-between text-stone-500">
                          <span>{zh ? '首期' : 'Deposit'}</span>
                          <span className="font-semibold text-stone-700">{fmt(q.plan.deposit)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500 border-t border-stone-200 pt-1">
                          <span>{zh ? '融資額' : 'Financed balance'}</span>
                          <span className="font-semibold text-stone-700">{fmt(q.plan.financed)}</span>
                        </div>
                      </div>
                      <p className="text-center text-[26px] font-bold text-stone-900 mt-3.5 tracking-tight">
                        {fmt(q.plan.monthly)}
                      </p>
                      <p className="text-center text-xs text-stone-400 mt-0.5">
                        {zh ? `每月 · 共 ${q.plan.months} 期` : `per month · ${q.plan.months} months`}
                        {Number(q.interestRate) > 0 && ` · ${q.interestRate}%`}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-stone-300 text-center mt-4">
                      {zh ? '一次付清' : 'Paid in full'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  )
}

function Row({ label, value, green, muted }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className={green ? 'text-emerald-600' : muted ? 'text-stone-400' : 'text-stone-500'}>
        {label}
      </dt>
      <dd className={green ? 'text-emerald-600 font-semibold'
                           : muted ? 'text-stone-400' : 'font-semibold text-stone-700'}>
        {value}
      </dd>
    </div>
  )
}
