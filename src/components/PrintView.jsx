const GST_RATE = 0.05
const PST_RATE = 0.07

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function PrintView({ home, state, onClose }) {
  const {
    quoteNumber, advisorName, advisorEmail,
    items, subtotal, discountType, discountValue, discountAmount,
    gstAmount, pstAmount, notes,
  } = state

  const total = subtotal - discountAmount + gstAmount + pstAmount

  const pkgItems   = items.filter(i => i.isFromPackage)
  const extraItems = items.filter(i => !i.isFromPackage)
  const today      = new Date().toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

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

            <div className="text-right">
              <p className="text-primary-300 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
                Quotation
              </p>
              <p className="text-white text-lg font-bold leading-tight">
                {quoteNumber || 'Draft'}
              </p>
              <p className="text-primary-300 text-xs mt-1">{today}</p>
              {advisorName && (
                <p className="text-primary-200 text-xs mt-2 font-medium">{advisorName}</p>
              )}
              {advisorEmail && (
                <p className="text-primary-300 text-xs">{advisorEmail}</p>
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
                {pkgItems.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={4} className="pt-4 pb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">
                          Package Services
                        </span>
                      </td>
                    </tr>
                    {pkgItems.map((item, i) => <ItemRow key={i} item={item} />)}
                  </>
                )}
                {extraItems.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={4} className="pt-4 pb-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">
                          Additional Items
                        </span>
                      </td>
                    </tr>
                    {extraItems.map((item, i) => <ItemRow key={i} item={item} />)}
                  </>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-1.5 pb-3">
                  <TotalRow label="Subtotal" value={fmt(subtotal)} />
                  {discountAmount > 0 && (
                    <TotalRow
                      label={`Discount (${discountType === 'percentage' ? `${discountValue}%` : fmt(discountValue)})`}
                      value={`−${fmt(discountAmount)}`}
                      className="text-red-500"
                    />
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

            {/* Notes */}
            {notes && (
              <div className="mt-8 pt-6 border-t border-stone-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">Notes</p>
                <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed">{notes}</p>
              </div>
            )}
          </div>

          {/* Footer band */}
          <div className="bg-stone-50 border-t border-stone-100 px-10 py-4 text-center">
            <p className="text-[10px] text-stone-400">All prices in CAD. Taxes are additional as indicated.</p>
          </div>
        </div>
      </div>
    </div>
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
