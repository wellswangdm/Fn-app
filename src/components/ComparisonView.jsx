import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) { return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}` }

export default function ComparisonView({ contactId, currentQuoteId, onClose }) {
  const [quotes, setQuotes] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('quotes')
      .select('id, quote_number, status, total, subtotal, package_discount, discount_amount, tax_amount, arrangement_type, created_at, packages(name)')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setQuotes(data || [])
        setSelected(new Set((data || []).map(q => q.id)))
        setLoading(false)
      })
  }, [contactId])

  const shown = quotes.filter(q => selected.has(q.id))

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const rows = [
    { label: 'Package',      val: q => q.packages?.name || '—' },
    { label: 'Type',         val: q => q.arrangement_type || '—' },
    { label: 'Subtotal',     val: q => fmt(q.subtotal) },
    { label: 'Pkg Discount', val: q => q.package_discount > 0 ? `−${fmt(q.package_discount)}` : '—' },
    { label: 'Discount',     val: q => q.discount_amount > 0 ? `−${fmt(q.discount_amount)}` : '—' },
    { label: 'Tax',          val: q => fmt(q.tax_amount) },
    { label: 'Total',        val: q => fmt(q.total), bold: true },
    { label: 'Status',       val: q => q.status },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-stone-800">Compare Versions</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
        </div>

        {loading ? <p className="text-sm text-stone-400 p-6">Loading…</p> : (
          <div className="overflow-auto flex-1 p-6">
            {/* Version checkboxes */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {quotes.map((q, i) => (
                <label key={q.id} className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input type="checkbox" checked={selected.has(q.id)} onChange={() => toggle(q.id)}
                    className="accent-primary-700" />
                  <span className={q.id === currentQuoteId ? 'font-semibold text-primary-700' : 'text-stone-600'}>
                    V{i + 1} — {q.quote_number}
                  </span>
                </label>
              ))}
            </div>

            {shown.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-8">Select at least one version to compare.</p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 pb-3 pr-4 w-32" />
                    {shown.map((q, i) => (
                      <th key={q.id} className={`text-center pb-3 px-3 text-xs font-semibold ${q.id === currentQuoteId ? 'text-primary-700' : 'text-stone-600'}`}>
                        V{quotes.indexOf(q) + 1}
                        {q.id === currentQuoteId && <span className="ml-1 text-[10px] text-primary-400">(current)</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.label} className="border-t border-stone-100">
                      <td className="py-2.5 pr-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">{row.label}</td>
                      {shown.map(q => (
                        <td key={q.id} className={`py-2.5 px-3 text-center text-sm ${row.bold ? 'font-bold text-primary-800' : 'text-stone-600'} capitalize`}>
                          {row.val(q)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
