import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) {
  return `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function PackageSelector({ funeralHomeId, selectedId, onSelect, onClear }) {
  const [packages, setPackages] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [itemsMap, setItemsMap] = useState({})

  useEffect(() => {
    if (!funeralHomeId) return
    setLoading(true)
    supabase
      .from('packages')
      .select('id, name, description, total_price, sort_order, pkg_type')
      .eq('funeral_home_id', funeralHomeId)
      .order('sort_order')
      .then(({ data }) => { setPackages(data || []); setLoading(false) })
  }, [funeralHomeId])

  async function loadItems(pkgId) {
    if (itemsMap[pkgId]) return
    const { data } = await supabase
      .from('package_items')
      .select('quantity, service_items(id, name, price)')
      .eq('package_id', pkgId)
    setItemsMap(m => ({
      ...m,
      [pkgId]: (data || []).map(r => ({
        serviceItemId: r.service_items.id,
        name:          r.service_items.name,
        price:         Number(r.service_items.price || 0),
        quantity:      r.quantity,
      })),
    }))
  }

  function toggle(pkgId) {
    setExpanded(e => e === pkgId ? null : pkgId)
    loadItems(pkgId)
  }

  async function selectPackage(pkg) {
    if (!itemsMap[pkg.id]) await loadItems(pkg.id)
    onSelect(pkg.id, itemsMap[pkg.id] || [])
    setExpanded(pkg.id)
  }

  if (loading) return <p className="text-xs text-stone-400 py-4">Loading packages…</p>

  const named    = packages.filter(p => p.pkg_type === 'package')
  const alacarte = packages.filter(p => p.pkg_type === 'alacarte')

  return (
    <div className="space-y-4">
      {selectedId && (
        <div className="flex items-center justify-between bg-primary-50 border border-primary-200/70
                        rounded-lg px-3 py-2">
          <span className="text-xs font-semibold text-primary-700">
            {packages.find(p => p.id === selectedId)?.name}
          </span>
          <button
            onClick={onClear}
            className="text-[11px] text-primary-500 hover:text-primary-800 font-medium"
          >
            Clear
          </button>
        </div>
      )}

      {/* Named packages */}
      {named.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2 px-0.5">
            Packages
          </p>
          <div className="space-y-2">
            {named.map(pkg => (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedId === pkg.id}
                isExpanded={expanded === pkg.id}
                items={itemsMap[pkg.id]}
                onSelect={() => selectPackage(pkg)}
                onToggle={() => toggle(pkg.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* A La Carte */}
      {alacarte.length > 0 && (
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-2 px-0.5">
            A La Carte
          </p>
          <div className="space-y-2">
            {alacarte.map(pkg => (
              <PackageRow
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedId === pkg.id}
                isExpanded={expanded === pkg.id}
                items={itemsMap[pkg.id]}
                onSelect={() => selectPackage(pkg)}
                onToggle={() => toggle(pkg.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PackageRow({ pkg, isSelected, isExpanded, items, onSelect, onToggle }) {
  return (
    <div
      className={`rounded-lg border overflow-hidden transition-colors ${
        isSelected
          ? 'border-primary-300 bg-primary-50/60'
          : 'border-stone-200 bg-white hover:border-stone-300'
      }`}
    >
      <div className="flex items-center px-3 py-2.5 gap-2">
        <button onClick={onSelect} className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {isSelected && (
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600" />
              )}
              <span className={`text-sm font-medium truncate ${
                isSelected ? 'text-primary-800' : 'text-stone-700'
              }`}>
                {pkg.name}
              </span>
            </div>
            <span className={`text-sm font-semibold shrink-0 ${
              isSelected ? 'text-primary-700' : 'text-stone-600'
            }`}>
              {fmt(pkg.total_price)}
            </span>
          </div>
        </button>
        <button
          onClick={onToggle}
          className="shrink-0 text-[11px] font-medium text-stone-400 hover:text-stone-600
                     px-2 py-1 rounded border border-stone-200 hover:border-stone-300 transition-colors"
        >
          {isExpanded ? 'Hide' : 'Details'}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-stone-100 px-3 py-2.5 bg-white/80">
          {!items ? (
            <p className="text-xs text-stone-400">Loading…</p>
          ) : (
            <ul className="space-y-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex justify-between text-xs">
                  <span className="text-stone-600">{item.name}</span>
                  <span className="text-stone-400 ml-4 shrink-0">{fmt(item.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
