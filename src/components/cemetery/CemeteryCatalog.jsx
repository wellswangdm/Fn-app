import { useMemo, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Cemetery catalogue picker
//
// Mirrors the old app's two-level navigation — Property / Merchandise and
// Services, then a group, then a category filter and search — but groups by
// real categories rather than by which spreadsheet a row came from.
//
// One deliberate improvement: each row shows the fee lines it will ADD before
// you add it. In the old app picking a flat marker silently produced four
// lines; here you can see the granite base, installation and ECF coming.
// ─────────────────────────────────────────────────────────────────────────────

const MS = 'Merchandise and Services'

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function specLine(p) {
  return [p.series, p.model, p.variant, p.size, p.color, p.dimensions,
          p.vase_included === true ? `vase${p.vase_count ? ` ×${p.vase_count}` : ''}` : null]
    .filter(Boolean).join(' · ')
}

/** The fee lines a product will add, for the preview chips. */
function feePreview(p, showChinese) {
  const c = p.category || {}
  const out = []
  if (p.base_price > 0) {
    out.push({
      label: showChinese
        ? [p.base_size, c.base_label_suffix_zh].filter(Boolean).join(' ')
        : [p.base_size, c.base_label_suffix].filter(Boolean).join(' '),
      amount: p.base_price,
    })
  }
  if (p.install_price > 0) {
    out.push({ label: (showChinese ? c.install_label_zh : c.install_label) || 'Installation', amount: p.install_price })
  }
  if (p.ecf_price > 0) {
    out.push({ label: (showChinese ? c.ecf_label_zh : c.ecf_label) || 'ECF', amount: p.ecf_price })
  }
  return out
}

export default function CemeteryCatalog({
  properties = [], products = [], services = [],
  onAddProperty, onAddProduct, onAddService, onAddCustom,
  showChinese = false,
}) {
  const [section,  setSection]  = useState('Property')
  const [groupId,  setGroupId]  = useState('')
  const [subFilter, setSubFilter] = useState('')
  const [search,   setSearch]   = useState('')

  const [showCustom,  setShowCustom]  = useState(false)
  const [cName,       setCName]       = useState('')
  const [cNameZh,     setCNameZh]     = useState('')
  const [cPrice,      setCPrice]      = useState('')
  const [cEcf,        setCEcf]        = useState(false)

  // ── Groups available in the current section ───────────────────────────────
  const groups = useMemo(() => {
    if (section === 'Property') {
      const m = new Map()
      for (const p of properties) {
        if (!m.has(p.typeId)) m.set(p.typeId, { id: p.typeId, name: p.typeName, nameZh: p.typeNameZh, sort: 0 })
      }
      return [...m.values()]
    }
    const m = new Map()
    for (const p of products) {
      if (!m.has(p.categoryId)) m.set(p.categoryId, { id: p.categoryId, name: p.categoryName, nameZh: p.categoryNameZh, sort: p.categorySort, kind: 'product' })
    }
    for (const s of services) {
      const key = `svc:${s.categoryId}`
      if (!m.has(key)) m.set(key, { id: key, name: s.categoryName, nameZh: s.categoryNameZh, sort: 50 + s.categorySort, kind: 'service' })
    }
    return [...m.values()].sort((a, b) => a.sort - b.sort)
  }, [section, properties, products, services])

  const activeGroup = groupId || groups[0]?.id || ''

  // ── Sub-filter values (garden for properties, series for products) ────────
  const subOptions = useMemo(() => {
    if (section === 'Property') {
      return [...new Set(properties.filter(p => p.typeId === activeGroup).map(p => p.section))]
        .filter(Boolean).sort()
    }
    if (String(activeGroup).startsWith('svc:')) return []
    return [...new Set(products.filter(p => p.categoryId === activeGroup).map(p => p.series))]
      .filter(Boolean).sort()
  }, [section, activeGroup, properties, products])

  const matches = s => !search || String(s || '').toLowerCase().includes(search.toLowerCase())

  const rows = useMemo(() => {
    if (section === 'Property') {
      return properties.filter(p =>
        p.typeId === activeGroup &&
        (!subFilter || p.section === subFilter) &&
        (matches(p.name) || matches(p.name_zh) || matches(p.section)))
    }
    if (String(activeGroup).startsWith('svc:')) {
      const catId = String(activeGroup).slice(4)
      return services.filter(s => String(s.categoryId) === catId &&
        (matches(s.name) || matches(s.name_zh) || matches(s.hmis_code)))
    }
    return products.filter(p =>
      p.categoryId === activeGroup &&
      (!subFilter || p.series === subFilter) &&
      (matches(p.name) || matches(p.name_zh) || matches(p.hmis_code) || matches(p.size)))
  }, [section, activeGroup, subFilter, search, properties, products, services])

  const isServiceGroup = String(activeGroup).startsWith('svc:')

  function switchSection(next) {
    setSection(next); setGroupId(''); setSubFilter(''); setSearch('')
  }
  function switchGroup(next) {
    setGroupId(next); setSubFilter('')
  }

  function addCustom() {
    const name  = cName.trim()
    const price = parseFloat(cPrice)
    if (!name || isNaN(price)) return
    onAddCustom({ name, nameZh: cNameZh.trim() || name, price, section, ecfIncluded: section === 'Property' && cEcf })
    setCName(''); setCNameZh(''); setCPrice(''); setCEcf(false)
  }

  return (
    <div className="space-y-3">

      {/* Section switch */}
      <div className="flex bg-stone-100 p-0.5 rounded-lg">
        {['Property', MS].map(s => (
          <button
            key={s}
            onClick={() => switchSection(s)}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              section === s ? 'bg-white text-primary-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {s === 'Property'
              ? (showChinese ? '墓地選擇' : 'Property')
              : (showChinese ? '服務及項目' : 'Merchandise & Services')}
          </button>
        ))}
      </div>

      {/* Group */}
      <div className="flex flex-col sm:flex-row gap-2">
        <select className="input sm:flex-1 text-sm" value={activeGroup} onChange={e => switchGroup(e.target.value)}>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{showChinese && g.nameZh ? g.nameZh : g.name}</option>
          ))}
        </select>
        {subOptions.length > 0 && (
          <select className="input sm:w-48 text-sm" value={subFilter} onChange={e => setSubFilter(e.target.value)}>
            <option value="">{section === 'Property' ? 'All sections' : 'All series'}</option>
            {subOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        )}
      </div>

      <input
        className="input text-sm"
        placeholder={showChinese ? '搜尋…' : 'Search…'}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Custom item */}
      <div>
        <button
          onClick={() => setShowCustom(v => !v)}
          className="text-xs font-medium text-primary-700 hover:text-primary-800 flex items-center gap-1"
        >
          <span className="text-base leading-none">{showCustom ? '−' : '+'}</span>
          {showChinese ? '自訂項目' : 'Add custom item'}
        </button>
        {showCustom && (
          <div className="mt-2 p-3 rounded-lg border border-stone-200 bg-stone-50 space-y-2">
            <input className="input text-sm" placeholder="Item name" value={cName}
                   onChange={e => setCName(e.target.value)} />
            <input className="input text-sm" placeholder="中文名稱 (optional)" value={cNameZh}
                   onChange={e => setCNameZh(e.target.value)} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">$</span>
              <input type="number" min="0" step="0.01" className="input w-32 text-sm" placeholder="0.00"
                     value={cPrice} onChange={e => setCPrice(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && addCustom()} />
              <button onClick={addCustom} disabled={!cName.trim() || cPrice === ''}
                      className="btn-primary text-sm px-4 py-1.5 ml-auto">Add</button>
            </div>
            {section === 'Property' && (
              <label className="flex items-center gap-2 text-xs text-stone-600">
                <input type="checkbox" checked={cEcf} onChange={e => setCEcf(e.target.checked)}
                       className="w-4 h-4 rounded text-primary-600" />
                Price includes ECF (90/10 rule)
              </label>
            )}
          </div>
        )}
      </div>

      {/* Rows */}
      <div className="space-y-px max-h-[460px] overflow-y-auto pr-0.5">
        {rows.length === 0 && (
          <p className="text-xs text-stone-400 py-6 text-center">Nothing matches.</p>
        )}

        {section === 'Property' && rows.map(p => (
          <Row
            key={p.id}
            title={showChinese && p.name_zh ? p.name_zh : p.name}
            subtitle={[p.section, p.interment_rights ? `${p.interment_rights} rights` : null,
                       p.marker_type_allowed && p.marker_type_allowed !== 'N/A' ? p.marker_type_allowed : null]
                      .filter(Boolean).join(' · ')}
            hmis={p.hmis_code}
            price={p.price}
            fees={!p.ecf_included && p.ecf_price > 0
              ? [{ label: showChinese ? '管理基金' : 'ECF', amount: p.ecf_price }] : []}
            badge={p.ecf_included ? (showChinese ? '含管理基金' : 'ECF incl.') : null}
            onAdd={() => onAddProperty(p)}
          />
        ))}

        {section === MS && isServiceGroup && rows.map(s => (
          <Row
            key={s.id}
            title={showChinese && s.name_zh ? s.name_zh : s.name}
            subtitle={s.description || ''}
            hmis={s.hmis_code}
            price={s.price}
            onAdd={() => onAddService(s)}
          />
        ))}

        {section === MS && !isServiceGroup && rows.map(p => (
          <Row
            key={p.id}
            title={showChinese && p.name_zh ? p.name_zh : p.name}
            subtitle={specLine(p)}
            hmis={p.hmis_code}
            price={p.price}
            fees={feePreview(p, showChinese)}
            onAdd={() => onAddProduct(p)}
          />
        ))}
      </div>
    </div>
  )
}

