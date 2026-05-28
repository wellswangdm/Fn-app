import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function generateQuoteNumber() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  return `Q-${date}-${String(Math.floor(Math.random() * 900) + 100)}`
}

const STATUS = {
  draft:     { label: 'Draft',     cls: 'bg-amber-50 text-amber-600 border-amber-200'  },
  finalized: { label: 'Finalized', cls: 'bg-blue-50 text-blue-600 border-blue-200'     },
  accepted:  { label: 'Accepted',  cls: 'bg-green-50 text-green-600 border-green-200'  },
}

export default function QuoteList({ onNew, onEdit }) {
  const [quotes,      setQuotes]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [deleting,    setDeleting]    = useState(null)
  const [expanded,    setExpanded]    = useState(new Set())
  const [duplicating, setDuplicating] = useState(null) // { quote, newName, sameContact }

  useEffect(() => { loadQuotes() }, [])

  async function loadQuotes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('quotes')
      .select('id, deceased_name, customer_name, status, total, created_at, contact_id, version_label, funeral_homes(name)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setQuotes(data)
    setLoading(false)
  }

  function toggleExpand(key, e) {
    e.stopPropagation()
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  async function deleteQuote(id, e) {
    e.stopPropagation()
    if (!window.confirm('Delete this quote? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('quotes').delete().eq('id', id)
    setQuotes(q => q.filter(x => x.id !== id))
    setDeleting(null)
  }

  function openDuplicate(quote, e) {
    e.stopPropagation()
    setDuplicating({ quote, newName: quote.deceased_name || '', sameContact: true })
  }

  async function confirmDuplicate() {
    const { quote, newName, sameContact } = duplicating
    setDuplicating(null)

    const [{ data: q }, { data: items }] = await Promise.all([
      supabase.from('quotes').select('*').eq('id', quote.id).single(),
      supabase.from('quote_items').select('*').eq('quote_id', quote.id),
    ])

    const trimmedName  = newName.trim() || q.deceased_name
    const newContactId = sameContact ? quote.contact_id : crypto.randomUUID()
    const { id: _id, created_at, updated_at, ...rest } = q

    const { data: newQ } = await supabase.from('quotes').insert({
      ...rest,
      quote_number:  generateQuoteNumber(),
      deceased_name: trimmedName,
      customer_name: q.purchaser_different ? q.customer_name : trimmedName,
      contact_id:    newContactId,
      status:        'draft',
    }).select('id').single()

    if (items?.length) {
      await supabase.from('quote_items').insert(
        items.map(({ id: _iid, created_at: _ca, ...item }) => ({ ...item, quote_id: newQ.id }))
      )
    }

    onEdit(newQ.id)
  }

  const filtered = quotes.filter(q => {
    const s = search.toLowerCase()
    return !s || q.deceased_name?.toLowerCase().includes(s) || q.customer_name?.toLowerCase().includes(s)
  })

  // Group by contact_id; quotes missing contact_id each get their own group
  const groups = []
  const groupMap = new Map()
  filtered.forEach(q => {
    const key = q.contact_id || q.id
    if (!groupMap.has(key)) { groupMap.set(key, groups.length); groups.push({ key, quotes: [] }) }
    groups[groupMap.get(key)].quotes.push(q)
  })

  return (
    <div className="min-h-screen bg-stone-50">

      <header className="bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Funeral Quote</h1>
            <p className="text-primary-300 text-xs mt-0.5">Service quotation manager</p>
          </div>
          <button onClick={onNew} className="text-sm font-medium bg-white text-primary-800 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors shadow-sm">
            + New Quote
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">

        <div className="mb-5">
          <input className="input max-w-xs text-sm" placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading && <p className="text-sm text-stone-400">Loading…</p>}
        {error   && <p className="text-sm text-red-500">Error: {error}</p>}

        {!loading && !error && (
          groups.length === 0 ? (
            <div className="card p-16 text-center">
              <p className="text-stone-400 text-sm mb-3">No quotes yet</p>
              <button onClick={onNew} className="btn-primary">Create your first quote</button>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/80">
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Beneficiary</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Purchaser</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Funeral Home</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Total</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 w-36" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {groups.map(group => {
                    const primary = group.quotes[0]
                    const rest    = group.quotes.slice(1)
                    const isOpen  = expanded.has(group.key)
                    const s       = STATUS[primary.status] || { label: primary.status, cls: 'bg-stone-100 text-stone-500' }

                    return (
                      <>
                        <tr key={primary.id} className="hover:bg-stone-50/60 transition-colors cursor-pointer" onClick={() => onEdit(primary.id)}>
                          <td className="px-4 py-3 text-sm font-medium text-stone-800">
                            <div className="flex items-center gap-2">
                              {primary.deceased_name || <span className="text-stone-300">—</span>}
                              {rest.length > 0 ? (
                                <button
                                  onClick={e => toggleExpand(group.key, e)}
                                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors shrink-0"
                                >
                                  {isOpen ? '▾' : '▸'} {group.quotes.length} versions
                                </button>
                              ) : primary.version_label ? (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 shrink-0">
                                  {primary.version_label}
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-stone-500">{primary.customer_name || <span className="text-stone-300">—</span>}</td>
                          <td className="px-4 py-3 text-xs text-stone-400">{primary.funeral_homes?.name || '—'}</td>
                          <td className="px-4 py-3"><span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span></td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-stone-700">{fmt(primary.total)}</td>
                          <td className="px-4 py-3 text-xs text-stone-400">{new Date(primary.created_at).toLocaleDateString('en-CA')}</td>
                          <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-3">
                              <button onClick={e => openDuplicate(primary, e)} className="text-xs text-stone-400 hover:text-primary-600 transition-colors">Duplicate</button>
                              <button onClick={e => deleteQuote(primary.id, e)} disabled={deleting === primary.id} className="text-xs text-stone-300 hover:text-red-400 disabled:opacity-40 transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>

                        {/* Version sub-rows */}
                        {isOpen && rest.map((q, i) => {
                          const vs = STATUS[q.status] || { label: q.status, cls: 'bg-stone-100 text-stone-500' }
                          return (
                            <tr key={q.id} className="bg-stone-50/40 hover:bg-stone-50 transition-colors cursor-pointer border-l-4 border-primary-200" onClick={() => onEdit(q.id)}>
                              <td className="px-4 py-2.5 text-sm text-stone-500 pl-8">
                                <span className="text-[10px] font-bold text-primary-500 mr-2">
                                  {q.version_label || `V${i + 2}`}
                                </span>
                                {q.deceased_name || <span className="text-stone-300">—</span>}
                              </td>
                              <td className="px-4 py-2.5 text-sm text-stone-400">{q.customer_name || '—'}</td>
                              <td className="px-4 py-2.5 text-xs text-stone-300">{q.funeral_homes?.name || '—'}</td>
                              <td className="px-4 py-2.5"><span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${vs.cls}`}>{vs.label}</span></td>
                              <td className="px-4 py-2.5 text-right text-sm font-semibold text-stone-500">{fmt(q.total)}</td>
                              <td className="px-4 py-2.5 text-xs text-stone-300">{new Date(q.created_at).toLocaleDateString('en-CA')}</td>
                              <td className="px-4 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-3">
                                  <button onClick={e => openDuplicate(q, e)} className="text-xs text-stone-400 hover:text-primary-600 transition-colors">Duplicate</button>
                                  <button onClick={e => deleteQuote(q.id, e)} disabled={deleting === q.id} className="text-xs text-stone-300 hover:text-red-400 disabled:opacity-40 transition-colors">Delete</button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>

      {/* Duplicate dialog */}
      {duplicating && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-bold text-stone-800 mb-1">Duplicate Quote</h3>
            <p className="text-xs text-stone-400 mb-4">
              Keep the same name to add as a new version, or change the name to create a separate contact.
            </p>

            <label className="text-xs font-medium text-stone-600 block mb-1.5">Beneficiary name</label>
            <input
              className="input w-full text-sm mb-4"
              value={duplicating.newName}
              onChange={e => setDuplicating(d => ({ ...d, newName: e.target.value }))}
              autoFocus
            />

            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                onClick={() => setDuplicating(d => ({ ...d, sameContact: true }))}
                className={`text-xs py-2.5 px-3 rounded-xl border font-medium transition-colors text-left ${
                  duplicating.sameContact ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                <p>New version</p>
                <p className="text-[10px] font-normal opacity-60 mt-0.5">Same contact</p>
              </button>
              <button
                onClick={() => setDuplicating(d => ({ ...d, sameContact: false }))}
                className={`text-xs py-2.5 px-3 rounded-xl border font-medium transition-colors text-left ${
                  !duplicating.sameContact ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                }`}
              >
                <p>New contact</p>
                <p className="text-[10px] font-normal opacity-60 mt-0.5">Separate entry</p>
              </button>
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={() => setDuplicating(null)} className="btn-secondary text-xs py-1.5 px-4">Cancel</button>
              <button onClick={confirmDuplicate} className="btn-primary text-xs py-1.5 px-4">Duplicate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
