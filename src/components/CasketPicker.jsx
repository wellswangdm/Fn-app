import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const FSO_CATEGORY = 'c1000000-0000-0000-0000-000000000004'

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

const TIERS = [
  { label: 'Premium',   min: 4000 },
  { label: 'Standard',  min: 3000 },
  { label: 'Value',     min: 2500 },
  { label: 'Container', min: 0    },
]

export default function CasketPicker({ funeralHomeId, currentCasketId, optionalItems = [], onSelect, onClose }) {
  const [caskets,          setCaskets]          = useState([])
  const [loading,          setLoading]          = useState(true)
  const [selected,         setSelected]         = useState(null)
  const [checkedFso,       setCheckedFso]       = useState(new Set())
  const [checkedOptionals, setCheckedOptionals] = useState(new Set())

  const fsoItems       = optionalItems.filter(i => i.categoryId === FSO_CATEGORY)
  const otherOptionals = optionalItems.filter(i => i.categoryId !== FSO_CATEGORY)
  const fsoCount       = fsoItems[0]?.fsoCount ?? 1

  useEffect(() => {
    if (!funeralHomeId) return
    supabase
      .from('funeral_home_caskets')
      .select('price, sort_order, casket_catalog(id, name, description, image_url)')
      .eq('funeral_home_id', funeralHomeId)
      .order('price', { ascending: false })
      .then(({ data }) => {
        const rows = (data || []).map(r => ({
          id:          r.casket_catalog.id,
          name:        r.casket_catalog.name,
          price:       Number(r.price),
          description: r.casket_catalog.description,
          image_url:   r.casket_catalog.image_url,
        }))
        setCaskets(rows)
        setSelected(rows.find(c => c.id === currentCasketId) || null)
        setLoading(false)
      })
  }, [funeralHomeId])

  function toggleOptional(id) {
    setCheckedOptionals(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleFso(id) {
    setCheckedFso(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function confirm() {
    const selectedOptionals = [
      ...fsoItems.filter(i => checkedFso.has(i.serviceItemId)),
      ...otherOptionals.filter(i => checkedOptionals.has(i.serviceItemId)),
    ]
    onSelect(selected ? { ...selected, imageUrl: selected.image_url || null } : null, selectedOptionals)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-stone-800">Select Casket</h2>
            <p className="text-xs text-stone-400 mt-0.5">Choose the casket for this arrangement</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

          {/* Family Support Option — checkbox select with count hint */}
          {fsoItems.length > 0 && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <p className="text-xs font-semibold text-sky-800 mb-2">
                Family Support Option — select {fsoCount}
              </p>
              <div className="space-y-2">
                {fsoItems.map(item => (
                  <label key={item.serviceItemId} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedFso.has(item.serviceItemId)}
                      onChange={() => toggleFso(item.serviceItemId)}
                      className="w-4 h-4 accent-primary-700 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-stone-700 group-hover:text-stone-900">{item.name}</span>
                    <span className="text-sm font-semibold text-stone-500">{fmt(item.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Other optional add-ons — checkbox multi-select */}
          {otherOptionals.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800 mb-2">
                Optional add-ons included in this package
              </p>
              <div className="space-y-2">
                {otherOptionals.map(item => (
                  <label key={item.serviceItemId} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedOptionals.has(item.serviceItemId)}
                      onChange={() => toggleOptional(item.serviceItemId)}
                      className="w-4 h-4 accent-primary-700 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-stone-700 group-hover:text-stone-900">{item.name}</span>
                    <span className="text-sm font-semibold text-stone-500">{fmt(item.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-xs text-stone-400 text-center py-10">Loading caskets…</p>
          ) : (
            TIERS.map(tier => {
              const group = caskets.filter(c => c.price >= tier.min &&
                (tier === TIERS[TIERS.length - 1] || c.price < TIERS[TIERS.indexOf(tier) - 1]?.min))
              if (!group.length) return null
              return (
                <div key={tier.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2 px-1">
                    {tier.label}
                  </p>
                  <div className="space-y-1.5">
                    {group.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                          selected?.id === c.id
                            ? 'border-primary-400 bg-primary-50'
                            : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {c.image_url ? (
                            <img
                              src={c.image_url}
                              alt={c.name}
                              className="w-20 h-14 object-cover rounded-lg shrink-0 border border-stone-200"
                            />
                          ) : (
                            <div className="w-20 h-14 rounded-lg shrink-0 border border-stone-200 bg-stone-100 flex items-center justify-center">
                              <span className="text-stone-300 text-xl">⬜</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                {selected?.id === c.id && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0" />
                                )}
                                <p className={`text-sm font-semibold ${selected?.id === c.id ? 'text-primary-800' : 'text-stone-800'}`}>
                                  {c.name}
                                </p>
                              </div>
                              <span className={`text-sm font-bold shrink-0 ${
                                selected?.id === c.id ? 'text-primary-700' : 'text-stone-600'
                              }`}>
                                {fmt(c.price)}
                              </span>
                            </div>
                            {c.description && (
                              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                                {c.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between shrink-0">
          <p className="text-xs text-stone-400">
            {selected ? `Selected: ${selected.name} — ${fmt(selected.price)}` : 'No casket selected'}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-xs py-1.5">Cancel</button>
            <button onClick={confirm} className="btn-primary text-xs py-1.5">
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
