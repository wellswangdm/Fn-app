import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Cemetery quote line table
//
// Keeps the old app's working model exactly: per-line GST / PST / Non-Disc /
// Waive toggles, a quantity stepper, reordering within a section, and the
// Property / Merchandise split.
//
// Two things the old table could not do:
//   * automatic fee lines are indented under the product that produced them,
//     and removing the product removes them
//   * line order is explicit (the dollar-waive allocation depends on it), so
//     the move controls say which way they shift
// ─────────────────────────────────────────────────────────────────────────────

const MS = 'Merchandise and Services'

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function CemeteryLineTable({
  lines = [], netByLine = {}, showChinese = false, showHmis = false,
  onRemove, onQuantity, onToggle, onMove,
}) {
  const property = lines.filter(l => l.section === 'Property')
  const ms       = lines.filter(l => l.section === MS)
  const other    = lines.filter(l => l.section !== 'Property' && l.section !== MS)

  if (lines.length === 0) {
    return (
      <div className="card p-10 text-center border-dashed">
        <p className="text-sm text-stone-400">
          {showChinese ? '尚未加入任何項目。' : 'No items yet — add them from the catalogue.'}
        </p>
      </div>
    )
  }

  const groups = [
    ['Property', showChinese ? '墓地選擇' : 'Property', property],
    [MS,         showChinese ? '服務及項目' : 'Merchandise & Services', ms],
    ...(other.length ? [['other', 'Other', other]] : []),
  ].filter(([, , g]) => g.length > 0)

  return (
    <div className="space-y-4">
      {groups.map(([key, label, group]) => (
        <div key={key} className="card overflow-hidden">
          <div className="px-4 py-2 bg-stone-50 border-b border-stone-200/70 flex justify-between items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">{label}</span>
            <span className="text-[11px] text-stone-400">
              {group.length} {showChinese ? '項' : group.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {group.map((l, i) => (
              <LineRow
                key={l.id}
                line={l}
                net={netByLine[l.id]}
                isChild={!!l.parentItemId}
                first={i === 0}
                last={i === group.length - 1}
                showChinese={showChinese}
                showHmis={showHmis}
                onRemove={onRemove}
                onQuantity={onQuantity}
                onToggle={onToggle}
                onMove={onMove}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Chip({ on, onClick, children, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-700 text-white',
    amber:   'bg-amber-600 text-white',
    emerald: 'bg-emerald-600 text-white',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
        on ? tones[tone] : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
      }`}
    >
      {children}
    </button>
  )
}

function LineRow({ line: l, net, isChild, first, last, showChinese, showHmis,
                   onRemove, onQuantity, onToggle, onMove }) {
  const [open, setOpen] = useState(false)
  const name = showChinese ? (l.nameZh || l.name) : l.name
  const discounted = net != null && Math.abs(net - l.lineTotal) > 0.005 && !l.isWaived

  return (
    <div className={`px-4 py-3 ${isChild ? 'bg-stone-50/60' : ''} ${l.isWaived ? 'bg-emerald-50/40' : ''}`}>
      <div className="flex items-start gap-3">

        {isChild && (
          <span className="mt-1.5 text-stone-300 shrink-0" aria-hidden="true">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v10a4 4 0 0 0 4 4h12" strokeLinecap="round" />
            </svg>
          </span>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-sm leading-snug ${
                l.isWaived ? 'line-through text-stone-400'
                           : isChild ? 'text-stone-600' : 'font-medium text-stone-800'}`}>
                {name}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <span className="text-[11px] text-stone-400">{fmt(l.unitPrice)} / unit</span>
                {showHmis && l.hmisCode && (
                  <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    {l.hmisCode}
                  </span>
                )}
                {l.ecfIncluded && l.section === 'Property' && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                    {showChinese ? '含管理基金' : 'ECF incl.'}
                  </span>
                )}
                {!l.isDiscountable && !l.isWaived && (
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                    {showChinese ? '不可折' : 'Non-disc'}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              {l.isWaived ? (
                <>
                  <p className="text-xs line-through text-stone-400">{fmt(l.lineTotal)}</p>
                  <p className="text-sm font-semibold text-emerald-700">{showChinese ? '已減免' : 'WAIVED'}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-stone-800">{fmt(l.lineTotal)}</p>
                  {discounted && (
                    <p className="text-[11px] text-primary-700">→ {fmt(net)}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onQuantity(l.id, l.quantity - 1)}
                disabled={l.quantity <= 1}
                className="w-7 h-7 rounded-md border border-stone-200 text-stone-600 text-sm
                           hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >−</button>
              <span className="w-7 text-center text-sm font-semibold text-stone-700">{l.quantity}</span>
              <button
                onClick={() => onQuantity(l.id, l.quantity + 1)}
                className="w-7 h-7 rounded-md border border-stone-200 text-stone-600 text-sm hover:bg-stone-50"
                aria-label="Increase quantity"
              >+</button>
            </div>

            <button
              onClick={() => setOpen(v => !v)}
              className="text-[11px] font-medium text-stone-400 hover:text-stone-600 px-2 py-1
                         rounded-md border border-stone-200 hover:border-stone-300"
            >
              {open ? (showChinese ? '收起' : 'Less') : (showChinese ? '選項' : 'Options')}
            </button>

            <div className="flex items-center gap-1 ml-auto">
              <button onClick={() => onMove(l.id, -1)} disabled={first}
                      className="w-7 h-7 rounded-md border border-stone-200 text-stone-500
                                 hover:bg-stone-50 disabled:opacity-25 disabled:cursor-not-allowed"
                      aria-label="Move up">
                <svg className="w-3.5 h-3.5 mx-auto" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button onClick={() => onMove(l.id, 1)} disabled={last}
                      className="w-7 h-7 rounded-md border border-stone-200 text-stone-500
                                 hover:bg-stone-50 disabled:opacity-25 disabled:cursor-not-allowed"
                      aria-label="Move down">
                <svg className="w-3.5 h-3.5 mx-auto" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button onClick={() => onRemove(l.id)}
                      className="w-7 h-7 rounded-md border border-stone-200 text-stone-400
                                 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                      aria-label="Remove line">
                <svg className="w-3.5 h-3.5 mx-auto" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {open && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-stone-100">
              <Chip on={l.isGst !== false} onClick={() => onToggle(l.id, 'isGst')}>
                GST {l.isGst !== false ? '✓' : ''}
              </Chip>
              <Chip on={l.isPst === true} onClick={() => onToggle(l.id, 'isPst')}>
                PST {l.isPst === true ? '✓' : ''}
              </Chip>
              <Chip on={!l.isDiscountable} tone="amber" onClick={() => onToggle(l.id, 'isDiscountable')}>
                {showChinese ? '不可折' : 'Non-Disc'} {!l.isDiscountable ? '✓' : ''}
              </Chip>
              <Chip on={!!l.isWaived} tone="emerald" onClick={() => onToggle(l.id, 'isWaived')}>
                {showChinese ? '減免' : 'Waive'} {l.isWaived ? '✓' : ''}
              </Chip>
              {l.section === 'Property' && (
                <Chip on={!!l.ecfIncluded} tone="amber" onClick={() => onToggle(l.id, 'ecfIncluded')}>
                  {showChinese ? '含管理基金' : 'ECF incl.'} {l.ecfIncluded ? '✓' : ''}
                </Chip>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
