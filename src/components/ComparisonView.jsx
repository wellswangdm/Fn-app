import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

const SECTION_ORDER  = ['sec-main', 'sec-third-party', 'sec-extra']
const SECTION_LABELS = {
  'sec-main':        'Guaranteed Items',
  'sec-third-party': 'Third Party Items',
  'sec-extra':       'Additional Items',
}

const STATUS_CLS = {
  draft:     'bg-amber-50 text-amber-600 border-amber-200',
  finalized: 'bg-blue-50 text-blue-600 border-blue-200',
  accepted:  'bg-green-50 text-green-600 border-green-200',
}

export default function ComparisonView({ contactId, currentQuoteId, onClose }) {
  const [quotes,       setQuotes]       = useState([])
  const [itemsByQuote, setItemsByQuote] = useState({})
  const [selected,     setSelected]     = useState(new Set())
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    async function load() {
      const { data: qs } = await supabase
        .from('quotes')
        .select('id, quote_number, status, total, subtotal, package_discount, discount_amount, tax_amount, arrangement_type, created_at, packages(name)')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: true })

      if (!qs?.length) { setLoading(false); return }

      const { data: items } = await supabase
        .from('quote_items')
        .select('*')
        .in('quote_id', qs.map(q => q.id))

      const grouped = {}
      qs.forEach(q => { grouped[q.id] = [] })
      ;(items || []).forEach(i => { grouped[i.quote_id]?.push(i) })

      setQuotes(qs)
      setItemsByQuote(grouped)
      setSelected(new Set(qs.map(q => q.id)))
      setLoading(false)
    }
    load()
  }, [contactId])

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const shown = quotes.filter(q => selected.has(q.id))

  // Build merged section/item rows across all shown versions
  function buildSections() {
    const sectionMap = new Map() // sectionId -> Map(itemKey -> { name, prices })

    shown.forEach(q => {
      ;(itemsByQuote[q.id] || []).forEach(item => {
        const sectionId = item.section_id || 'sec-extra'
        if (!sectionMap.has(sectionId)) sectionMap.set(sectionId, new Map())
        const key = item.service_item_id || item.casket_id || item.name
        const sec = sectionMap.get(sectionId)
        if (!sec.has(key)) sec.set(key, { name: item.name, prices: {} })
        sec.get(key).prices[q.id] = item.price * item.quantity
      })
    })

    // Return in canonical section order, then any extras
    const allSectionIds = [...new Set([...SECTION_ORDER, ...sectionMap.keys()])]
    return allSectionIds
      .filter(id => sectionMap.has(id))
      .map(id => ({ sectionId: id, rows: [...sectionMap.get(id).values()] }))
  }

  const sections = shown.length ? buildSections() : []

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-4">

        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-800">Compare Versions</h2>
            <p className="text-xs text-stone-400 mt-0.5">Toggle versions to include or exclude them</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
        </div>

        {loading ? <p className="text-sm text-stone-400 p-8 text-center">Loading…</p> : (
          <>
            {/* Version toggle pills */}
            <div className="flex gap-2 px-6 py-3 border-b border-stone-100 flex-wrap bg-stone-50/60">
              {quotes.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => toggle(q.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                    selected.has(q.id)
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selected.has(q.id) ? 'bg-primary-500' : 'bg-stone-300'}`} />
                  V{i + 1}
                  {q.id === currentQuoteId && <span className="text-[10px] opacity-60">current</span>}
                </button>
              ))}
            </div>

            {shown.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-16">Select at least one version.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  {/* Version header */}
                  <thead>
                    <tr className="border-b-2 border-stone-100">
                      <th className="text-left px-6 py-5 text-xs font-semibold uppercase tracking-wider text-stone-400 w-56 min-w-[14rem]">
                        Item
                      </th>
                      {shown.map((q, idx) => (
                        <th key={q.id} className="px-5 py-5 text-center min-w-[160px]">
                          <p className={`text-base font-bold ${q.id === currentQuoteId ? 'text-primary-700' : 'text-stone-800'}`}>
                            V{quotes.indexOf(q) + 1}
                          </p>
                          <p className="text-xs text-stone-400 font-normal mt-0.5">{q.packages?.name || 'No package'}</p>
                          <p className="text-[11px] text-stone-400 font-normal capitalize mt-0.5">{q.arrangement_type}</p>
                          <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CLS[q.status] || 'bg-stone-100 text-stone-500 border-stone-200'}`}>
                            {q.status}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Line items by section */}
                    {sections.map(({ sectionId, rows }) => (
                      <>
                        <tr key={`hd-${sectionId}`} className="bg-stone-50">
                          <td colSpan={shown.length + 1} className="px-6 py-2.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                              {SECTION_LABELS[sectionId] || sectionId}
                            </span>
                          </td>
                        </tr>
                        {rows.map(row => (
                          <tr key={`${sectionId}-${row.name}`} className="border-b border-stone-50 hover:bg-stone-50/40 transition-colors">
                            <td className="px-6 py-2.5 text-sm text-stone-600 leading-snug">{row.name}</td>
                            {shown.map(q => (
                              <td key={q.id} className="px-5 py-2.5 text-center text-sm">
                                {row.prices[q.id] != null
                                  ? <span className="font-medium text-stone-700">{fmt(row.prices[q.id])}</span>
                                  : <span className="text-stone-300">—</span>
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}

                    {/* Summary */}
                    <tr className="bg-stone-50">
                      <td colSpan={shown.length + 1} className="px-6 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Summary</span>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="px-6 py-2.5 text-sm text-stone-500">Subtotal</td>
                      {shown.map(q => <td key={q.id} className="px-5 py-2.5 text-center text-sm text-stone-700">{fmt(q.subtotal)}</td>)}
                    </tr>
                    {shown.some(q => q.package_discount > 0) && (
                      <tr className="border-b border-stone-100">
                        <td className="px-6 py-2.5 text-sm text-stone-500">Package Discount</td>
                        {shown.map(q => (
                          <td key={q.id} className="px-5 py-2.5 text-center text-sm text-emerald-600">
                            {q.package_discount > 0 ? `−${fmt(q.package_discount)}` : <span className="text-stone-300">—</span>}
                          </td>
                        ))}
                      </tr>
                    )}
                    {shown.some(q => (q.discount_amount - (q.package_discount || 0)) > 0) && (
                      <tr className="border-b border-stone-100">
                        <td className="px-6 py-2.5 text-sm text-stone-500">Additional Discount</td>
                        {shown.map(q => {
                          const d = q.discount_amount - (q.package_discount || 0)
                          return (
                            <td key={q.id} className="px-5 py-2.5 text-center text-sm text-red-500">
                              {d > 0 ? `−${fmt(d)}` : <span className="text-stone-300">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    )}
                    <tr className="border-b border-stone-100">
                      <td className="px-6 py-2.5 text-sm text-stone-500">Tax</td>
                      {shown.map(q => <td key={q.id} className="px-5 py-2.5 text-center text-sm text-stone-600">{fmt(q.tax_amount)}</td>)}
                    </tr>
                    <tr className="border-t-2 border-stone-200">
                      <td className="px-6 py-5 text-sm font-bold text-stone-800">Total</td>
                      {shown.map(q => (
                        <td key={q.id} className="px-5 py-5 text-center">
                          <span className="text-xl font-bold text-primary-800">{fmt(q.total)}</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
