import { useEffect, useRef, useState } from 'react'

const GST_RATE = 0.05
const PST_RATE = 0.07

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function QuoteSummary({
  items,
  subtotal, packageDiscount, pkgDiscAmount, userDiscAmount,
  discountType, discountValue, discountAmount,
  gstAmount, pstAmount, total,
  status,
  onRemove, onChangeQty, onDiscount, onToggleTax, onEdit, onReorder, onPrint,
}) {
  const [showDiscount,   setShowDiscount]   = useState(discountValue > 0)
  const [localDiscValue, setLocalDiscValue] = useState(discountValue || '')
  const [dragId,         setDragId]         = useState(null)

  const packageItems = items.filter(i => i.isFromPackage)
  const extraItems   = items.filter(i => !i.isFromPackage)

  const statusStyle = {
    finalized: 'bg-blue-50 text-blue-600 border-blue-200',
    accepted:  'bg-green-50 text-green-600 border-green-200',
    draft:     'bg-amber-50 text-amber-600 border-amber-200',
  }[status] || 'bg-stone-100 text-stone-500'

  function handleDrop(toId) {
    if (dragId && dragId !== toId) onReorder(dragId, toId)
    setDragId(null)
  }

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
              <ItemRow
                key={item.id} item={item}
                onRemove={onRemove} onChangeQty={onChangeQty}
                onToggleTax={onToggleTax} onEdit={onEdit}
                isDragging={dragId === item.id}
                onDragStart={() => setDragId(item.id)}
                onDrop={() => handleDrop(item.id)}
              />
            ))}
          </div>
        )}

        {extraItems.length > 0 && (
          <div>
            {packageItems.length > 0 && <p className="section-title px-1 mb-1.5 mt-3">Additional</p>}
            {extraItems.map(item => (
              <ItemRow
                key={item.id} item={item}
                onRemove={onRemove} onChangeQty={onChangeQty}
                onToggleTax={onToggleTax} onEdit={onEdit}
                isDragging={dragId === item.id}
                onDragStart={() => setDragId(item.id)}
                onDrop={() => handleDrop(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-4 py-3 border-t border-stone-100 space-y-2 text-xs">

        <TotalRow label="Subtotal" value={fmt(subtotal)} />

        {/* Package discount (auto, read-only) */}
        {pkgDiscAmount > 0 && (
          <TotalRow label="Package Discount" value={`−${fmt(pkgDiscAmount)}`} className="text-emerald-600" />
        )}

        {/* User % discount */}
        {!showDiscount ? (
          <button
            onClick={() => setShowDiscount(true)}
            className="text-primary-600 hover:text-primary-800 text-xs font-medium"
          >
            + Add discount (%)
          </button>
        ) : (
          <div className="bg-stone-50 rounded-lg p-2.5 space-y-2 border border-stone-100">
            <div className="flex items-center gap-1.5">
              <input
                type="number" min="0" max="100" step="0.1"
                className="input text-xs py-1 flex-1 bg-white"
                placeholder="0"
                value={localDiscValue}
                onChange={e => setLocalDiscValue(e.target.value)}
              />
              <span className="text-xs text-stone-500 shrink-0">%</span>
              <button
                onClick={() => onDiscount('percentage', Number(localDiscValue) || 0)}
                className="btn-primary text-xs py-1 px-2.5"
              >
                Apply
              </button>
            </div>
            {userDiscAmount > 0 && (
              <TotalRow
                label={`Discount (${discountValue}%)`}
                value={`−${fmt(userDiscAmount)}`}
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

function ItemRow({ item, onRemove, onChangeQty, onToggleTax, onEdit, isDragging, onDragStart, onDrop }) {
  const gstOn = item.gst !== false
  const pstOn = item.pst === true

  const [editName,  setEditName]  = useState(false)
  const [editPrice, setEditPrice] = useState(false)
  const [localName,  setLocalName]  = useState(item.name)
  const [localPrice, setLocalPrice] = useState(item.price)
  const nameRef  = useRef(null)
  const priceRef = useRef(null)

  useEffect(() => { setLocalName(item.name) },  [item.name])
  useEffect(() => { setLocalPrice(item.price) }, [item.price])

  function commitName() {
    setEditName(false)
    const n = localName.trim()
    if (n && n !== item.name) onEdit(item.id, { name: n })
    else setLocalName(item.name)
  }

  function commitPrice() {
    setEditPrice(false)
    const p = parseFloat(localPrice)
    if (!isNaN(p) && p >= 0 && p !== item.price) onEdit(item.id, { price: p })
    else setLocalPrice(item.price)
  }

  useEffect(() => { if (editName  && nameRef.current)  nameRef.current.select()  }, [editName])
  useEffect(() => { if (editPrice && priceRef.current) priceRef.current.select() }, [editPrice])

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop}
      onDragEnd={() => {}}
      className={`group rounded-lg px-1 py-1.5 hover:bg-stone-50 transition-colors cursor-grab active:cursor-grabbing
                  ${isDragging ? 'opacity-40 bg-stone-100' : ''}`}
    >
      {/* Name + price row */}
      <div className="flex items-start gap-1">
        {/* Drag handle */}
        <span className="text-stone-300 group-hover:text-stone-400 text-xs mt-0.5 select-none shrink-0 px-0.5">⠿</span>

        <div className="flex-1 min-w-0">
          {/* Editable name */}
          {editName ? (
            <input
              ref={nameRef}
              className="input text-xs py-0.5 px-1.5 w-full font-medium"
              value={localName}
              onChange={e => setLocalName(e.target.value)}
              onBlur={commitName}
              onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setLocalName(item.name); setEditName(false) } }}
            />
          ) : (
            <p
              onClick={() => setEditName(true)}
              className="text-xs font-medium text-stone-700 leading-snug truncate cursor-text
                         hover:bg-stone-100 rounded px-1 -mx-1 py-0.5"
              title="Click to edit"
            >
              {item.name}
            </p>
          )}
        </div>

        {/* Editable price */}
        {editPrice ? (
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="text-xs text-stone-400">$</span>
            <input
              ref={priceRef}
              type="number" min="0" step="0.01"
              className="input text-xs py-0.5 px-1.5 w-20 text-right font-semibold"
              value={localPrice}
              onChange={e => setLocalPrice(e.target.value)}
              onBlur={commitPrice}
              onKeyDown={e => { if (e.key === 'Enter') commitPrice(); if (e.key === 'Escape') { setLocalPrice(item.price); setEditPrice(false) } }}
            />
          </div>
        ) : (
          <span
            onClick={() => setEditPrice(true)}
            className="text-xs font-semibold text-stone-700 shrink-0 cursor-text
                       hover:bg-stone-100 rounded px-1 py-0.5"
            title="Click to edit price"
          >
            {fmt(item.price * item.quantity)}
          </span>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-1.5 mt-1 pl-5">
        <TaxBadge label="GST" active={gstOn}  activeClass="bg-primary-700 text-white border-primary-700"
          onClick={() => onToggleTax(item.id, { gst: !gstOn, pst: pstOn })} />
        <TaxBadge label="PST" active={pstOn}  activeClass="bg-stone-600 text-white border-stone-600"
          onClick={() => onToggleTax(item.id, { gst: gstOn, pst: !pstOn })} />
        <TaxBadge label="Exempt" active={!gstOn && !pstOn} activeClass="bg-stone-400 text-white border-stone-400"
          onClick={() => onToggleTax(item.id, { gst: false, pst: false })} />

        <span className="flex-1" />

        {/* Qty */}
        <div className="flex items-center gap-0.5">
          <button onClick={() => onChangeQty(item.id, item.quantity - 1)}
            className="w-5 h-5 rounded flex items-center justify-center text-stone-400
                       hover:text-stone-700 hover:bg-stone-200 transition-colors text-xs">−</button>
          <span className="text-xs text-stone-600 w-4 text-center">{item.quantity}</span>
          <button onClick={() => onChangeQty(item.id, item.quantity + 1)}
            className="w-5 h-5 rounded flex items-center justify-center text-stone-400
                       hover:text-stone-700 hover:bg-stone-200 transition-colors text-xs">+</button>
        </div>

        <button onClick={() => onRemove(item.id)}
          className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm leading-none"
          title="Remove">×</button>
      </div>
    </div>
  )
}

function TaxBadge({ label, active, activeClass, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors ${
        active ? activeClass : 'text-stone-400 border-stone-200 hover:border-stone-300 hover:text-stone-500'
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
