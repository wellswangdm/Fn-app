import { useEffect, useState } from 'react'
import {
  fetchQuoteFamilies, fetchQuotes, fetchPropertyNames,
  deleteQuote, newQuoteFromTemplate,
} from '../lib/cemetery.js'
import { optionName } from '../lib/cemeteryOptionLabel.js'

// ─────────────────────────────────────────────────────────────────────────────
// Saved quotes.
//
// A family owns one or more OPTIONS. Every option is on screen and one click
// away — they used to be hidden behind a disclosure triangle, so opening the
// second option meant expanding the family first and then picking from the
// list, which is two clicks to do the obvious thing.
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function when(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function CemeteryQuoteList({ park, advisor, onOpen, onNew, onCompare }) {
  const [tab,        setTab]        = useState('quotes')
  const [families,   setFamilies]   = useState([])
  const [propertyOf, setPropertyOf] = useState({})
  const [templates,  setTemplates]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [reloadAt,   setReloadAt]   = useState(0)
  const [busy,       setBusy]       = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true); setError('')
    ;(async () => {
      try {
        if (tab === 'quotes') {
          const f = await fetchQuoteFamilies(park.id)
          if (!alive) return
          setFamilies(f)
          // An option is named after the property it is built around; the list
          // does not load line items, so ask for just those names.
          setPropertyOf(await fetchPropertyNames(f.flatMap(g => g.options.map(o => o.id))))
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

  const nameOf = (o, i) =>
    optionName({ versionLabel: o.version_label, propertyName: propertyOf[o.id], index: i })

  async function remove(id, label) {
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return
    try { await deleteQuote(id); setReloadAt(Date.now()) }
    catch (e) { setError(e.message || String(e)) }
  }

  async function useTemplate(t) {
    setBusy(true); setError('')
    try { onOpen(await newQuoteFromTemplate(t.id, advisor?.userId)) }
    catch (e) { setError(e.message || String(e)) }
    finally { setBusy(false) }
  }

  const matches = s => !search || String(s || '').toLowerCase().includes(search.toLowerCase())
  const shownFamilies = families.filter((g) =>
    matches(g.name) || g.options.some((o, i) => matches(nameOf(o, i))))
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
                        className="btn-primary text-xs shrink-0">Use template</button>
                <TrashButton label="Delete template"
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
        <div className="space-y-3">
          {shownFamilies.map(g => (
            <div key={g.key} className="card overflow-hidden">
              <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">
                    {g.name || nameOf(g.options[0], 0)}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {when(g.updatedAt)}
                    {g.options.length > 1 && ` · ${g.options.length} options`}
                  </p>
                </div>
                {g.options.length > 1 && (
                  <button onClick={() => onCompare(g.contactId || g.key)}
                          className="btn-secondary text-xs shrink-0">Compare</button>
                )}
              </div>

              {/* Every option, one click away */}
              <div className="px-3 pb-3 flex flex-wrap gap-2">
                {g.options.map((o, i) => (
                  <span key={o.id}
                        className="group inline-flex items-center rounded-xl border border-stone-200
                                   bg-white hover:border-primary-300 hover:bg-primary-50/40
                                   transition-colors">
                    <button onClick={() => onOpen(o.id)} className="px-3 py-2 text-left">
                      <span className="block text-xs font-medium text-stone-700 group-hover:text-primary-800">
                        {nameOf(o, i)}
                      </span>
                      <span className="block text-[11px] text-stone-400">{fmt(o.grand_total)}</span>
                    </button>
                    <TrashButton label="Delete option" small
                                 onClick={() => remove(o.id, nameOf(o, i))} />
                  </span>
                ))}
              </div>
            </div>
          ))}
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

function TrashButton({ onClick, label, small }) {
  return (
    <button onClick={onClick} aria-label={label} title={label}
            className={`shrink-0 text-stone-300 hover:text-red-600 transition-colors ${
              small ? 'pr-2.5 pl-1' : 'w-8 h-8 rounded-lg hover:bg-red-50'}`}>
      <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      </svg>
    </button>
  )
}
