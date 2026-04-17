import { useEffect, useRef, useState } from 'react'

const GST_RATE = 0.05
const PST_RATE = 0.07

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function QuoteSummary({
  items, sections, selectedCasket,
  subtotal, packageDiscount, pkgDiscAmount, userDiscAmount,
  discountType, discountValue, discountAmount,
  gstAmount, pstAmount, total,
  status,
  onRemove, onChangeQty, onDiscount, onToggleTax, onEdit, onReorder,
  onRenameSection, onAddSection, onRemoveSection, onMoveItem,
  onChangeCasket, onPrint,
}) {
  const [showDiscount,   setShowDiscount]   = useState(discountValue > 0)
  const [localDiscValue, setLocalDiscValue] = useState(discountValue || '')
  const [dragId,         setDragId]         = useState(null)

  const statusStyle = {
    finalized: 'bg-blue-50 text-blue-600 border-blue-200',
    accepted:  'bg-green-50 text-green-600 border-green-200',
    draft:     'bg-amber-50 text-amber-600 border-amber-200',
  }[status] || 'bg-stone-100 text-stone-500'

  function handleDrop(toId) {
    if (dragId && dragId !== toId) onReorder(dragId, toId)
    setDragId(null)
  }

  const activeSections = (sections || []).filter(sec =>
    items.some(i => (i.sectionId || 'sec-extra') === sec.id)
  )
  const unsectioned = items.filter(i =>
    !(sections || []).some(s => s.id === (i.sectionId || 'sec-extra'))
  )

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
      <div className="px-3 py-3 max-h-[500px] overflow-y-auto space-y-0.5">
        {items.length === 0 && (
          <p className="text-xs text-stone-400 text-center py-8 leading-relaxed">
            No items added yet.<br />Select a package or add individual items.
          </p>
        )}

        {activeSections.map(sec => {
          const secItems = items.filter(i => (i.sectionId || 'sec-extra') === sec.id)
          return (
            <SectionBlock
              key={sec.id}
              section={sec}
              items={secItems}
              sections={sections}
              dragId={dragId}
              onDragStart={id => setDragId(id)}
              onDrop={handleDrop}
              onRemove={onRemove}
              onChangeQty={onChangeQty}
              onToggleTax={onToggleTax}
              onEdit={onEdit}
              onRenameSection={onRenameSection}
              onRemoveSection={onRemoveSection}
              onMoveItem={onMoveItem}
            />
          )
        })}

        {unsectioned.length > 0 && (
          <div className="space-y-0.5">
            {unsectioned.map(item => (
              <ItemRow
                key={item.id} item={item}
                sections={sections}
                onRemove={onRemove} onChangeQty={onChangeQty}
                onToggleTax={onToggleTax} onEdit={onEdit}
                onMoveItem={onMoveItem}
                isDragging={dragId === item.id}
                onDragStart={() => setDragId(item.id)}
                onDrop={() => handleDrop(item.id)}
              />
            ))}
          </div>
        )}

        {/* Casket info */}
        {selectedCasket && (
          <div className="mt-3 bg-stone-50 rounded-lg p-2.5 border border-stone-100">
            <div className="flex items-start gap-2.5">
              {selectedCasket.imageUrl && (
                <img
                  src={selectedCasket.imageUrl}
                  alt={selectedCasket.name}
                  className="w-16 h-11 object-cover rounded-md shrink-0 border border-stone-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">Selected Casket</p>
                  <button
                    onClick={onChangeCasket}
                    className="text-[10px] text-primary-600 hover:text-primary-800 font-medium shrink-0"
                  >
                    Change
                  </button>
                </div>
                <p className="text-xs font-semibold text-stone-700 mt-0.5">{selectedCasket.name}</p>
                {selectedCasket.description && (
                  <p className="text-[10px] text-stone-400 mt-0.5 leading-relaxed">{selectedCasket.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add section button */}
        <button
          onClick={onAddSection}
          className="w-full mt-2 text-[10px] font-medium text-stone-400 hover:text-stone-600
                     border border-dashed border-stone-200 hover:border-stone-300 rounded-lg py-1.5
                     transition-colors"
        >
          + Add Section
        </button>
      </div>

      {/* Totals */}
      <div className="px-4 py-3 border-t border-stone-100 space-y-2 text-xs">

        <TotalRow label="Subtotal" value={fmt(subtotal)} />

        {pkgDiscAmount > 0 && (
          <TotalRow label="Package Discount" value={`−${fmt(pkgDiscAmount)}`} className="text-emerald-600" />
        )}

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

// ─── Section Block ────────────────────────────────────────────────────────────

function SectionBlock({ section, items, sections, dragId, onDragStart, onDrop,
                        onRemove, onChangeQty, onToggleTax, onEdit,
                        onRenameSection, onRemoveSection, onMoveItem }) {
  const [editingName, setEditingName] = useState(false)
  const [localName,   setLocalName]   = useState(section.name)
  const nameRef = useRef(null)

  useEffect(() => { setLocalName(section.name) }, [section.name])
  useEffect(() => { if (editingName && nameRef.current) nameRef.current.select() }, [editingName])

  function commitName() {
    setEditingName(false)
    const n = localName.trim()
    if (n && n !== section.name) onRenameSection(section.id, n)
    else setLocalName(section.name)
  }

  const isProtected = section.id === 'sec-main' || section.id === 'sec-extra'

  return (
    <div className="mb-3">
      <div className="flex items-center gap-1 px-1 mb-1 group/sec">
        {editingName ? (
          <input
            ref={nameRef}
            className="input text-[10px] py-0.5 px-1.5 flex-1 font-semibold uppercase tracking-wider"
            value={localName}
            onChange={e => setLocalName(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') { setLocalName(section.name); setEditingName(false) }
            }}
          />
        ) : (
          <p
            onClick={() => setEditingName(true)}
            className="section-title flex-1 cursor-text hover:bg-stone-100 rounded px-1 -mx-1 py-0.5"
            title="Click to rename"
          >
            {section.name}
          </p>
        )}
        {!isProtected && (
          <button
            onClick={() => onRemoveSection(section.id)}
            className="text-stone-300 hover:text-red-400 opacity-0 group-hover/sec:opacity-100
                       transition-all text-sm leading-none shrink-0"
            title="Remove section"
          >
            ×
          </button>
        )}
      </div>
      {items.map(item => (
        <ItemRow
          key={item.id} item={item}
          sections={sections}
          onRemove={onRemove} onChangeQty={onChangeQty}
          onToggleTax={onToggleTax} onEdit={onEdit}
          onMoveItem={onMoveItem}
          isDragging={dragId === item.id}
          onDragStart={() => onDragStart(item.id)}
          onDrop={() => onDrop(item.id)}
        />
      ))}
    </div>
  )
}

// ─── Item Row ─────────────────────────────────────────────────────────────────

function ItemRow({ item, sections, onRemove, onChangeQty, onToggleTax, onEdit, onMoveItem,
                   isDragging, onDragStart, onDrop }) {
  const gstOn = item.gst !== false
  const pstOn = item.pst === true

  const [editName,  setEditName]  = useState(false)
  const [editPrice, setEditPrice] = useState(false)
  const [localName,  setLocalName]  = useState(item.name)
  const [localPrice, setLocalPrice] = useState(item.price)
  const [showMove,   setShowMove]   = useState(false)
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

  const otherSections = (sections || []).filter(s => s.id !== (item.sectionId || 'sec-extra'))

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
        <span className="text-stone-300 group-hover:text-stone-400 text-xs mt-0.5 select-none shrink-0 px-0.5">⠿</span>

        <div className="flex-1 min-w-0">
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
          onClick={() => onToggleTax(item.id, { gst: !gstOn, pst: pstOn, noDisc: item.noDisc })} />
        <TaxBadge label="PST" active={pstOn}  activeClass="bg-stone-600 text-white border-stone-600"
          onClick={() => onToggleTax(item.id, { gst: gstOn, pst: !pstOn, noDisc: item.noDisc })} />
        <TaxBadge label="Exempt" active={!gstOn && !pstOn} activeClass="bg-stone-400 text-white border-stone-400"
          onClick={() => onToggleTax(item.id, { gst: false, pst: false, noDisc: item.noDisc })} />
        <TaxBadge label="No Disc" active={item.noDisc === true} activeClass="bg-amber-500 text-white border-amber-500"
          onClick={() => onToggleTax(item.id, { gst: gstOn, pst: pstOn, noDisc: !item.noDisc })} />

        <span className="flex-1" />

        {/* Move to section */}
        {otherSections.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowMove(v => !v)}
              className="text-[10px] text-stone-400 hover:text-stone-600 opacity-0 group-hover:opacity-100 transition-all px-1"
              title="Move to section"
            >
              ⇄
            </button>
            {showMove && (
              <div className="absolute right-0 bottom-full mb-1 bg-white border border-stone-200 rounded-lg shadow-lg z-10 min-w-[130px] py-1">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">Move to</p>
                {otherSections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { onMoveItem(item.id, s.id); setShowMove(false) }}
                    className="block w-full text-left px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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
