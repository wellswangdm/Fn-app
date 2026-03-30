import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n, min, max) {
  if (n != null) return `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
  if (min != null && max != null) return `$${Number(min).toLocaleString('en-CA', { minimumFractionDigits: 2 })} – $${Number(max).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
  return 'As selected'
}

export default function ItemBrowser({ funeralHomeId, onAdd }) {
  const [categories, setCategories] = useState([])
  const [items,      setItems]      = useState([])
  const [loading,    setLoading]    = useState(false)
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('all')
  const [cashPrices, setCashPrices] = useState({}) // itemId -> custom price

  useEffect(() => {
    if (!funeralHomeId) return
    setLoading(true)
    Promise.all([
      supabase.from('service_categories').select('id, name').order('sort_order'),
      supabase
        .from('service_items')
        .select('id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, service_categories(name)')
        .eq('funeral_home_id', funeralHomeId)
        .order('name'),
    ]).then(([{ data: cats }, { data: itms }]) => {
      setCategories(cats || [])
      setItems(itms || [])
      setLoading(false)
    })
  }, [funeralHomeId])

  const filtered = items.filter(item => {
    const matchesCat    = catFilter === 'all' || item.category_id === catFilter
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  function addItem(item) {
    const price = item.is_cash_advance
      ? Number(cashPrices[item.id] || 0)
      : Number(item.price ?? item.price_min ?? 0)
    onAdd({
      serviceItemId: item.id,
      name:          item.name,
      price,
    })
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          className="input flex-1"
          placeholder="Search items…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input sm:w-56"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading items…</p>}

      {!loading && (
        <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">No items found.</p>
          )}
          {filtered.map(item => (
            <div
              key={item.id}
              className="flex items-start gap-2 px-3 py-2 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-gray-800 leading-snug">{item.name}</span>
                  <span className="text-sm text-gray-600 whitespace-nowrap font-semibold">
                    {fmt(item.price, item.price_min, item.price_max)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                )}
                <span className="text-xs text-gray-400">{item.service_categories?.name}</span>

                {/* Cash advance: allow custom price input */}
                {item.is_cash_advance && (
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-xs text-gray-500">Amount: $</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input text-xs py-0.5 px-1 w-24"
                      placeholder="0.00"
                      value={cashPrices[item.id] || ''}
                      onChange={e => setCashPrices(p => ({ ...p, [item.id]: e.target.value }))}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => addItem(item)}
                className="shrink-0 text-xs bg-primary-600 text-white px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-700"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
