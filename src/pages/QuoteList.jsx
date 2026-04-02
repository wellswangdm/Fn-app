import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

const STATUS = {
  draft:     { label: 'Draft',     cls: 'bg-amber-50 text-amber-600 border-amber-200'  },
  finalized: { label: 'Finalized', cls: 'bg-blue-50 text-blue-600 border-blue-200'     },
  accepted:  { label: 'Accepted',  cls: 'bg-green-50 text-green-600 border-green-200'  },
}

export default function QuoteList({ onNew, onEdit }) {
  const [quotes,   setQuotes]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => { loadQuotes() }, [])

  async function loadQuotes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('quotes')
      .select('id, deceased_name, customer_name, status, total, created_at, funeral_homes(name)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setQuotes(data)
    setLoading(false)
  }

  async function deleteQuote(id) {
    if (!window.confirm('Delete this quote? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('quotes').delete().eq('id', id)
    setQuotes(q => q.filter(x => x.id !== id))
    setDeleting(null)
  }

  const filtered = quotes.filter(q => {
    const s = search.toLowerCase()
    return !s || q.deceased_name?.toLowerCase().includes(s) || q.customer_name?.toLowerCase().includes(s)
  })

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <header className="bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Funeral Quote</h1>
            <p className="text-primary-300 text-xs mt-0.5">Service quotation manager</p>
          </div>
          <button
            onClick={onNew}
            className="text-sm font-medium bg-white text-primary-800 px-4 py-2 rounded-lg
                       hover:bg-stone-100 transition-colors shadow-sm"
          >
            + New Quote
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">

        {/* Search */}
        <div className="mb-5">
          <input
            className="input max-w-xs text-sm"
            placeholder="Search by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="text-sm text-stone-400">Loading…</p>}
        {error   && <p className="text-sm text-red-500">Error: {error}</p>}

        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-stone-400 text-sm mb-3">No quotes yet</p>
              <button onClick={onNew} className="btn-primary">Create your first quote</button>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/80">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Deceased</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Funeral Home</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Total</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map(q => {
                    const s = STATUS[q.status] || { label: q.status, cls: 'bg-stone-100 text-stone-500' }
                    return (
                      <tr
                        key={q.id}
                        className="hover:bg-stone-50/60 transition-colors cursor-pointer"
                        onClick={() => onEdit(q.id)}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-stone-800">
                          {q.deceased_name || <span className="text-stone-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-stone-500">
                          {q.customer_name || <span className="text-stone-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-400">
                          {q.funeral_homes?.name || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-stone-700">
                          {fmt(q.total)}
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-400">
                          {new Date(q.created_at).toLocaleDateString('en-CA')}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => deleteQuote(q.id)}
                            disabled={deleting === q.id}
                            className="text-xs text-stone-300 hover:text-red-400 disabled:opacity-40 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  )
}
