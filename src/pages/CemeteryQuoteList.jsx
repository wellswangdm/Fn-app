import { useEffect, useState } from 'react'
import { fetchQuoteFamilies, fetchQuotes, deleteQuote, newQuoteFromTemplate } from '../lib/cemetery.js'

// ─────────────────────────────────────────────────────────────────────────────
// Saved quotes, grouped the way the funeral portal groups versions.
//
// A FAMILY owns several OPTIONS of the same quote. Comparing happens inside a
// family — you compare the options you built for those people, not every
// quote in the park. The old flat list made the comparison screen offer every
// quote ever saved, which was both the wrong hierarchy and unworkable once
// there are more than a handful.
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function when(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

const labelOf = (o, i) => o.version_label || o.client_name || `Option ${i + 1}`

export default function CemeteryQuoteList({ park, advisor, onOpen, onNew, onCompare }) {
  const [tab,       setTab]       = useState('quotes')
  const [families,  setFamilies]  = useState([])
  const [templates, setTemplates] = useState([])
  const [expanded,  setExpanded]  = useState(() => new Set())
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')
  const [reloadAt,  setReloadAt]  = useState(0)
  const [busy,      setBusy]      = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true); setError('')
    ;(async () => {
      try {
        if (tab === 'quotes') {
          const f = await fetchQuoteFamilies(park.id)
          if (alive) setFamilies(f)
        } else {
          const t = await fetchQuotes({ parkId: park.id, templates: true })
          if (alive) setTemplates(t)
        }
      } catch (e) {
        if (alive) setError(e.message || String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [park.id, tab, reloadAt])

  function toggle(key) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  async function remove(id, label) {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
    try { await deleteQuote(id); setReloadAt(Date.now()) }
    catch (e) { setError(e.message || String(e)) }
  }

  async function useTemplate(t) {
    setBusy(true); setError('')
    try {
      const id = await newQuoteFromTemplate(t.id, advisor?.userId)
      onOpen(id)
    } catch (e) { setError(e.message || String(e)) }
    finally { setBusy(false) }
  }

  const matches = s => !search || String(s || '').toLowerCase().includes(search.toLowerCase())
  const shownFamilies = families.filter(g =>
    matches(g.name) || g.options.some(o => matches(o.version_label) || matches(o.quote_number)))
  const shownTemplates = templates.filter(t => matches(t.template_name))

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
        <button onClick={onNew} className="btn-primary text-xs ml-auto">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New quote
        </button>
      </div>

      <input className="input text-sm"
             placeholder={tab === 'quotes' ? 'Search by client or option…' : 'Search templates…'}
             value={search} onChange={e => setSearch(e.target.value)} />

      {error && (
        <div className="card p-3 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-stone-400 py-10 text-center">Loading…</p>

      ) : tab === 'templates' ? (
        shownTemplates.length === 0 ? (
          <Empty>
            {templates.length === 0
              ? 'No templates yet. Build a quote you like, then “Save as template”.'
              : 'Nothing matches that search.'}
          </Empty>
        ) : (
          <div className="card divide-y divide-stone-100 overflow-hidden">
            {shownTemplates.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {t.template_name || 'Untitled template'}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">{when(t.updated_at)}</p>
                </div>
                <span className="text-sm text-stone-500 shrink-0">{fmt(t.grand_total)}</span>
                <button onClick={() => useTemplate(t)} disabled={busy}
                        className="btn-primary text-xs shrink-0">
                  Use template
                </button>
                <IconButton label="Delete template"
                            onClick={() => remove(t.id, t.template_name || 'this template')} />
              </div>
            ))}
          </div>
        )

      ) : shownFamilies.length === 0 ? (
        <Empty>
          {families.length === 0 ? 'No quotes for this park yet.' : 'Nothing matches that search.'}
          {families.length === 0 && (
            <button onClick={onNew} className="btn-primary mt-4 text-xs block mx-auto">
              Create the first quote
            </button>
          )}
        </Empty>

      ) : (
        <div className="card divide-y divide-stone-100 overflow-hidden">
          {shownFamilies.map(g => {
            const open  = expanded.has(g.key)
            const multi = g.options.length > 1
            const first = g.options[0]
            return (
              <div key={g.key}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50">
                  <button onClick={() => (multi ? toggle(g.key) : onOpen(first.id))}
                          className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">
                      {g.name || labelOf(first, 0)}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {when(g.updatedAt)}
                      {multi && <> · {open ? '▾' : '▸'} {g.options.length} options</>}
                      {!multi && first.version_label && <> · {first.version_label}</>}
                    </p>
                  </button>

                  <span className="text-sm font-semibold text-stone-700 shrink-0">
                    {fmt(first.grand_total)}
                  </span>

                  {multi && (
                    <button onClick={() => onCompare(g.contactId || g.key)}
                            className="btn-secondary text-xs shrink-0">
                      Compare
                    </button>
                  )}
                  {!multi && (
                    <IconButton label="Delete quote"
                                onClick={() => remove(first.id, g.name || 'this quote')} />
                  )}
                </div>

                {multi && open && (
                  <div className="bg-stone-50/60 border-t border-stone-100">
                    {g.options.map((o, i) => (
                      <div key={o.id} className="flex items-center gap-3 pl-10 pr-4 py-2.5
                                                 hover:bg-white border-b border-stone-100 last:border-0">
                        <button onClick={() => onOpen(o.id)} className="flex-1 text-left min-w-0">
                          <p className="text-[13px] text-stone-700 truncate">{labelOf(o, i)}</p>
                          <p className="text-[11px] text-stone-400">{when(o.updated_at)}</p>
                        </button>
                        <span className="text-[13px] text-stone-600 shrink-0">{fmt(o.grand_total)}</span>
                        <IconButton label="Delete option" onClick={() => remove(o.id, labelOf(o, i))} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Empty({ children }) {
  return (
    <div className="card p-10 text-center border-dashed">
      <div className="text-sm text-stone-500">{children}</div>
    </div>
  )
}

function IconButton({ onClick, label }) {
  return (
    <button onClick={onClick} aria-label={label}
            className="shrink-0 w-8 h-8 rounded-lg text-stone-300 hover:text-red-600
                       hover:bg-red-50 transition-colors">
      <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      </svg>
    </button>
  )
}
