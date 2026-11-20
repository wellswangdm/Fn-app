import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { calcAge, getPaymentPlans, getMonthlyPlans, MONTHLY_THRESHOLD } from '../lib/paymentPlans.js'
import { GST_RATE, PST_RATE } from '../lib/calcTotals.js'
import { useTranslations } from '../lib/useTranslations.js'
import { useChineseMode } from '../lib/useChineseMode.js'

const SIZES = {
  standard: { body: 'text-[12px]', row: 'py-1.5', head: 'text-[11px]' },
  medium:   { body: 'text-[13px]', row: 'py-2',   head: 'text-[12px]' },
  large:    { body: 'text-[15px]', row: 'py-2.5', head: 'text-[13px]' },
}

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function openPrintWindow() {
  const zone = document.getElementById('print-zone')
  if (!zone) return

  // Collect the page's styles so Tailwind applies in the new window. Both
  // forms matter: a built app serves a <link>, but a dev server (and anything
  // else that inlines CSS) injects <style> tags — those were being dropped, so
  // the print window came up completely unstyled.
  const stylesheets = [
    ...Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(l => `<link rel="stylesheet" href="${l.href}">`),
    ...Array.from(document.querySelectorAll('style'))
      .map(s => `<style>${s.innerHTML}</style>`),
  ].join('\n')

  const win = window.open('', '_blank')
  if (!win) { alert('Allow popups for this site to print.'); return }

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- A fixed 1024px layout viewport, NOT device-width. The on-screen quote
       restacks below Tailwind's sm: breakpoint so it is readable on a phone;
       the printed sheet must never do that. Pinning the width here means the
       PDF is the paper layout whether it was sent from a desktop or a phone. -->
  <meta name="viewport" content="width=1024">
  ${stylesheets}
  <style>
    body { margin: 0; padding: 24px; background: #fff; width: 1024px; }
    /* size:auto uses whatever paper is loaded rather than fitting a named
       page box inside it and shrinking everything. */
    @page { size: auto; margin: 12mm; }
    @media print { body { padding: 0; width: auto; } }
  </style>
</head>
<body>
  ${zone.outerHTML}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 400);
    });
  <\/script>
