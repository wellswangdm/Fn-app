import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

const TIERS = [
  { label: 'Premium',  min: 4000 },
  { label: 'Standard', min: 3000 },
  { label: 'Value',    min: 0    },
]

export default function CasketPicker({ currentCasketId, onSelect, onClose }) {
  const [caskets,  setCaskets]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    supabase
      .from('service_items')
      .select('id, name, price, description')
      .eq('is_casket', true)
      .order('price', { ascending: false })
      .then(({ data }) => {
        const rows = data || []
        setCaskets(rows)
        setSelected(rows.find(c => c.id === currentCasketId) || null)
        setLoading(false)
      })
  }, [])

  function confirm() {
    if (selected) onSelect(selected)
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
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {selected?.id === c.id && (
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0" />
                              )}
                              <p className={`text-sm font-semibold ${selected?.id === c.id ? 'text-primary-800' : 'text-stone-800'}`}>
                                {c.name}
                              </p>
                            </div>
                            {c.description && (
                              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed pl-3.5">
                                {c.description}
                              </p>
                            )}
                          </div>
                          <span className={`text-sm font-bold shrink-0 mt-0.5 ${
                            selected?.id === c.id ? 'text-primary-700' : 'text-stone-600'
                          }`}>
                            {fmt(c.price)}
                          </span>
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
            <button
              onClick={confirm}
              disabled={!selected}
              className="btn-primary text-xs py-1.5 disabled:opacity-40"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
