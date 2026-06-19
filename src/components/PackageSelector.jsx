import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const FSO_CATEGORY = 'c1000000-0000-0000-0000-000000000004'

function fmt(n) {
  return `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function PackageSelector({ funeralHomeId, selectedId, onSelect, onClear }) {
  const [packages, setPackages] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [itemsMap, setItemsMap] = useState({})

  const [casketPrices, setCasketPrices] = useState({})

  useEffect(() => {
    if (!funeralHomeId) return
    setLoading(true)
    async function load() {
      // Try new schema (casket_catalog); fall back to old (caskets) if migration not yet run
      let { data, error } = await supabase
        .from('packages')
        .select('id, name, total_price, sort_order, pkg_type, package_discount, default_casket_id, casket_catalog(id, name, description, image_url)')
        .eq('funeral_home_id', funeralHomeId)
        .order('sort_order')
      if (error) {
        ;({ data } = await supabase
          .from('packages')
          .select('id, name, total_price, sort_order, pkg_type, package_discount, default_casket_id')
          .eq('funeral_home_id', funeralHomeId)
          .order('sort_order'))
      }
      const pkgs = data || []
      setPackages(pkgs)
      const ids = pkgs.filter(p => p.default_casket_id).map(p => p.default_casket_id)
      if (ids.length) {
        const { data: prices } = await supabase
          .from('funeral_home_caskets')
          .select('catalog_id, price')
          .eq('funeral_home_id', funeralHomeId)
          .in('catalog_id', ids)
        setCasketPrices(Object.fromEntries((prices || []).map(r => [r.catalog_id, Number(r.price)])))
      }
      setLoading(false)
    }
    load()
  }, [funeralHomeId])

  async function loadItems(pkgId) {
    if (itemsMap[pkgId]) return
    // Try with is_optional + sort_order columns; fall back in stages if the
    // sort_order migration hasn't been run yet (must not drop is_optional —
    // that flag drives the optional add-on checkboxes for every funeral home).
    let { data, error } = await supabase
      .from('package_items')
      .select('quantity, is_optional, sort_order, service_items(id, name, price, category_id)')
      .eq('package_id', pkgId)
      .order('sort_order')
    if (error) {
      ;({ data, error } = await supabase
        .from('package_items')
        .select('quantity, is_optional, service_items(id, name, price, category_id)')
        .eq('package_id', pkgId))
    }
    if (error) {
      ;({ data } = await supabase
        .from('package_items')
        .select('quantity, service_items(id, name, price, category_id)')
        .eq('package_id', pkgId))
    }
    const mapped = (data || []).map(r => ({
      serviceItemId: r.service_items.id,
      name:          r.service_items.name,
      price:         Number(r.service_items.price || 0),
      quantity:      r.quantity,
      categoryId:    r.service_items.category_id,
      isOptional:    r.is_optional || false,
    }))

    // If the package includes any Family Support Option item, replace all FSO
    // entries with the complete FSO catalog for this funeral home so the picker
    // shows every available option (not just the ones listed in package_items).
    // The number of FSO rows in package_items tells us how many the family gets
    // to select (e.g. 1 for most plans, 2 for Jade plans).
    const fsoInPkg = mapped.filter(i => i.categoryId === FSO_CATEGORY)
    const hasFso   = fsoInPkg.length > 0
    if (hasFso) {
      const fsoCount = fsoInPkg.length
      const { data: fsoData } = await supabase
        .from('service_items')
        .select('id, name, price')
        .eq('funeral_home_id', funeralHomeId)
        .eq('category_id', FSO_CATEGORY)
        .order('sort_order')
      const allFso = (fsoData || []).map(si => ({
        serviceItemId: si.id,
        name:          si.name,
        price:         Number(si.price || 0),
        quantity:      1,
        categoryId:    FSO_CATEGORY,
        isOptional:    true,
        fsoCount,
      }))
      setItemsMap(m => ({
        ...m,
        [pkgId]: [...mapped.filter(i => i.categoryId !== FSO_CATEGORY), ...allFso],
      }))
    } else {
      setItemsMap(m => ({ ...m, [pkgId]: mapped }))
    }
  }

  function toggle(pkgId) {
    setExpanded(e => e === pkgId ? null : pkgId)
    loadItems(pkgId)
  }

  async function selectPackage(pkg) {
    if (!itemsMap[pkg.id]) await loadItems(pkg.id)
    const cat = pkg.casket_catalog
    const defaultCasket = cat ? {
      id:          cat.id,
      name:        cat.name,
      price:       casketPrices[cat.id] ?? 0,
      description: cat.description || null,
      imageUrl:    cat.image_url || null,
    } : null
    onSelect(pkg.id, itemsMap[pkg.id] || [], pkg.package_discount || 0, pkg.name, defaultCasket)
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
  const fsoItems     = (items || []).filter(i => i.categoryId === FSO_CATEGORY)
  const nonFsoItems  = (items || []).filter(i => i.categoryId !== FSO_CATEGORY)
  const fsoCount     = fsoItems[0]?.fsoCount ?? 0
  const displayItems = [
    ...nonFsoItems,
    ...(fsoCount > 0 ? [{
      name:       `Family Support Option (select ${fsoCount})`,
      price:      fsoItems[0]?.price ?? 0,
      isOptional: true,
    }] : []),
  ]

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
              {displayItems.map((item, i) => (
                <li key={i} className="flex justify-between text-xs">
                  <span className={item.isOptional ? 'text-stone-400 italic' : 'text-stone-600'}>{item.name}</span>
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
