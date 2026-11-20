import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { calcAge, getPaymentPlans, getMonthlyPlans, MONTHLY_THRESHOLD } from '../lib/paymentPlans.js'
import { GST_RATE, PST_RATE } from '../lib/calcTotals.js'
import { useTranslations } from '../lib/useTranslations.js'
import { useChineseMode } from '../lib/useChineseMode.js'

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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto py-4 sm:py-8">
      <div className="w-full max-w-3xl mx-3 sm:mx-4">

        {/* Toolbar. It used to be one no-wrap row, so on a phone Back, the two
            checkboxes, Share and Print piled on top of each other. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3 sm:mb-4">
          <button onClick={onClose} className="text-white/80 hover:text-white text-sm transition-colors shrink-0">
            ← Back
          </button>
          <label className="flex items-center gap-1.5 text-sm text-white/70 cursor-pointer select-none shrink-0">
            <input type="checkbox" checked={showChinese} onChange={e => setShowChinese(e.target.checked)} className="rounded" />
            中文
          </label>
          <label className="flex items-center gap-1.5 text-sm text-white/70 cursor-pointer select-none shrink-0">
            <input type="checkbox" checked={showPayment} onChange={e => setShowPayment(e.target.checked)} className="rounded" />
            Payment options
          </label>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={handleShare}
              disabled={shareStatus === 'uploading'}
              className={`text-sm font-semibold px-3 sm:px-5 py-2 rounded-lg transition-colors shadow disabled:opacity-50 whitespace-nowrap
                ${shareStatus === 'done'  ? 'bg-emerald-500 text-white' :
                  shareStatus === 'error' ? 'bg-red-500 text-white' :
                  'bg-white/20 text-white hover:bg-white/30'}`}
            >
              {shareStatus === 'uploading' ? 'Uploading…' :
               shareStatus === 'done'      ? 'Link copied!' :
               shareStatus === 'error'     ? 'Error — retry?' :
               'Share link'}
            </button>
            <button
              onClick={openPrintWindow}
              className="bg-white text-primary-800 text-sm font-semibold px-3 sm:px-5 py-2
                         rounded-lg hover:bg-stone-100 transition-colors shadow whitespace-nowrap"
            >
              <span className="sm:hidden">PDF</span>
              <span className="hidden sm:inline">Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Quote preview + what gets printed */}
        <div id="print-zone" className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Letterhead */}
          <div className="bg-primary-800 px-5 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:justify-between">
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight leading-tight">
                {home?.name || 'Funeral Centre'}
              </h1>
              {home?.address && <p className="text-primary-200 text-xs mt-1">{home.address}</p>}
              {advisorPhone  && <p className="text-primary-200 text-xs">{advisorPhone}</p>}
            </div>
            <div className="text-left sm:text-right text-xs leading-snug">
              <p className="text-primary-300">{today}</p>
              {(advisorName || advisorEmail) && (
                <div className="mt-1.5">
                  {advisorName  && <p className="text-primary-200 font-medium">{advisorName}</p>}
                  {advisorEmail && <p className="text-primary-300">{advisorEmail}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-5 sm:px-8 sm:py-6">

            {packageName && (
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-stone-200">
                <h2 className="text-base font-bold text-stone-800">{packageName}</h2>
                {arrangementType && (
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 border border-stone-200 rounded-full px-3 py-1 capitalize">
                    {arrangementType}
                  </span>
                )}
              </div>
            )}

            <table className="w-full text-sm mb-6">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b-2 border-stone-200">
                  <th className="text-left pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">Description</th>
                  <th className="text-center pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 w-10">Qty</th>
                  <th className="text-right pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 w-28">Unit Price</th>
                  <th className="text-right pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {activeSections.map(sec => {
                  const secItems = items.filter(i => (i.sectionId || 'sec-extra') === sec.id)
                  return <SectionRows key={sec.id} title={sec.name} items={secItems} translations={translations} showChinese={showChinese} />
                })}
                {unsectioned.length > 0 && <SectionRows title="Items" items={unsectioned} translations={translations} showChinese={showChinese} />}
              </tbody>
            </table>

            <div className="flex flex-col sm:flex-row items-stretch gap-5 sm:gap-6">
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

              <div className="w-full sm:w-64 shrink-0">
                <div className="space-y-1.5 pb-3">
                  <TotalRow label="Subtotal" value={fmt(subtotal)} />
                  {pkgDiscAmount > 0 && (
                    <TotalRow label="Package Discount" value={`−${fmt(pkgDiscAmount)}`} className="text-emerald-600" />
                  )}
                  {userDiscAmount > 0 && (
                    <TotalRow label={`Discount (${discountValue}%)`} value={`−${fmt(userDiscAmount)}`} className="text-red-500" />
                  )}
                  <TotalRow label={`GST (${(GST_RATE * 100).toFixed(0)}%)`} value={fmt(gstAmount)} />
                  {pstAmount > 0 && (
                    <TotalRow label={`PST (${(PST_RATE * 100).toFixed(0)}%)`} value={fmt(pstAmount)} />
                  )}
                </div>
                <div className="flex justify-between items-baseline border-t-2 border-primary-800 pt-3">
                  <span className="text-sm font-bold text-primary-900">Total</span>
                  <span className="text-lg font-bold text-primary-800">{fmt(total)}</span>
                </div>
                <p className="text-[10px] text-stone-400 mt-1.5 text-right">All prices in Canadian dollars</p>
              </div>
            </div>

          {/* Payment Options Table */}
          {showPayment && (
            total > MONTHLY_THRESHOLD
              ? <PrintMonthlyPayment total={total} paymentTerms={paymentTerms} />
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
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">Payment Options</h3>
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

          </div>

          {notes && (
            <div className="bg-stone-50 border-t border-stone-100 px-5 sm:px-8 py-3 text-center">
              <p className="text-[10px] text-stone-500 whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {attachedImage && (
            <div className="border-t border-stone-100 px-5 sm:px-8 py-4 flex justify-center">
              <img src={attachedImage} alt="Attached" className="max-w-full object-contain max-h-64" />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function SectionRows({ title, items, translations = {}, showChinese }) {
  if (!items.length) return null
  return (
    <>
      <tr className="block sm:table-row">
        <td colSpan={4} className="block sm:table-cell pt-4 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">{title}</span>
        </td>
      </tr>
      {items.map((item, i) => {
        const nameZh = showChinese
          ? (item.isCasketItem ? '棺木' : translations[item.name] || null)
          : null
        return <ItemRow key={i} item={item} nameZh={nameZh} />
      })}
    </>
  )
}

/**
 * One line of the quote.
 *
 * At sm: and above this is exactly the four-column table it has always been —
 * the printed sheet and every desktop screen are untouched.
 *
 * Below sm: the four columns restack, because squeezing them into 358px turned
 * "Basic Professional Services of Funeral Director and Staff" into six lines
 * while Qty gave a whole column to the digit 1. The name takes the full width
 * and the money sits on its own line, with the unit price shown only when the
 * quantity makes it tell you something the amount does not.
 */
function ItemRow({ item, nameZh }) {
  const amount = item.price * item.quantity
  return (
    <tr className="block sm:table-row border-b border-stone-100 py-1 sm:py-0">
      <td className="block sm:table-cell py-1 sm:py-1.5 text-stone-700 sm:pr-4">
        <span>{item.name}</span>
        {nameZh && <span className="block text-[10px] text-stone-400 leading-tight">{nameZh}</span>}
      </td>

      {/* Phone only */}
      <td className="block sm:hidden pb-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-stone-400">
            {item.quantity !== 1 ? `${item.quantity} × ${fmt(item.price)}` : ''}
          </span>
          <span className="font-medium text-stone-800">{fmt(amount)}</span>
        </div>
      </td>

      {/* sm: and up — the printed layout */}
      <td className="hidden sm:table-cell py-1.5 text-center text-stone-500">{item.quantity}</td>
      <td className="hidden sm:table-cell py-1.5 text-right text-stone-500">{fmt(item.price)}</td>
      <td className="hidden sm:table-cell py-1.5 text-right font-medium text-stone-800">{fmt(amount)}</td>
    </tr>
  )
}

function TotalRow({ label, value, className = 'text-stone-500' }) {
  return (
    <div className={`flex justify-between text-xs ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function PrintMonthlyPayment({ total, paymentTerms }) {
  const plans = getMonthlyPlans(total, paymentTerms)
  const { downPayment, balance } = plans[0]
  return (
    <div className="pb-6 pt-4 border-t border-stone-100">
      <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">Payment Options</h3>
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
