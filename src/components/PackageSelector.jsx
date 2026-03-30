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
      .select('id, name, description, total_price, sort_order')
      .eq('funeral_home_id', funeralHomeId)
      .order('sort_order')
      .then(({ data }) => {
        setPackages(data || [])
        setLoading(false)
      })
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
    if (expanded === pkgId) {
      setExpanded(null)
    } else {
      setExpanded(pkgId)
      loadItems(pkgId)
    }
  }

  async function selectPackage(pkg) {
    if (!itemsMap[pkg.id]) await loadItems(pkg.id)
    onSelect(pkg.id, itemsMap[pkg.id] || [])
    setExpanded(pkg.id)
  }

  if (loading) return <p className="text-sm text-gray-400">Loading packages…</p>

  return (
    <div className="space-y-2">
      {selectedId && (
        <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg px-3 py-2 text-sm mb-3">
          <span className="text-primary-700 font-medium">
            Package selected: {packages.find(p => p.id === selectedId)?.name}
          </span>
          <button onClick={onClear} className="text-primary-500 hover:text-primary-700 text-xs">
            Clear package
          </button>
        </div>
      )}

      {packages.map(pkg => {
        const isSelected = selectedId === pkg.id
        const isExpanded = expanded === pkg.id
        const items      = itemsMap[pkg.id]

        return (
          <div
            key={pkg.id}
            className={`border rounded-lg overflow-hidden transition-colors ${
              isSelected ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center px-3 py-2.5 gap-2">
              <button
                onClick={() => selectPackage(pkg)}
                className={`flex-1 text-left`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium text-sm ${isSelected ? 'text-primary-800' : 'text-gray-800'}`}>
                    {pkg.name}
                    {isSelected && <span className="ml-2 text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-full">Selected</span>}
                  </span>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                    {fmt(pkg.total_price)}
                  </span>
                </div>
              </button>
              <button
                onClick={() => toggle(pkg.id)}
                className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
              >
                {isExpanded ? 'Hide' : 'Details'}
              </button>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 px-3 py-2 bg-white">
                {!items ? (
                  <p className="text-xs text-gray-400">Loading…</p>
                ) : (
                  <ul className="space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="flex justify-between text-xs text-gray-600">
                        <span>{item.name}</span>
                        <span className="ml-4 text-gray-500">{fmt(item.price)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
