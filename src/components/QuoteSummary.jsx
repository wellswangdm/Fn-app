import { useState } from 'react'

const GST_RATE = 0.05
const PST_RATE = 0.07

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function QuoteSummary({
  items,
  subtotal, discountType, discountValue, discountAmount,
  gstAmount, pstAmount, total,
  status,
  onRemove, onChangeQty, onDiscount, onToggleTax, onPrint,
}) {
  const [showDiscount,   setShowDiscount]   = useState(discountValue > 0)
  const [localDiscType,  setLocalDiscType]  = useState(discountType || 'percentage')
  const [localDiscValue, setLocalDiscValue] = useState(discountValue || '')

  const packageItems = items.filter(i => i.isFromPackage)
  const extraItems   = items.filter(i => !i.isFromPackage)

  const statusStyle = {
    finalized: 'bg-blue-50 text-blue-600 border-blue-200',
    accepted:  'bg-green-50 text-green-600 border-green-200',
    draft:     'bg-amber-50 text-amber-600 border-amber-200',
  }[status] || 'bg-stone-100 text-stone-500'

  return (
    <div className="card sticky top-[3.75rem]">

      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-700">Quote Summary</h2>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${statusStyle}`}>
          {status}
        </span>
      </div>

      {/* Items */}
      <div className="px-3 py-3 max-h-[420px] overflow-y-auto space-y-0.5">
        {items.length === 0 && (
          <p className="text-xs text-stone-400 text-center py-8 leading-relaxed">
            No items added yet.<br />Select a package or add individual items.
          </p>
        )}

        {packageItems.length > 0 && (
          <div className="mb-2">
            <p className="section-title px-1 mb-1.5">Package</p>
            {packageItems.map(item => (
              <ItemRow key={item.id} item={item} onRemove={onRemove} onChangeQty={onChangeQty} onToggleTax={onToggleTax} />
            ))}
          </div>
        )}

        {extraItems.length > 0 && (
          <div>
            {packageItems.length > 0 && <p className="section-title px-1 mb-1.5 mt-3">Additional</p>}
            {extraItems.map(item => (
              <ItemRow key={item.id} item={item} onRemove={onRemove} onChangeQty={onChangeQty} onToggleTax={onToggleTax} />
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-4 py-3 border-t border-stone-100 space-y-2 text-xs">

        <TotalRow label="Subtotal" value={fmt(subtotal)} />

        {/* Discount */}
        {!showDiscount ? (
          <button
            onClick={() => setShowDiscount(true)}
            className="text-primary-600 hover:text-primary-800 text-xs font-medium"
          >
            + Add discount
          </button>
        ) : (
          <div className="bg-stone-50 rounded-lg p-2.5 space-y-2 border border-stone-100">
            <div className="flex items-center gap-1.5">
              <select
                className="input text-xs py-1 w-24 bg-white"
                value={localDiscType}
                onChange={e => setLocalDiscType(e.target.value)}
              >
                <option value="percentage">%</option>
                <option value="flat">$ flat</option>
              </select>
              <input
                type="number" min="0"
                step={localDiscType === 'percentage' ? '0.1' : '1'}
                className="input text-xs py-1 flex-1 bg-white"
                placeholder="0"
                value={localDiscValue}
                onChange={e => setLocalDiscValue(e.target.value)}
              />
              <button
                onClick={() => onDiscount(localDiscType, Number(localDiscValue) || 0)}
                className="btn-primary text-xs py-1 px-2.5"
              >
                Apply
              </button>
            </div>
            {discountAmount > 0 && (
              <TotalRow
                label={`Discount (${discountType === 'percentage' ? `${discountValue}%` : fmt(discountValue)})`}
                value={`−${fmt(discountAmount)}`}
                className="text-red-500"
              />
            )}
            <button
              onClick={() => { setShowDiscount(false); onDiscount('percentage', 0) }}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Remove discount
            </button>
          </div>
        )}

        <TotalRow label={`GST (${(GST_RATE * 100).toFixed(0)}%)`} value={fmt(gstAmount)} />
        {pstAmount > 0 && (
          <TotalRow label={`PST (${(PST_RATE * 100).toFixed(0)}%)`} value={fmt(pstAmount)} />
        )}

        <div className="flex justify-between items-baseline pt-2 border-t border-stone-200">
          <span className="text-sm font-bold text-stone-800">Total</span>
          <span className="text-base font-bold text-primary-700">{fmt(total)}</span>
        </div>

        <p className="text-[10px] text-stone-400 pt-0.5">All prices in CAD.</p>

        {items.length > 0 && (
          <button
            onClick={onPrint}
            className="w-full mt-1 btn-secondary text-xs py-2 justify-center"
          >
            Print / Save as PDF
          </button>
        )}
      </div>
    </div>
  )
}

function ItemRow({ item, onRemove, onChangeQty, onToggleTax }) {
  const gstOn = item.gst !== false
  const pstOn = item.pst === true

  return (
    <div className="group rounded-lg px-2 py-1.5 hover:bg-stone-50 transition-colors">
      {/* Name + price */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-stone-700 leading-snug flex-1 min-w-0 truncate">
          {item.name}
        </p>
        <span className="text-xs font-semibold text-stone-700 shrink-0">
          {fmt(item.price * item.quantity)}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-1.5 mt-1">
        {/* Tax toggles */}
        <TaxBadge
          label="GST"
          active={gstOn}
          activeClass="bg-primary-700 text-white border-primary-700"
          onClick={() => onToggleTax(item.id, { gst: !gstOn, pst: pstOn })}
        />
        <TaxBadge
          label="PST"
          active={pstOn}
          activeClass="bg-stone-600 text-white border-stone-600"
          onClick={() => onToggleTax(item.id, { gst: gstOn, pst: !pstOn })}
        />
        <TaxBadge
          label="Exempt"
          active={!gstOn && !pstOn}
          activeClass="bg-stone-400 text-white border-stone-400"
          onClick={() => onToggleTax(item.id, { gst: false, pst: false })}
        />

        <span className="flex-1" />

        {/* Qty */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onChangeQty(item.id, item.quantity - 1)}
            className="w-5 h-5 rounded flex items-center justify-center text-stone-400
                       hover:text-stone-700 hover:bg-stone-200 transition-colors text-xs"
          >−</button>
          <span className="text-xs text-stone-600 w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => onChangeQty(item.id, item.quantity + 1)}
            className="w-5 h-5 rounded flex items-center justify-center text-stone-400
                       hover:text-stone-700 hover:bg-stone-200 transition-colors text-xs"
          >+</button>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm leading-none"
          title="Remove"
        >×</button>
      </div>
    </div>
  )
}

function TaxBadge({ label, active, activeClass, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors ${
        active
          ? activeClass
          : 'text-stone-400 border-stone-200 hover:border-stone-300 hover:text-stone-500'
      }`}
    >
      {label}
    </button>
  )
}

function TotalRow({ label, value, className = 'text-stone-500' }) {
  return (
    <div className={`flex justify-between ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
