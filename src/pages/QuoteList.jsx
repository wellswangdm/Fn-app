import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import ComparisonView from '../components/ComparisonView.jsx'
import { versionNameOf } from '../lib/versionLabel.js'

// ─────────────────────────────────────────────────────────────────────────────
// Saved quotes — funeral portal.
//
// Built to the same rules as the cemetery list: one flat list, a contact is a
// heading, its versions are the rows beneath it, and every version opens in a
// single click.
//
// What the seven-column table used to do, and no longer does:
//   * hide a contact's versions behind a "▸ 3 versions" chip, so getting to a
//     quote took two clicks and you could not see what you were choosing
//   * leave Status and Total blank on every multi-version row, because those
//     only made sense per version — a table with holes in it
//   * do two different things depending on where in one row you clicked
//   * print "Purchaser" on every row even when it repeats the beneficiary
//   * keep Duplicate and Delete on screen at all times
//
// Amounts sit in one right-aligned column so they can be read down the page.
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function when(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function generateQuoteNumber() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  return `Q-${date}-${String(Math.floor(Math.random() * 900) + 100)}`
}




export default function QuoteList({ onNew, onEdit, onSignOut, onSwitchPortal, userId, user }) {
  const [quotes,      setQuotes]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [search,      setSearch]      = useState('')
  const [deleting,    setDeleting]    = useState(null)
  const [duplicating, setDuplicating] = useState(null)
  const [comparing,   setComparing]   = useState(null)   // { contactId, versionOrder }
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
      .select('id, deceased_name, customer_name, total, created_at, contact_id, version_label, sort_order, funeral_homes(name), packages(name)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setQuotes(data)
    setLoading(false)
  }

  async function deleteQuote(id, label) {
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return
    setDeleting(id)
    await supabase.from('quotes').delete().eq('id', id)
    setQuotes(q => q.filter(x => x.id !== id))
    setDeleting(null)
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
      user_id:       userId,
    }).select('id').single()

    if (items?.length) {
      await supabase.from('quote_items').insert(
        items.map(({ id: _iid, created_at: _ca, ...item }) => ({ ...item, quote_id: newQ.id }))
      )
    }

    onEdit(newQ.id)
  }

  const s = search.trim().toLowerCase()
  const filtered = quotes.filter(q =>
    !s || q.deceased_name?.toLowerCase().includes(s) || q.customer_name?.toLowerCase().includes(s))

  // One group per contact, versions in the advisor's chosen order.
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

  const totalGroups = new Set(quotes.map(q => q.contact_id || q.id)).size
  const showSearch  = totalGroups > 0

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">

      {/* Subtle, like the quote sheet's own letterhead: white, dark text, a
          hairline underneath. A heavy blue slab across the top of every page
          was the loudest thing in the app and said nothing. */}
      <header className="bg-white border-b border-stone-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight text-stone-900">Funeral Quote</h1>
            <p className="text-stone-400 text-xs mt-0.5">Service quotation manager</p>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {user && (() => {
              const name    = user.user_metadata?.full_name || user.user_metadata?.name || ''
              const email   = user.email || ''
              const initial = (name || email).charAt(0).toUpperCase()
              return (
                <button onClick={openProfile} title="Edit profile"
                        className="flex items-center gap-2.5 mr-1 hover:opacity-70 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 text-stone-600
                                  flex items-center justify-center text-sm font-semibold shrink-0">
                    {initial}
                  </div>
                  <div className="hidden lg:block text-right">
                    {name && <p className="text-sm font-medium leading-tight text-stone-700">{name}</p>}
                    <p className="text-xs text-stone-400 leading-tight">{email}</p>
                  </div>
                </button>
              )
            })()}

            {onSwitchPortal && (
              <button onClick={onSwitchPortal}
                      className="text-xs text-stone-400 hover:text-stone-700 transition-colors px-3 py-2">
                Switch portal
              </button>
            )}
            <button onClick={onSignOut}
                    className="text-xs text-stone-400 hover:text-stone-700 transition-colors px-3 py-2">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* New Quote sits with the list it adds to, as it does in the cemetery
          portal, instead of competing with sign-out in the title bar. */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        <div className="flex items-center gap-3">
          {showSearch ? (
            <input className="flex-1 min-w-0 max-w-sm bg-stone-100/70 border-0 rounded-lg px-3.5 py-2 text-[13px]
                              placeholder:text-stone-400 focus:outline-none focus:ring-2
                              focus:ring-primary-500/20"
                   placeholder="Search by name"
                   value={search} onChange={e => setSearch(e.target.value)} />
          ) : <div className="flex-1" />}
          <button onClick={onNew} className="btn-primary text-[13px] shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New quote
          </button>
        </div>

        {error && <p className="text-sm text-red-600">Error: {error}</p>}

        {loading ? (
          <p className="text-sm text-stone-400 py-16 text-center">Loading…</p>

        ) : groups.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-stone-400">
              {quotes.length === 0 ? 'No quotes yet.' : 'Nothing matches.'}
            </p>
            {quotes.length === 0 && (
              <button onClick={onNew} className="btn-primary mt-5 text-[13px] mx-auto">
                New quote
              </button>
            )}
          </div>

        ) : (
          <div className="card overflow-hidden divide-y divide-stone-200/70">
            {groups.map(g => {
              const count = g.quotes.length
              // The first non-empty value across the versions: they describe
              // one contact, so a blank on one version is not news.
              const name      = g.quotes.find(q => q.deceased_name)?.deceased_name || '—'
              const purchaser = g.quotes.find(q => q.customer_name)?.customer_name || ''
              const home      = g.quotes.find(q => q.funeral_homes?.name)?.funeral_homes?.name || ''
              const latest    = g.quotes.reduce((a, q) =>
                                  new Date(q.created_at) > new Date(a) ? q.created_at : a,
                                  g.quotes[0].created_at)

              return (
                <section key={g.key}>
                  {/* pr-20 leaves the gutter the rows leave for their hover
                      actions, so this line ends where the amounts end. */}
                  <header className="flex items-baseline gap-2.5 pl-5 pr-20 pt-4 pb-2">
                    {/* flex-1 min-w-0, so the name takes the slack and is the
                        thing that truncates last — not squeezed to nothing by
                        the metadata beside it, which is what happened on a
                        phone when the name was long. */}
                    <h2 className="flex-1 min-w-0 text-[15px] font-semibold text-stone-900 truncate">{name}</h2>
                    {/* Only when it says something the name does not, and only
                        where there is room to say it. */}
                    {purchaser && purchaser !== name && (
                      <span className="hidden md:inline shrink-0 truncate max-w-[10rem] text-xs text-stone-400">
                        for {purchaser}
                      </span>
                    )}
                    {/* Metadata, not navigation: on a phone the name and
                        Compare get the width instead. */}
                    <span className="hidden sm:inline text-xs text-stone-400 shrink-0">
                      {home && <span className="hidden lg:inline">{home} · </span>}
                      {when(latest)}
                    </span>
                    {count > 1 && (
                      <button onClick={() => setComparing({ contactId: g.key,
                                                            versionOrder: g.quotes.map(q => q.id) })}
                              className="shrink-0 text-xs text-stone-400 hover:text-primary-700 transition-colors">
                        Compare
                      </button>
                    )}
                  </header>

                  <div className="divide-y divide-stone-100">
                    {g.quotes.map((q, i) => {
                      const label = versionNameOf(q, i, count)
                      return (
                        <div key={q.id}
                             className="group relative flex items-center hover:bg-stone-50/80 transition-colors">
                          <button onClick={() => onEdit(q.id)}
                                  className="flex-1 min-w-0 flex items-center gap-3 pl-7 pr-20 py-2.5 text-left">
                            <span className="flex-1 min-w-0 truncate text-sm text-stone-700 group-hover:text-stone-900">
                              {label}
                            </span>
                            <span className="shrink-0 w-28 text-right text-sm text-stone-500 tabular-nums">
                              {fmt(q.total)}
                            </span>
                          </button>

                          {/* Hover-revealed on a pointer device; a touch screen
                              has no hover, so they stay visible there. */}
                          <div className="absolute right-3 flex items-center gap-0.5
                                          opacity-0 group-hover:opacity-100 focus-within:opacity-100
                                          [@media(hover:none)]:opacity-100 transition-opacity">
                            <IconButton label={`Duplicate ${label}`} title="Duplicate"
                                        onClick={() => setDuplicating({
                                          quote: q, newName: q.deceased_name || '', sameContact: true })}>
                              <path d="M8 8V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-3" />
                              <rect x="4" y="8" width="12" height="12" rx="1" />
                            </IconButton>
                            <IconButton label={`Delete ${label}`} title="Delete" danger
                                        disabled={deleting === q.id}
                                        onClick={() => deleteQuote(q.id, label)}>
                              <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            </IconButton>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>

      {/* Compare, reachable from the list as it is in the cemetery portal —
          previously it existed only inside the editor. */}
      {comparing && (
        <ComparisonView
          contactId={comparing.contactId}
          /* Nothing is open here, so no column is "current" — passing the
             first version would label it current for no reason. */
          currentQuoteId={null}
          versionOrder={comparing.versionOrder}
          onClose={() => setComparing(null)}
        />
      )}

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
            <p className="text-xs text-stone-400 mb-4">Keep the same name to add as a new option, or change the name to create a separate contact.</p>

            <label className="text-xs font-medium text-stone-600 block mb-1.5">Beneficiary name</label>
            <input className="input w-full text-sm mb-4" value={duplicating.newName} onChange={e => setDuplicating(d => ({ ...d, newName: e.target.value }))} autoFocus />

            <div className="grid grid-cols-2 gap-2 mb-5">
              <button onClick={() => setDuplicating(d => ({ ...d, sameContact: true }))} className={`text-xs py-2.5 px-3 rounded-xl border font-medium transition-colors text-left ${duplicating.sameContact ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}>
                <p>New option</p>
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

function IconButton({ label, title, onClick, disabled, danger, children }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label} title={title}
            className={`p-1.5 rounded-md text-stone-300 transition-colors disabled:opacity-40
              ${danger ? 'hover:text-red-600 hover:bg-red-50' : 'hover:text-primary-700 hover:bg-primary-50'}`}>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  )
}