</body>
</html>`)
  win.document.close()
}

export default function PrintView({ home, state, attachedImage, onClose, paymentTerms }) {
  const {
    quoteNumber, advisorName, advisorEmail, advisorPhone,
    items, sections, selectedCasket, packageName, arrangementType,
    subtotal, discountType, discountValue,
    pkgDiscAmount, userDiscAmount, discountAmount,
    gstAmount, pstAmount, notes,
    beneficiaryName, beneficiaryBirthdate,
  } = state

  const total = subtotal - discountAmount + gstAmount + pstAmount
  const [showPayment,  setShowPayment]  = useState(false)
  // Advisors show this on screen to a family; font size is an explicit
  // choice here rather than something the layout guesses at.
  const [size, setSize] = useState('standard')
  const S = SIZES[size]
  const [shareStatus,  setShareStatus]  = useState(null) // null | 'uploading' | 'done' | 'error'
  const translations = useTranslations()
  const [showChinese, setShowChinese] = useChineseMode()

  async function handleShare() {
    if (shareStatus === 'uploading') return
    const zone = document.getElementById('print-zone')
    if (!zone) return
    setShareStatus('uploading')
    try {
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map(l => `<link rel="stylesheet" href="${l.href}">`)
        .join('\n')
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${stylesheets}
  <style>body{margin:0;padding:24px;background:#fff}</style>
</head>
<body>${zone.outerHTML}</body>
</html>`
      const { data, error } = await supabase
        .from('comparison_shares')
        .insert({ html })
        .select('id')
        .single()
      if (error) throw error
      await navigator.clipboard.writeText(`${window.location.origin}/share/${data.id}`)
      setShareStatus('done')
      setTimeout(() => setShareStatus(null), 4000)
    } catch (e) {
      console.error('Share failed:', e?.message ?? e)
      setShareStatus('error')
      setTimeout(() => setShareStatus(null), 3000)
    }
  }

  const today = new Date().toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const activeSections = (sections || []).filter(sec =>
    items.some(i => (i.sectionId || 'sec-extra') === sec.id)
  )
  const unsectioned = items.filter(i =>
    !(sections || []).some(s => s.id === (i.sectionId || 'sec-extra'))
  )

  return (
    // A page of its own, as the cemetery review is — not an overlay floating
    // on top of the builder.
    <div className="min-h-screen bg-stone-100">

      {/* Controls — never printed */}
      <div className="print:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
          <button onClick={onClose} className="btn-ghost">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to editor
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button onClick={() => setShowChinese(!showChinese)} className="btn-secondary text-xs">
              {showChinese ? 'English' : '中文'}
            </button>
            <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer select-none">
              <input type="checkbox" checked={showPayment}
                     onChange={e => setShowPayment(e.target.checked)} className="rounded" />
              Payment options
            </label>
            <span className="hidden sm:inline text-[11px] font-semibold text-stone-400 uppercase tracking-wider ml-1">
              Font
            </span>
            <select value={size} onChange={e => setSize(e.target.value)}
                    className="input text-xs w-24 sm:w-28 py-1.5">
              <option value="standard">Standard</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <button
              onClick={handleShare}
              disabled={shareStatus === 'uploading'}
              className={`btn-secondary text-xs whitespace-nowrap disabled:opacity-50
                ${shareStatus === 'done'  ? 'text-emerald-600 border-emerald-300' :
                  shareStatus === 'error' ? 'text-red-500 border-red-300' : ''}`}
            >
              {shareStatus === 'uploading' ? 'Uploading…' :
               shareStatus === 'done'      ? 'Link copied!' :
               shareStatus === 'error'     ? 'Error — retry?' :
               'Share link'}
            </button>
            <button onClick={openPrintWindow} className="btn-primary text-xs whitespace-nowrap">
              <span className="sm:hidden">PDF</span>
              <span className="hidden sm:inline">Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="py-6 px-3 sm:px-4 print:p-0">
        {/* On screen this is a sheet of paper, so it keeps an A4-ish width and
            its own padding. On paper both come off: the width is whatever the
            page gives it, and the margin comes solely from @page, so the two
            never stack and the sheet fits Letter and A4 alike. */}
        <div id="print-zone"
             className={`mx-auto bg-white shadow-sm print:shadow-none border border-stone-200
                         print:border-0 max-w-[210mm] p-6 sm:p-[14mm]
                         print:max-w-none print:w-full print:p-0
                         ${S.body} text-stone-800`}>

          {/* Letterhead: the funeral home on the left, the advisor on the
              right. The dark banner is gone — a printed quote for a family
              should read as a document, not a web page. */}
          <header className="flex justify-between items-start gap-6 pb-4 border-b border-stone-300">
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-stone-900">
                {home?.name || 'Funeral Centre'}
              </h1>
              {home?.address && <p className="text-[11px] text-stone-500 mt-0.5">{home.address}</p>}
              {advisorPhone  && <p className="text-[11px] text-stone-500">{advisorPhone}</p>}
            </div>
            <div className="text-right shrink-0">
              {advisorName  && <p className="font-semibold text-stone-800">{advisorName}</p>}
              {advisorEmail && <p className="text-[11px] text-stone-500">{advisorEmail}</p>}
              <p className="text-[11px] text-stone-400 mt-1">{today}</p>
            </div>
          </header>

          {packageName && (
            <div className="flex items-center justify-between gap-3 pt-4">
              <h2 className="text-base font-bold text-stone-800">{packageName}</h2>
              {arrangementType && (
                <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 capitalize shrink-0">
                  {arrangementType}
                </span>
              )}
            </div>
          )}

          {/* Line items — one table per section, two columns. Qty and Unit
              Price were two columns that between them said what "× 2" says. */}
          <div className="pt-4">
            {activeSections.map(sec => {
              const secItems = items.filter(i => (i.sectionId || 'sec-extra') === sec.id)
              if (!secItems.length) return null
              return <SectionBlock key={sec.id} title={sec.name} items={secItems} S={S}
                                   translations={translations} showChinese={showChinese} />
            })}
            {unsectioned.length > 0 && (
              <SectionBlock title="Items" items={unsectioned} S={S}
                            translations={translations} showChinese={showChinese} />
            )}
          </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-5 sm:gap-6 pt-1"
                 style={{ breakInside: 'avoid' }}>
              <div className="flex-1">
                {selectedCasket && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden h-full flex">
                    {selectedCasket.imageUrl && (
                      <img
                        src={selectedCasket.imageUrl}
                        alt={selectedCasket.name}
                        className="w-3/5 object-contain bg-stone-50 shrink-0"
                      />
                    )}
                    <div className="flex flex-col justify-start p-3 w-2/5">
                      <p className="text-xs font-semibold text-stone-800">{selectedCasket.name}</p>
                      <p className="text-xs font-semibold text-primary-700 mt-1">{fmt(selectedCasket.price)}</p>
                      {selectedCasket.description && (
                        <p className="text-[10px] text-stone-400 mt-1.5 leading-relaxed">{selectedCasket.description}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <dl className="w-full sm:w-72 shrink-0 space-y-1">
                <Line label="Subtotal" value={fmt(subtotal)} />
                {pkgDiscAmount > 0 && (
                  <Line label="Package savings" value={`− ${fmt(pkgDiscAmount)}`} muted />
                )}
                {userDiscAmount > 0 && (
                  <Line label={`Discount (${discountValue}%)`} value={`− ${fmt(userDiscAmount)}`} muted />
                )}
                {/* A zero tax line is noise on a printed quote */}
                {gstAmount > 0 && (
                  <Line label={`GST (${(GST_RATE * 100).toFixed(0)}%)`} value={fmt(gstAmount)} muted />
                )}
                {pstAmount > 0 && (
                  <Line label={`PST (${(PST_RATE * 100).toFixed(0)}%)`} value={fmt(pstAmount)} muted />
                )}
                <div className="flex justify-between items-baseline pt-2 mt-1 border-t-2 border-stone-800">
                  <dt className="font-bold text-stone-900">Total</dt>
                  <dd className="text-lg font-bold text-stone-900">{fmt(total)}</dd>
                </div>
                <p className="text-[10px] text-stone-400 pt-1 text-right">All prices in Canadian dollars</p>
              </dl>
            </div>

          {/* Payment Options Table */}
          {showPayment && (
            total > MONTHLY_THRESHOLD
              ? <PrintMonthlyPayment total={total} paymentTerms={paymentTerms} S={S} />
              : (() => {
                  const age   = calcAge(beneficiaryBirthdate)
                  const plans = getPaymentPlans(age, total)
                  if (!beneficiaryBirthdate) return (
                    <div className="pt-2 pb-4">
                      <p className="text-[10px] text-stone-400">Calculation not available without birthdate.</p>
                    </div>
                  )
                  if (plans.length === 0) return null
                  return (
                    <div className="pb-6 pt-4 border-t border-stone-100">
                      <h3 className={`${S.head} font-semibold uppercase tracking-widest text-stone-500 bg-stone-50 px-2 py-1.5 rounded mb-3`}>Payment Options</h3>
                      <p className="text-sm font-semibold text-stone-700 mb-3">
                        {beneficiaryName || 'Beneficiary'} · Age {age}
                      </p>
                      <table className="w-full text-sm border-collapse">
                        <thead className="hidden sm:table-header-group">
                          <tr className="border-b-2 border-stone-200">
                            <th className="text-left pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Plan</th>
                            <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Monthly</th>
                            <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Months</th>
                            <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total Investment</th>
                            <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">+/day</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plans.map(p => (
                            <tr key={p.years} className="block sm:table-row border-b border-stone-100 py-1.5 sm:py-0">
                              {/* Phone: the plan and its monthly figure on one
                                  line, the rest quietly underneath. Five
                                  columns do not fit a 358px sheet. */}
                              <td className="block sm:hidden">
                                <div className="flex items-baseline justify-between gap-3">
                                  <span className="font-semibold text-stone-700">{p.label}</span>
                                  <span className="font-bold text-stone-900">{fmt(p.monthly)}<span className="text-[10px] font-normal text-stone-400">/mo</span></span>
                                </div>
                                <p className="text-[11px] text-stone-400 mt-0.5">
                                  {p.years * 12} months · {fmt(p.totalInvestment)} total · {fmt(p.perDay)}/day
                                </p>
                              </td>
                              <td className="hidden sm:table-cell py-2 font-semibold text-stone-700">{p.label}</td>
                              <td className="hidden sm:table-cell py-2 text-right font-bold text-stone-900">{fmt(p.monthly)}</td>
                              <td className="hidden sm:table-cell py-2 text-right text-stone-500">{p.years * 12}</td>
                              <td className="hidden sm:table-cell py-2 text-right text-stone-500">{fmt(p.totalInvestment)}</td>
                              <td className="hidden sm:table-cell py-2 text-right text-stone-500">{fmt(p.perDay)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                })()
          )}

          {notes && (
            <footer className="mt-6 pt-3 border-t border-stone-200" style={{ breakInside: 'avoid' }}>
              <p className="text-[10px] text-stone-400 leading-relaxed whitespace-pre-wrap">{notes}</p>
            </footer>
          )}

          {attachedImage && (
            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-center" style={{ breakInside: 'avoid' }}>
              <img src={attachedImage} alt="Attached" className="max-w-full object-contain max-h-64" />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/**
 * One section of the quote: a grey title bar and a two-column table.
 *
 * The four-column form (Description / Qty / Unit Price / Amount) gave two
 * whole columns to information that "× 2" conveys in four characters, and on
 * a phone it left 150px for names like "Basic Professional Services of
 * Funeral Director and Staff". Quantity is inline, and the amount is the only
 * figure, which is what a family reads anyway.
 */
function SectionBlock({ title, items, S, translations = {}, showChinese }) {
  if (!items.length) return null
  return (
    <section className="mb-4">
      <h2 className={`${S.head} font-semibold uppercase tracking-widest text-stone-500
                      bg-stone-50 px-2 py-1.5 rounded`}>
        {title}
      </h2>
      <table className="w-full border-collapse">
        <tbody>
          {items.map((item, i) => {
            const nameZh = showChinese
              ? (item.isCasketItem ? '棺木' : translations[item.name] || null)
              : null
            return (
              <tr key={i} className="border-b border-stone-100" style={{ breakInside: 'avoid' }}>
                <td className={`${S.row} pr-3 align-top`}>
                  <span>{item.name}</span>
                  {item.quantity > 1 && <span className="text-stone-400"> × {item.quantity}</span>}
                  {nameZh && <span className="block text-[10px] text-stone-400 leading-tight">{nameZh}</span>}
                </td>
                <td className={`${S.row} text-right align-top whitespace-nowrap w-28`}>
                  {fmt(item.price * item.quantity)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
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



function PrintMonthlyPayment({ total, paymentTerms, S }) {
  const plans = getMonthlyPlans(total, paymentTerms)
  // Destructuring plans[0] blind took the whole app down if the plan table
  // ever came back empty; there is nothing to show in that case.
  if (!plans.length) return null
  const { downPayment, balance } = plans[0]
  return (
    <div className="pb-6 pt-4 border-t border-stone-100">
      <h3 className={`${S.head} font-semibold uppercase tracking-widest text-stone-500 bg-stone-50 px-2 py-1.5 rounded mb-3`}>Payment Options</h3>
      <div className="bg-stone-50 rounded-lg p-2.5 border border-stone-100 text-xs space-y-1 mb-3">
        <div className="flex justify-between text-stone-500">
          <span>Down payment (10%)</span>
          <span className="font-semibold text-stone-700">{fmt(downPayment)}</span>
        </div>
        <div className="flex justify-between text-stone-500 border-t border-stone-200 pt-1">
          <span>Financed balance</span>
          <span className="font-semibold text-stone-700">{fmt(balance)}</span>
        </div>
      </div>
      <table className="w-full text-sm border-collapse">
        <thead className="hidden sm:table-header-group">
          <tr className="border-b-2 border-stone-200">
            <th className="text-left pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Term</th>
            <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Rate</th>
            <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Monthly</th>
            <th className="text-right pb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Total</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(p => (
            <tr key={p.months} className="block sm:table-row border-b border-stone-100 py-1.5 sm:py-0">
              <td className="block sm:hidden">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold text-stone-700">{p.label}</span>
                  <span className="font-bold text-stone-900">{fmt(p.monthly)}<span className="text-[10px] font-normal text-stone-400">/mo</span></span>
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {p.rate > 0 ? `${p.rate}%` : '0%'} · {fmt(p.totalFinanced)} total
                </p>
              </td>
              <td className="hidden sm:table-cell py-2 font-semibold text-stone-700">{p.label}</td>
              <td className="hidden sm:table-cell py-2 text-right text-stone-500">{p.rate > 0 ? `${p.rate}%` : '0%'}</td>
              <td className="hidden sm:table-cell py-2 text-right font-bold text-stone-900">{fmt(p.monthly)}</td>
              <td className="hidden sm:table-cell py-2 text-right text-stone-500">{fmt(p.totalFinanced)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
