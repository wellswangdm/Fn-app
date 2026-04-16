const GST_RATE = 0.05
const PST_RATE = 0.07

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function PrintView({ home, state, onClose }) {
  const {
    quoteNumber, advisorName, advisorEmail, advisorPhone,
    items, sections, selectedCasket,
    subtotal, discountType, discountValue,
    pkgDiscAmount, userDiscAmount, discountAmount,
    gstAmount, pstAmount, notes,
  } = state

  const total = subtotal - discountAmount + gstAmount + pstAmount

  const today = new Date().toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  // Group items by section for printing
  const activeSections = (sections || []).filter(sec =>
    items.some(i => (i.sectionId || 'sec-extra') === sec.id)
  )
  const unsectioned = items.filter(i =>
    !(sections || []).some(s => s.id === (i.sectionId || 'sec-extra'))
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8">
      {/* Toolbar — hidden when printing */}
      <div className="w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button onClick={onClose} className="text-white/80 hover:text-white text-sm transition-colors">
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            className="bg-white text-primary-800 text-sm font-semibold px-5 py-2
                       rounded-lg hover:bg-stone-100 transition-colors shadow"
          >
            Print / Save as PDF
          </button>
        </div>

        {/* ── Printable document ───────────────────────────────────────── */}
        <div id="print-zone" className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Letterhead band */}
          <div className="bg-primary-800 px-8 py-5 print:px-6 print:py-4 flex items-start justify-between">
            <div>
              <h1 className="text-white text-xl font-bold tracking-tight leading-tight">
                {home?.name || 'Funeral Centre'}
              </h1>
              {home?.address && (
                <p className="text-primary-200 text-xs mt-1">{home.address}</p>
              )}
              {home?.phone && (
                <p className="text-primary-200 text-xs">{home.phone}</p>
              )}
            </div>

            <div className="text-right text-xs leading-snug">
              <p className="text-primary-300">{today}</p>
              {(advisorName || advisorEmail || advisorPhone) && (
                <div className="mt-1.5">
                  {advisorName  && <p className="text-primary-200 font-medium">{advisorName}</p>}
                  {advisorEmail && <p className="text-primary-300">{advisorEmail}</p>}
                  {advisorPhone && <p className="text-primary-300">{advisorPhone}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 print:px-6 print:py-4">

            {/* Items table */}
            <table className="w-full text-sm print:text-xs mb-6 print:mb-4">
              <thead>
                <tr className="border-b-2 border-stone-200">
                  <th className="text-left pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Description
                  </th>
                  <th className="text-center pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 w-10">
                    Qty
                  </th>
                  <th className="text-right pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 w-28">
                    Unit Price
                  </th>
                  <th className="text-right pb-2.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 w-28">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeSections.map(sec => {
                  const secItems = items.filter(i => (i.sectionId || 'sec-extra') === sec.id)
                  return <SectionRows key={sec.id} title={sec.name} items={secItems} />
                })}
                {unsectioned.length > 0 && (
                  <SectionRows title="Items" items={unsectioned} />
                )}
              </tbody>
            </table>

            {/* Bottom row: casket info (left) + totals (right) */}
            <div className="flex items-stretch gap-6">

              {/* Casket card — name+price top line, image fills rest */}
              <div className="flex-1 flex justify-center">
                {selectedCasket && (
                  <div className="border border-stone-200 rounded-xl overflow-hidden w-full flex flex-col">
                    <div className="flex items-center justify-between px-3 py-1.5 shrink-0">
                      <p className="text-xs font-semibold text-stone-800">{selectedCasket.name}</p>
                      <p className="text-xs font-semibold text-primary-700">{fmt(selectedCasket.price)}</p>
                    </div>
                    {selectedCasket.imageUrl && (
                      <div className="flex-1 min-h-0 bg-stone-50 flex items-center justify-center overflow-hidden">
                        <img
                          src={selectedCasket.imageUrl}
                          alt={selectedCasket.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
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

          {/* Footer band — shows notes */}
          {notes && (
            <div className="bg-stone-50 border-t border-stone-100 px-8 print:px-6 py-3 print:py-2 text-center">
              <p className="text-[10px] text-stone-500 whitespace-pre-wrap">{notes}</p>
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
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">
            {title}
          </span>
        </td>
      </tr>
      {items.map((item, i) => <ItemRow key={i} item={item} />)}
    </>
  )
}

function ItemRow({ item }) {
  return (
    <tr className="border-b border-stone-100">
      <td className="py-1.5 print:py-1 text-stone-700 pr-4">{item.name}</td>
      <td className="py-1.5 print:py-1 text-center text-stone-500">{item.quantity}</td>
      <td className="py-1.5 print:py-1 text-right text-stone-500">{fmt(item.price)}</td>
      <td className="py-1.5 print:py-1 text-right font-medium text-stone-800">{fmt(item.price * item.quantity)}</td>
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
