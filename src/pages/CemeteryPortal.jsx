import { useEffect, useState } from 'react'
import CemeteryQuoteList   from './CemeteryQuoteList.jsx'
import CemeteryQuoteEditor from './CemeteryQuoteEditor.jsx'
import CemeteryCompare     from '../components/cemetery/CemeteryCompare.jsx'
import { fetchParks, fetchAdvisor, CemeterySchemaError } from '../lib/cemetery.js'

// ─────────────────────────────────────────────────────────────────────────────
// Cemetery portal shell
//
// The surrounding session, portal switching and sign-out are handled by
// App.jsx; this owns everything below that.
//
// Letterhead on a quote is assembled from two places, as requested: the
// advisor's own name / phone / email come from public.profiles (shared with
// the funeral portal), and the location and address come from whichever park
// is selected here.
// ─────────────────────────────────────────────────────────────────────────────

export default function CemeteryPortal({ onSwitchPortal, onSignOut, user }) {
  const [parks,   setParks]   = useState([])
  const [parkId,  setParkId]  = useState(() => localStorage.getItem('cemetery_park') || '')
  const [advisor, setAdvisor] = useState(null)
  const [view,    setView]    = useState('list')      // 'list' | 'editor'
  const [editId,  setEditId]  = useState(null)
  const [comparing, setComparing] = useState(null)    // contactId of the family being compared
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [schemaMissing, setSchemaMissing] = useState(false)

  const name    = advisor?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  const email   = advisor?.email || user?.email || ''
  const initial = (name || email).charAt(0).toUpperCase()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [ps, adv] = await Promise.all([fetchParks(), fetchAdvisor(user)])
        if (!alive) return
        setParks(ps)
        setAdvisor({ ...adv, userId: user?.id })
        setParkId(prev => (prev && ps.some(p => p.id === prev)) ? prev : (ps[0]?.id || ''))
      } catch (e) {
        if (!alive) return
        if (e instanceof CemeterySchemaError) setSchemaMissing(true)
        setError(e.message || String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [user?.id])

  useEffect(() => {
    if (parkId) localStorage.setItem('cemetery_park', parkId)
  }, [parkId])

  const park = parks.find(p => p.id === parkId) || null

  function selectPark(id) {
    setParkId(id); setView('list'); setEditId(null); setComparing(null)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">

      {/* Subtle, matching the funeral portal and the quote sheet itself. */}
      <header className="bg-white border-b border-stone-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight text-stone-900">Cemetery Quote</h1>
            <p className="text-stone-400 text-xs mt-0.5 truncate">
              {park ? `${park.id} · ${park.name}` : 'Cemetery quotation manager'}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {parks.length > 0 && (
              <select
                value={parkId}
                onChange={e => selectPark(e.target.value)}
                className="input text-xs py-1.5 max-w-[180px] sm:max-w-[220px] truncate mr-1"
                aria-label="Select park"
              >
                {parks.map(p => (
                  <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
                ))}
              </select>
            )}

            {(name || email) && (
              <div className="hidden lg:flex items-center gap-2.5 mr-1">
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 text-stone-600
                                flex items-center justify-center text-sm font-semibold shrink-0">
                  {initial}
                </div>
                <div className="text-right">
                  {name && <p className="text-sm font-medium leading-tight text-stone-700">{name}</p>}
                  <p className="text-xs text-stone-400 leading-tight">{email}</p>
                </div>
              </div>
            )}

            <button onClick={onSwitchPortal}
                    className="text-xs text-stone-400 hover:text-stone-700 transition-colors px-3 py-2">
              Switch portal
            </button>
            <button onClick={onSignOut}
                    className="text-xs text-stone-400 hover:text-stone-700 transition-colors px-3 py-2">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {loading && (
          <p className="text-sm text-stone-400 text-center py-16">Loading cemetery portal…</p>
        )}

        {!loading && schemaMissing && (
          <div className="max-w-xl mx-auto p-6">
            <div className="card p-6">
              <h2 className="text-base font-bold text-stone-800">Can’t reach the cemetery data</h2>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                The API isn’t serving the <code className="bg-stone-100 px-1 py-0.5 rounded text-[13px]">cemetery</code>
                {' '}schema yet. Once that’s switched on this page will load normally.
              </p>

              <button onClick={() => window.location.reload()} className="btn-primary text-xs mt-5">
                Reload page
              </button>

              {error && (
                <p className="text-[11px] text-stone-400 mt-4 font-mono break-all">{error}</p>
              )}
            </div>
          </div>
        )}

        {!loading && !schemaMissing && !park && (
          <div className="max-w-xl mx-auto p-6">
            <div className="card p-6">
              <h2 className="text-base font-bold text-stone-800">No parks configured</h2>
              <p className="text-sm text-stone-600 mt-2">
                The API is reachable but no park rows came back. Run
                {' '}<code className="bg-stone-100 px-1.5 py-0.5 rounded">supabase/cemetery_seed_6800.sql</code>
                {' '}to load Victory Memorial Park.
              </p>
              {error && <p className="text-xs text-red-600 mt-3 font-mono break-all">{error}</p>}
            </div>
          </div>
        )}

        {!loading && park && view === 'list' && (
          <CemeteryQuoteList
            park={park}
            onNew={() => { setEditId(null); setView('editor') }}
            onOpen={id => { setEditId(id); setView('editor') }}
            advisor={advisor}
            onCompare={cid => setComparing(cid)}
          />
        )}

        {!loading && park && view === 'editor' && (
          <CemeteryQuoteEditor
            key={editId || 'new'}
            park={park}
            advisor={advisor}
            quoteId={editId}
            onBack={() => { setEditId(null); setView('list') }}
            onSaved={id => setEditId(id)}
            onOpenQuote={id => setEditId(id)}
            onCompare={cid => setComparing(cid)}
          />
        )}

        {/* Comparison opens over whichever view is showing, as in the funeral portal */}
        {!loading && park && comparing && (
          <CemeteryCompare park={park} contactId={comparing}
                           onClose={() => setComparing(null)} />
        )}
      </main>
    </div>
  )
}
