import { useEffect } from 'react'

const GST_RATE = 0.05
const PST_RATE = 0.07

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function handlePrint() {
  const zone = document.getElementById('print-zone')
  if (!zone) { window.print(); return }

  // Clone the rendered quote DOM and place it directly in <body>
  const clone = zone.cloneNode(true)
  clone.id = 'print-clone'
  document.body.appendChild(clone)

  // Hide everything except the clone during print
  const style = document.createElement('style')
  style.id = 'print-clone-style'
  style.textContent = `
    @media print {
      body > *:not(#print-clone) { display: none !important; }
      #print-clone { display: block !important; border-radius: 0; box-shadow: none; }
    }
  `
  document.head.appendChild(style)

  window.print()

  // Clean up after print dialog closes
  const cleanup = () => {
    document.getElementById('print-clone')?.remove()
    document.getElementById('print-clone-style')?.remove()
    window.removeEventListener('afterprint', cleanup)
  }
  window.addEventListener('afterprint', cleanup)
  setTimeout(cleanup, 5000) // fallback if afterprint doesn't fire
}

export default function PrintView({ home, state, attachedImage, onClose }) {
  const {
    quoteNumber, advisorName, advisorEmail, advisorPhone,
    items, sections, selectedCasket, packageName, arrangementType,
    subtotal, discountType, discountValue,
    pkgDiscAmount, userDiscAmount, discountAmount,
    gstAmount, pstAmount, notes,
  } = state

  const total = subtotal - discountAmount + gstAmount + pstAmount

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8">
      <div className="w-full max-w-3xl mx-4">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="text-white/80 hover:text-white text-sm transition-colors">
            ← Back
          </button>
          <button
            onClick={handlePrint}
            className="bg-white text-primary-800 text-sm font-semibold px-5 py-2
                       rounded-lg hover:bg-stone-100 transition-colors shadow"
          >
            Print / Save as PDF
          </button>
        </div>

        {/* Quote card — this is what gets cloned for printing */}
        <div id="print-zone" className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Letterhead */}
          <div className="bg-primary-800 px-8 py-5 print:px-6 print:py-4 flex items-start justify-between">
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight leading-tight">
                {home?.name || 'Funeral Centre'}
              </h1>
              {home?.address && <p className="text-primary-200 text-xs mt-1">{home.address}</p>}
              {advisorPhone  && <p className="text-primary-200 text-xs">{advisorPhone}</p>}
            </div>
            <div className="text-right text-xs leading-snug">
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
          <div className="px-8 py-6 print:px-6 print:py-4">

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
              <thead>
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
                  return <SectionRows key={sec.id} title={sec.name} items={secItems} />
                })}
                {unsectioned.length > 0 && <SectionRows title="Items" items={unsectioned} />}
              </tbody>
            </table>

            <div className="flex items-stretch gap-6">
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

              <div className="w-64 shrink-0">
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

          </div>

          {notes && (
            <div className="bg-stone-50 border-t border-stone-100 px-8 py-3 text-center">
              <p className="text-[10px] text-stone-500 whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {attachedImage && (
            <div className="border-t border-stone-100 px-8 py-4 flex justify-center">
              <img src={attachedImage} alt="Attached" className="max-w-full object-contain max-h-64" />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function SectionRows({ title, items }) {
  if (!items.length) return null
  return (
    <>
      <tr>
        <td colSpan={4} className="pt-4 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">{title}</span>
        </td>
      </tr>
      {items.map((item, i) => <ItemRow key={i} item={item} />)}
    </>
  )
}

function ItemRow({ item }) {
  return (
    <tr className="border-b border-stone-100">
      <td className="py-1.5 text-stone-700 pr-4">{item.name}</td>
      <td className="py-1.5 text-center text-stone-500">{item.quantity}</td>
      <td className="py-1.5 text-right text-stone-500">{fmt(item.price)}</td>
      <td className="py-1.5 text-right font-medium text-stone-800">{fmt(item.price * item.quantity)}</td>
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
