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

export default function QuoteList({ onNew, onEdit, onSignOut, userId, user }) {
  const [quotes,      setQuotes]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [deleting,    setDeleting]    = useState(null)
  const [expanded,    setExpanded]    = useState(new Set())
  const [duplicating, setDuplicating] = useState(null)
  const [editProfile, setEditProfile] = useState(false)
  const [profile,     setProfile]     = useState({ name: '', phone: '', advisorEmail: '' })
  const [profSaving,  setProfSaving]  = useState(false)
  const [profMsg,     setProfMsg]     = useState(null)

  useEffect(() => { loadQuotes() }, [])

  async function openProfile() {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
    let phone = '', advisorEmail = ''
    if (userId) {
      const { data } = await supabase.from('profiles').select('phone, advisor_email').eq('id', userId).single()
      phone        = data?.phone         || ''
      advisorEmail = data?.advisor_email || ''
    }
    setProfile({ name, phone, advisorEmail })
    setProfMsg(null)
    setEditProfile(true)
  }

  async function saveProfile() {
    setProfSaving(true)
    setProfMsg(null)
    const [profResult, authResult] = await Promise.all([
      supabase.from('profiles').upsert({
        id: userId, full_name: profile.name, phone: profile.phone,
        advisor_email: profile.advisorEmail, updated_at: new Date().toISOString(),
      }),
      supabase.auth.updateUser({ data: { full_name: profile.name } }),
    ])
    setProfSaving(false)
    const err = profResult.error || authResult.error
    setProfMsg(err ? { ok: false, text: err.message } : { ok: true, text: 'Profile updated.' })
  }

  async function loadQuotes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('quotes')
      .select('id, deceased_name, customer_name, status, total, created_at, contact_id, version_label, sort_order, funeral_homes(name)')
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
      user_id:       userId,
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

  const groups = []
  const groupMap = new Map()
  filtered.forEach(q => {
    const key = q.contact_id || q.id
    if (!groupMap.has(key)) { groupMap.set(key, groups.length); groups.push({ key, quotes: [] }) }
    groups[groupMap.get(key)].quotes.push(q)
  })
  groups.forEach(g => {
    g.quotes.sort((a, b) => {
      const ao = a.sort_order ?? 999999
      const bo = b.sort_order ?? 999999
      return ao !== bo ? ao - bo : new Date(a.created_at) - new Date(b.created_at)
    })
  })

  return (
    <div className="min-h-screen bg-stone-50">

      <header className="bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Funeral Quote</h1>
            <p className="text-primary-300 text-xs mt-0.5">Service quotation manager</p>
          </div>

          {user && (() => {
            const name    = user.user_metadata?.full_name || user.user_metadata?.name || ''
            const email   = user.email || ''
            const initial = (name || email).charAt(0).toUpperCase()
            return (
              <button onClick={openProfile} className="flex items-center gap-2.5 ml-auto hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary-600 border border-primary-500 flex items-center justify-center text-sm font-bold shrink-0">
                  {initial}
                </div>
                <div className="hidden sm:block text-right">
                  {name && <p className="text-sm font-medium leading-tight">{name}</p>}
                  <p className="text-xs text-primary-300 leading-tight">{email}</p>
                </div>
              </button>
            )
          })()}

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={onNew} className="text-sm font-medium bg-white text-primary-800 px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors shadow-sm">
              + New Quote
            </button>
            <button onClick={onSignOut} className="text-xs text-primary-300 hover:text-white transition-colors px-3 py-2">
              Sign out
            </button>
          </div>
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
                    const isMulti = group.quotes.length > 1
                    const s       = STATUS[primary.status] || { label: primary.status, cls: 'bg-stone-100 text-stone-500' }

                    // Pick the best name to show for the group (first non-empty across all versions)
                    const groupName     = group.quotes.find(q => q.deceased_name)?.deceased_name || null
                    const groupPurchaser = group.quotes.find(q => q.customer_name)?.customer_name || null
                    const groupHome     = group.quotes.find(q => q.funeral_homes?.name)?.funeral_homes?.name || '—'

                    return (
                      <>
                        <tr key={primary.id} className="hover:bg-stone-50/60 transition-colors cursor-pointer" onClick={() => onEdit(primary.id)}>
                          <td className="px-4 py-3 text-sm font-medium text-stone-800">
                            <div className="flex items-center gap-2">
                              {groupName || <span className="text-stone-300">—</span>}
                              {isMulti ? (
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
                          <td className="px-4 py-3 text-sm text-stone-500">{groupPurchaser || <span className="text-stone-300">—</span>}</td>
                          <td className="px-4 py-3 text-xs text-stone-400">{groupHome}</td>
                          {/* For multi-version groups, status/total shown per-version in sub-rows */}
                          <td className="px-4 py-3">{!isMulti && <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>}</td>
                          <td className="px-4 py-3 text-right text-sm font-semibold text-stone-700">{!isMulti && fmt(primary.total)}</td>
                          <td className="px-4 py-3 text-xs text-stone-400">{new Date(primary.created_at).toLocaleDateString('en-CA')}</td>
                          <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                            {!isMulti && (
                              <div className="flex items-center justify-end gap-3">
                                <button onClick={e => openDuplicate(primary, e)} className="text-xs text-stone-400 hover:text-primary-600 transition-colors">Duplicate</button>
                                <button onClick={e => deleteQuote(primary.id, e)} disabled={deleting === primary.id} className="text-xs text-stone-300 hover:text-red-400 disabled:opacity-40 transition-colors">Delete</button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* All versions shown as sub-rows when expanded */}
                        {isOpen && group.quotes.map((q, i) => {
                          const vs = STATUS[q.status] || { label: q.status, cls: 'bg-stone-100 text-stone-500' }
                          return (
                            <tr key={q.id} className="bg-stone-50/60 hover:bg-stone-100/70 transition-colors cursor-pointer" onClick={() => onEdit(q.id)}>
                              <td className="py-2.5 pl-10 pr-4 text-sm font-medium text-stone-700">
                                <div className="flex items-center gap-2">
                                  <span className="w-px h-4 bg-stone-300 shrink-0" />
                                  {q.version_label || `V${i + 1}`}
                                </div>
                              </td>
                              <td /><td />
                              <td className="px-4 py-2.5">
                                <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${vs.cls}`}>{vs.label}</span>
                              </td>
                              <td className="px-4 py-2.5 text-right text-sm font-semibold text-stone-600">{fmt(q.total)}</td>
                              <td />
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

      {/* Profile dialog */}
      {editProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-bold text-stone-800 mb-4">Edit Profile</h3>

            <label className="text-xs font-medium text-stone-600 block mb-1">Full name</label>
            <input className="input w-full text-sm mb-3" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} autoFocus />

            <label className="text-xs font-medium text-stone-600 block mb-1">Phone</label>
            <input className="input w-full text-sm mb-3" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. 778-866-8863" />

            <label className="text-xs font-medium text-stone-600 block mb-1">Advisor email</label>
            <input className="input w-full text-sm mb-3" type="email" value={profile.advisorEmail} onChange={e => setProfile(p => ({ ...p, advisorEmail: e.target.value }))} placeholder="shown on quotes" />

            <label className="text-xs font-medium text-stone-500 block mb-1">Login email</label>
            <p className="text-sm text-stone-400 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 mb-4">{user?.email}</p>

            {profMsg && <p className={`text-xs mb-3 ${profMsg.ok ? 'text-green-600' : 'text-red-500'}`}>{profMsg.text}</p>}

            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditProfile(false)} className="btn-secondary text-xs py-1.5 px-4">Close</button>
              <button onClick={saveProfile} disabled={profSaving} className="btn-primary text-xs py-1.5 px-4">{profSaving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate dialog */}
      {duplicating && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-sm font-bold text-stone-800 mb-1">Duplicate Quote</h3>
            <p className="text-xs text-stone-400 mb-4">Keep the same name to add as a new version, or change the name to create a separate contact.</p>

            <label className="text-xs font-medium text-stone-600 block mb-1.5">Beneficiary name</label>
            <input className="input w-full text-sm mb-4" value={duplicating.newName} onChange={e => setDuplicating(d => ({ ...d, newName: e.target.value }))} autoFocus />

            <div className="grid grid-cols-2 gap-2 mb-5">
              <button onClick={() => setDuplicating(d => ({ ...d, sameContact: true }))} className={`text-xs py-2.5 px-3 rounded-xl border font-medium transition-colors text-left ${duplicating.sameContact ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                <p>New version</p>
                <p className="text-[10px] font-normal opacity-60 mt-0.5">Same contact</p>
              </button>
              <button onClick={() => setDuplicating(d => ({ ...d, sameContact: false }))} className={`text-xs py-2.5 px-3 rounded-xl border font-medium transition-colors text-left ${!duplicating.sameContact ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
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
