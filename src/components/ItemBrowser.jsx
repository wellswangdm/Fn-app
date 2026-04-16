import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n, min, max) {
  if (n != null) return `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
  if (min != null && max != null)
    return `$${Number(min).toLocaleString('en-CA', { minimumFractionDigits: 2 })} – $${Number(max).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
  return 'As selected'
}

export default function ItemBrowser({ funeralHomeId, onAdd }) {
  const [categories,   setCategories]   = useState([])
  const [items,        setItems]        = useState([])
  const [loading,      setLoading]      = useState(false)
  const [search,       setSearch]       = useState('')
  const [catFilter,    setCatFilter]    = useState('all')
  const [cashPrices,   setCashPrices]   = useState({})
  const [showCustom,   setShowCustom]   = useState(false)
  const [customName,   setCustomName]   = useState('')
  const [customPrice,  setCustomPrice]  = useState('')

  function addCustomItem() {
    const name  = customName.trim()
    const price = parseFloat(customPrice)
    if (!name || isNaN(price) || price < 0) return
    onAdd({ serviceItemId: null, name, price, isCustom: true })
    setCustomName('')
    setCustomPrice('')
    // keep form open so user can add more custom items without reopening
  }

  useEffect(() => {
    if (!funeralHomeId) return
    setLoading(true)
    Promise.all([
      supabase.from('service_categories').select('id, name').order('sort_order'),
      supabase
        .from('service_items')
        .select('id, category_id, item_code, name, description, price, price_min, price_max, is_cash_advance, is_casket, image_url, service_categories(name)')
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
      name: item.name,
      price,
      isCasket: item.is_casket || false,
      description: item.description || null,
      imageUrl: item.image_url || null,
    })
  }

  return (
    <div>
      {/* Custom item panel */}
      <div className="mb-3">
        <button
          onClick={() => setShowCustom(v => !v)}
          className="text-xs font-medium text-primary-700 hover:text-primary-800 flex items-center gap-1"
        >
          <span className="text-base leading-none">{showCustom ? '−' : '+'}</span>
          Add custom item
        </button>
        {showCustom && (
          <div className="mt-2 flex flex-col sm:flex-row gap-2 p-3 rounded-lg border border-stone-200 bg-stone-50">
            <input
              className="input flex-1 text-sm"
              placeholder="Item name"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustomItem()}
              autoFocus
            />
            <div className="flex items-center gap-1">
              <span className="text-sm text-stone-500">$</span>
              <input
                type="number" min="0" step="0.01"
                className="input w-28 text-sm"
                placeholder="0.00"
                value={customPrice}
                onChange={e => setCustomPrice(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomItem()}
              />
            </div>
            <button
              onClick={addCustomItem}
              disabled={!customName.trim() || customPrice === ''}
              className="btn-primary text-sm px-4 py-1.5 disabled:opacity-40"
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          className="input flex-1 text-sm"
          placeholder="Search items…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input sm:w-52 text-sm"
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-xs text-stone-400 py-4">Loading items…</p>}

      {!loading && (
        <div className="space-y-px max-h-[500px] overflow-y-auto pr-0.5">
          {filtered.length === 0 && (
            <p className="text-xs text-stone-400 py-6 text-center">No items found.</p>
          )}
          {filtered.map(item => (
            <div
              key={item.id}
              className="group flex items-start gap-2 px-3 py-2.5 rounded-lg
                         border border-transparent hover:border-stone-200 hover:bg-stone-50
                         transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-stone-700 leading-snug">{item.name}</span>
                  <span className="text-sm font-semibold text-stone-600 whitespace-nowrap shrink-0">
                    {fmt(item.price, item.price_min, item.price_max)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{item.description}</p>
                )}
                <span className="text-[11px] text-stone-400">{item.service_categories?.name}</span>

                {item.is_cash_advance && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-xs text-stone-500">Amount: $</span>
                    <input
                      type="number" min="0" step="0.01"
                      className="input text-xs py-0.5 px-2 w-24"
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
                className="shrink-0 text-xs font-medium bg-primary-700 text-white px-2.5 py-1 rounded-lg
                           opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-800"
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
