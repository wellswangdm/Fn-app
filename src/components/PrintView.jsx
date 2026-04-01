const GST_RATE = 0.05
const PST_RATE = 0.07

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function PrintView({ home, state, onClose }) {
  const {
    deceasedName, customerName, customerPhone, customerEmail,
    items, subtotal, discountType, discountValue, discountAmount,
    gstAmount, pstAmount, taxAmount, total, notes, status,
  } = state

  const pkgItems   = items.filter(i => i.isFromPackage)
  const extraItems = items.filter(i => !i.isFromPackage)
  const today      = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto py-8">
      {/* Modal chrome — hidden when printing */}
      <div className="w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between mb-3 print:hidden">
          <button
            onClick={onClose}
            className="btn-ghost text-white hover:bg-white/10"
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary"
          >
            Print / Save as PDF
          </button>
        </div>

        {/* ── Document (this is what prints) ─────────────────────────── */}
        <div id="print-zone" className="bg-white rounded-xl shadow-xl p-10 text-sm text-slate-800">

          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6 mb-6">
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {home?.name || 'Funeral Centre'}
              </h1>
              {home?.address && <p className="text-slate-500 text-xs mt-0.5">{home.address}</p>}
              <div className="flex gap-4 mt-0.5">
                {home?.phone   && <p className="text-slate-500 text-xs">{home.phone}</p>}
                {home?.website && <p className="text-slate-500 text-xs">{home.website}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Quotation</p>
              <p className="text-slate-600 text-xs mt-1">{today}</p>
              <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                status === 'finalized' ? 'bg-blue-100 text-blue-700'
                : status === 'accepted' ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
              }`}>{status}</span>
            </div>
          </div>

          {/* People */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Deceased</p>
              <p className="font-medium text-slate-900">{deceasedName || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Family Contact</p>
              <p className="font-medium text-slate-900">{customerName || '—'}</p>
              {customerPhone && <p className="text-slate-500 text-xs">{customerPhone}</p>}
              {customerEmail && <p className="text-slate-500 text-xs">{customerEmail}</p>}
            </div>
          </div>

          {/* Items */}
          <table className="w-full text-xs mb-6">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Description</th>
                <th className="text-center py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-12">Tax</th>
                <th className="text-center py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-10">Qty</th>
                <th className="text-right py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-24">Unit</th>
                <th className="text-right py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              {pkgItems.length > 0 && (
                <>
                  <tr><td colSpan={5} className="pt-3 pb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Package Services</span>
                  </td></tr>
                  {pkgItems.map((item, i) => (
                    <ItemRow key={i} item={item} />
                  ))}
                </>
              )}
              {extraItems.length > 0 && (
                <>
                  <tr><td colSpan={5} className="pt-3 pb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Additional Items</span>
                  </td></tr>
                  {extraItems.map((item, i) => (
                    <ItemRow key={i} item={item} />
                  ))}
                </>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="ml-auto w-64 border-t border-slate-200 pt-4 space-y-1.5">
            <Row label="Subtotal" value={fmt(subtotal)} />
            {discountAmount > 0 && (
              <Row
                label={`Discount (${discountType === 'percentage' ? `${discountValue}%` : fmt(discountValue)})`}
                value={`−${fmt(discountAmount)}`}
                className="text-red-600"
              />
            )}
            <Row label={`GST (${(GST_RATE * 100).toFixed(0)}%)`} value={fmt(gstAmount)} />
            {pstAmount > 0 && (
              <Row label={`PST (${(PST_RATE * 100).toFixed(0)}%)`} value={fmt(pstAmount)} />
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Notes</p>
              <p className="text-slate-600 text-xs whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
            This quotation is valid for 30 days from the date issued. All prices are in Canadian dollars.
            Taxes are additional as indicated. Prices are subject to change without notice.
          </div>
        </div>
      </div>
    </div>
  )
}

function ItemRow({ item }) {
  const taxLabel = item.gst !== false && item.pst
    ? 'G+P' : item.gst !== false
    ? 'GST' : item.pst
    ? 'PST' : '—'

  return (
    <tr className="border-b border-slate-100">
      <td className="py-1.5 text-slate-700">{item.name}</td>
      <td className="py-1.5 text-center">
        <span className="text-[10px] text-slate-400">{taxLabel}</span>
      </td>
      <td className="py-1.5 text-center text-slate-600">{item.quantity}</td>
      <td className="py-1.5 text-right text-slate-600">{fmt(item.price)}</td>
      <td className="py-1.5 text-right font-medium text-slate-800">{fmt(item.price * item.quantity)}</td>
    </tr>
  )
}

function Row({ label, value, className = 'text-slate-600' }) {
  return (
    <div className={`flex justify-between text-xs ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
