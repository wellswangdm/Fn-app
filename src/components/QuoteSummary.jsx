import { useState } from 'react'

export default function QuoteSummary({
  items,
  subtotal, discountType, discountValue, discountAmount,
  taxRate, taxAmount, total,
  status,
  onRemove, onChangeQty, onDiscount,
}) {
  const [showDiscount, setShowDiscount] = useState(discountValue > 0)
  const [localDiscType,  setLocalDiscType]  = useState(discountType || 'percentage')
  const [localDiscValue, setLocalDiscValue] = useState(discountValue || '')

  function applyDiscount() {
    onDiscount(localDiscType, Number(localDiscValue) || 0)
  }

  const packageItems = items.filter(i => i.isFromPackage)
  const extraItems   = items.filter(i => !i.isFromPackage)

  return (
    <div className="card sticky top-20">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Quote Summary</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          status === 'finalized' ? 'bg-blue-100 text-blue-700' :
          status === 'accepted'  ? 'bg-green-100 text-green-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {status}
        </span>
      </div>

      {/* Items list */}
      <div className="px-4 py-3 max-h-[380px] overflow-y-auto space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No items added yet.<br />Select a package or add individual items.
          </p>
        )}

        {packageItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Package Items</p>
            {packageItems.map(item => (
              <ItemRow key={item.id || item.serviceItemId + '-pkg'} item={item} onRemove={onRemove} onChangeQty={onChangeQty} />
            ))}
          </div>
        )}

        {extraItems.length > 0 && (
          <div>
            {packageItems.length > 0 && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 mt-2">Additional Items</p>
            )}
            {extraItems.map(item => (
              <ItemRow key={item.id || item.serviceItemId + '-extra'} item={item} onRemove={onRemove} onChangeQty={onChangeQty} />
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-4 py-3 border-t border-gray-100 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>

        {/* Discount toggle */}
        {!showDiscount ? (
          <button
            onClick={() => setShowDiscount(true)}
            className="text-xs text-primary-600 hover:underline"
          >
            + Add discount
          </button>
        ) : (
          <div className="bg-gray-50 rounded-lg p-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <select
                className="input text-xs py-1 w-28"
                value={localDiscType}
                onChange={e => setLocalDiscType(e.target.value)}
              >
                <option value="percentage">Percent %</option>
                <option value="flat">Flat $</option>
              </select>
              <input
                type="number"
                min="0"
                step={localDiscType === 'percentage' ? '0.1' : '1'}
                className="input text-xs py-1 flex-1"
                placeholder={localDiscType === 'percentage' ? '0.0' : '0.00'}
                value={localDiscValue}
                onChange={e => setLocalDiscValue(e.target.value)}
              />
              <button onClick={applyDiscount} className="btn-primary text-xs py-1 px-2">Apply</button>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-600 text-xs">
                <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : fmt(discountValue)})</span>
                <span>−{fmt(discountAmount)}</span>
              </div>
            )}
            <button
              onClick={() => { setShowDiscount(false); onDiscount('percentage', 0) }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Remove discount
            </button>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>GST ({(taxRate * 100).toFixed(0)}%)</span>
          <span>{fmt(taxAmount)}</span>
        </div>

        <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-200">
          <span>Total</span>
          <span className="text-primary-700">{fmt(total)}</span>
        </div>

        <p className="text-xs text-gray-400 pt-1">
          All prices in CAD. Taxes are additional as indicated.
        </p>
      </div>
    </div>
  )
}

function ItemRow({ item, onRemove, onChangeQty }) {
  return (
    <div className="flex items-start gap-1.5 py-1 group">
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-medium leading-snug ${item.isFromPackage ? 'text-gray-600' : 'text-gray-800'}`}>
          {item.name}
        </p>
        <p className="text-xs text-gray-400">{fmt(item.price)} each</p>
      </div>

      {/* Qty control */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onChangeQty(item.id, item.quantity - 1)}
          className="w-5 h-5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xs flex items-center justify-center"
        >
          −
        </button>
        <span className="text-xs w-4 text-center">{item.quantity}</span>
        <button
          onClick={() => onChangeQty(item.id, item.quantity + 1)}
          className="w-5 h-5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xs flex items-center justify-center"
        >
          +
        </button>
      </div>

      <span className="text-xs font-semibold text-gray-700 shrink-0 w-16 text-right">
        {fmt(item.price * item.quantity)}
      </span>

      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        title="Remove"
      >
        ×
      </button>
    </div>
  )
}

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}
