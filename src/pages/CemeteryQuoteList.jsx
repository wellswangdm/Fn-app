import { useEffect, useState } from 'react'
import { fetchQuotes, deleteQuote } from '../lib/cemetery.js'

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function when(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function CemeteryQuoteList({ park, onOpen, onNew, onCompare }) {
  const [tab,      setTab]      = useState('quotes')   // 'quotes' | 'templates'
  const [rows,     setRows]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [reloadAt, setReloadAt] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true); setError('')
    ;(async () => {
      try {
        const data = await fetchQuotes({ parkId: park.id, templates: tab === 'templates' })
        if (alive) setRows(data)
      } catch (e) {
        if (alive) setError(e.message || String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [park.id, tab, reloadAt])

  const filtered = rows.filter(r => {
    if (!search) return true
    const s = search.toLowerCase()
    return [r.client_name, r.template_name, r.quote_number]
      .some(v => String(v || '').toLowerCase().includes(s))
  })

  async function remove(r) {
    const label = r.client_name || r.template_name || 'this quote'
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
    try {
      await deleteQuote(r.id)
      setReloadAt(Date.now())
    } catch (e) {
      setError(e.message || String(e))
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex bg-stone-100 p-0.5 rounded-lg">
          {[['quotes', 'Quotes'], ['templates', 'Templates']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      tab === k ? 'bg-white text-primary-800 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={onCompare} className="btn-secondary text-xs">Compare</button>
          <button onClick={onNew} className="btn-primary text-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New quote
          </button>
        </div>
      </div>

      <input className="input text-sm" placeholder="Search by client, template or quote number…"
             value={search} onChange={e => setSearch(e.target.value)} />

      {error && (
        <div className="card p-3 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-stone-400 py-10 text-center">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center border-dashed">
          <p className="text-sm text-stone-500">
            {rows.length === 0
              ? (tab === 'templates' ? 'No templates saved yet.' : 'No quotes for this park yet.')
              : 'Nothing matches that search.'}
          </p>
          {rows.length === 0 && tab === 'quotes' && (
            <button onClick={onNew} className="btn-primary mt-4 text-xs">Create the first quote</button>
          )}
        </div>
      ) : (
        <div className="card divide-y divide-stone-100 overflow-hidden">
          {filtered.map(r => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors">
              <button onClick={() => onOpen(r.id)} className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">
                  {r.client_name || r.template_name || 'Untitled'}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {[when(r.updated_at), r.quote_number && `#${r.quote_number}`, r.status]
                    .filter(Boolean).join(' · ')}
                </p>
              </button>
              <span className="text-sm font-semibold text-stone-700 shrink-0">
                {fmt(r.grand_total)}
              </span>
              <button onClick={() => remove(r)}
                      className="shrink-0 w-8 h-8 rounded-lg text-stone-300 hover:text-red-600
                                 hover:bg-red-50 transition-colors"
                      aria-label="Delete">
                <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
