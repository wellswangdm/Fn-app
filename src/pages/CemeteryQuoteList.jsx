import { useEffect, useState } from 'react'
import {
  fetchQuoteFamilies, fetchQuotes, fetchPropertyNames,
  deleteQuote, newQuoteFromTemplate,
} from '../lib/cemetery.js'
import { optionName } from '../lib/cemeteryOptionLabel.js'

// ─────────────────────────────────────────────────────────────────────────────
// Saved quotes.
//
// One flat list. A family is a heading, its options are the rows beneath it,
// and every option opens in a single click.
//
// What is deliberately NOT here:
//   * cards inside cards — the options used to be bordered boxes inside a
//     bordered family box, which made a two-option quote look like six things
//   * a delete button on every row — destructive actions wait for the pointer
//   * "2 options" — you can see the two rows
//   * a search field before there is anything to search
//
// Amounts sit in one right-aligned column so they can be read down the page
// rather than hunted for.
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function when(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

const SEARCH_FROM = 5   // families before a search field earns its place

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
          // holds no line items, so ask for just those names.
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
  const shownFamilies = families.filter(g =>
    matches(g.name) || g.options.some((o, i) => matches(nameOf(o, i))))
  const shownTemplates = templates.filter(t => matches(t.template_name))
  const showSearch = tab === 'quotes'
    ? families.length >= SEARCH_FROM
    : templates.length >= SEARCH_FROM

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      <div className="flex items-center gap-3">
        <div className="flex bg-stone-100/80 p-0.5 rounded-lg">
          {[['quotes', 'Quotes'], ['templates', 'Templates']].map(([k, label]) => (
            <button key={k} onClick={() => { setTab(k); setSearch('') }}
                    className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                      tab === k ? 'bg-white text-stone-900 shadow-sm'
                                : 'text-stone-500 hover:text-stone-700'}`}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={onNew} className="btn-primary text-[13px] ml-auto">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New quote
        </button>
      </div>

      {showSearch && (
        <input className="w-full bg-stone-100/70 border-0 rounded-lg px-3.5 py-2 text-[13px]
                          placeholder:text-stone-400 focus:outline-none focus:ring-2
                          focus:ring-primary-500/20"
               placeholder={tab === 'quotes' ? 'Search' : 'Search templates'}
               value={search} onChange={e => setSearch(e.target.value)} />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-stone-400 py-16 text-center">Loading…</p>

      ) : tab === 'templates' ? (
        shownTemplates.length === 0 ? (
          <Empty>
            {templates.length === 0
              ? 'Build a quote you like, then save it as a template.'
              : 'Nothing matches.'}
          </Empty>
        ) : (
          <div className="card overflow-hidden divide-y divide-stone-100">
            {shownTemplates.map(t => (
              <Row key={t.id}
                   title={t.template_name || 'Untitled template'}
                   amount={fmt(t.grand_total)}
                   onClick={() => useTemplate(t)}
                   disabled={busy}
                   onDelete={() => remove(t.id, t.template_name || 'this template')} />
            ))}
          </div>
        )

      ) : shownFamilies.length === 0 ? (
        <Empty>
          {families.length === 0 ? 'No quotes yet.' : 'Nothing matches.'}
          {families.length === 0 && (
            <button onClick={onNew} className="btn-primary mt-5 text-[13px] mx-auto">
              New quote
            </button>
          )}
        </Empty>

      ) : (
        <div className="card overflow-hidden divide-y divide-stone-200/70">
          {shownFamilies.map(g => (
            <section key={g.key}>
              {/* pr-14 leaves the same right-hand gutter the rows leave for
                  their hover delete, so the date and Compare line up with the
                  amounts below rather than hanging further right. */}
              <header className="flex items-baseline gap-3 pl-5 pr-14 pt-4 pb-2">
                <h2 className="text-[15px] font-semibold text-stone-900 truncate">
                  {g.name || nameOf(g.options[0], 0)}
                </h2>
                <span className="ml-auto text-xs text-stone-400 shrink-0">{when(g.updatedAt)}</span>
                {/* Quiet, but always there. Comparing options is the point of a
                    family, and a hover-only control is no control at all on a
                    tablet. */}
                {g.options.length > 1 && (
                  <button onClick={() => onCompare(g.contactId || g.key)}
                          className="shrink-0 text-xs text-stone-400 hover:text-primary-700 transition-colors">
                    Compare
                  </button>
                )}
              </header>

              <div className="divide-y divide-stone-100">
                {g.options.map((o, i) => (
                  <Row key={o.id}
                       title={nameOf(o, i)}
                       amount={fmt(o.grand_total)}
                       indent
                       onClick={() => onOpen(o.id)}
                       onDelete={() => remove(o.id, nameOf(o, i))} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * One tappable row. The amount holds a fixed right-aligned column so figures
 * line up down the page, and delete only appears under the pointer — it should
 * not be the most eye-catching thing on a list of someone's quotes.
 */
function Row({ title, amount, onClick, onDelete, indent, disabled }) {
  return (
    <div className="group relative flex items-center hover:bg-stone-50/80 transition-colors">
      <button onClick={onClick} disabled={disabled}
              className={`flex-1 min-w-0 flex items-center gap-4 py-2.5 pr-14 text-left
                          disabled:opacity-50 ${indent ? 'pl-7' : 'pl-5'}`}>
        <span className="flex-1 min-w-0 truncate text-sm text-stone-700 group-hover:text-stone-900">
          {title}
        </span>
        <span className="shrink-0 text-sm text-stone-500 tabular-nums">{amount}</span>
      </button>
      {/* Hover-revealed on a pointer device; on a touch screen there is no
          hover, so it stays visible rather than unreachable. */}
      <button onClick={onDelete} aria-label={`Delete ${title}`} title="Delete"
              className="absolute right-4 p-1.5 rounded-md text-stone-300
                         opacity-0 group-hover:opacity-100 focus:opacity-100
                         [@media(hover:none)]:opacity-100
                         hover:text-red-600 hover:bg-red-50 transition-all">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      </button>
    </div>
  )
}

function Empty({ children }) {
  return (
    <div className="py-20 text-center">
      <div className="text-sm text-stone-400">{children}</div>
    </div>
  )
}
