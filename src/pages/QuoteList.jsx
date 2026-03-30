import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const STATUS_COLORS = {
  draft:     'bg-yellow-100 text-yellow-800',
  finalized: 'bg-blue-100 text-blue-800',
  accepted:  'bg-green-100 text-green-800',
}

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function QuoteList({ onNew, onEdit }) {
  const [quotes,  setQuotes]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
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
    return !s
      || q.deceased_name?.toLowerCase().includes(s)
      || q.customer_name?.toLowerCase().includes(s)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-800 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Funeral Quote Calculator</h1>
            <p className="text-primary-200 text-sm">Manage service quotes</p>
          </div>
          <button onClick={onNew} className="btn-primary bg-white text-primary-800 hover:bg-gray-100">
            + New Quote
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-4">
          <input
            className="input max-w-sm"
            placeholder="Search by deceased or family name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="text-gray-500">Loading quotes…</p>}
        {error   && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="card p-12 text-center text-gray-400">
                <p className="text-lg mb-2">No quotes yet</p>
                <button onClick={onNew} className="btn-primary mt-2">Create your first quote</button>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Deceased</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Family Contact</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Funeral Home</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Total</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map(q => (
                      <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{q.deceased_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{q.customer_name || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{q.funeral_homes?.name || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[q.status] || ''}`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{fmt(q.total)}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(q.created_at).toLocaleDateString('en-CA')}
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-end">
                          <button
                            onClick={() => onEdit(q.id)}
                            className="btn-secondary text-xs px-3 py-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteQuote(q.id)}
                            disabled={deleting === q.id}
                            className="text-red-500 hover:text-red-700 text-xs px-2 py-1 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