function Row({ title, subtitle, hmis, price, fees = [], badge, onAdd }) {
  const feeTotal = fees.reduce((s, f) => s + Number(f.amount || 0), 0)
  return (
    <div className="group flex items-start gap-2 px-3 py-2.5 rounded-lg border border-transparent
                    hover:border-stone-200 hover:bg-stone-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-stone-700 leading-snug">{title}</span>
          <span className="text-sm font-semibold text-stone-600 whitespace-nowrap shrink-0">{fmt(price)}</span>
        </div>

        {subtitle && <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{subtitle}</p>}

        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          {/* HMIS is advisor-only context; this picker is never shown to a customer. */}
          {hmis && (
            <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
              {hmis}
            </span>
          )}
          {badge && (
            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
          {fees.map((f, i) => (
            <span key={i} className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
              + {f.label} {fmt(f.amount)}
            </span>
          ))}
        </div>

        {feeTotal > 0 && (
          <p className="text-[11px] text-stone-400 mt-1">
            Adds {fmt(Number(price) + feeTotal)} in total
          </p>
        )}
      </div>

      <button
        onClick={onAdd}
        className="shrink-0 text-xs font-medium bg-primary-700 text-white px-2.5 py-1 rounded-lg
                   opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-primary-800"
      >
        + Add
      </button>
    </div>
  )
}
