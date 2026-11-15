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
  const [view,    setView]    = useState('list')      // 'list' | 'editor' | 'compare'
  const [editId,  setEditId]  = useState(null)
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
    setParkId(id); setView('list'); setEditId(null)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">

      <header className="bg-primary-800 text-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight">Cemetery Quote</h1>
            <p className="text-primary-300 text-xs mt-0.5 truncate">
              {park ? `${park.id} · ${park.name}` : 'Cemetery quotation manager'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {parks.length > 0 && (
              <select
                value={parkId}
                onChange={e => selectPark(e.target.value)}
                className="bg-primary-700 border border-primary-600 text-white text-xs rounded-lg
                           px-2.5 py-2 max-w-[200px] focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Select park"
              >
                {parks.map(p => (
                  <option key={p.id} value={p.id}>{p.id} — {p.name}</option>
                ))}
              </select>
            )}

            {(name || email) && (
              <div className="hidden lg:flex items-center gap-2.5 mr-1">
                <div className="w-8 h-8 rounded-full bg-primary-600 border border-primary-500
                                flex items-center justify-center text-sm font-bold shrink-0">
                  {initial}
                </div>
                <div className="text-right">
                  {name && <p className="text-sm font-medium leading-tight">{name}</p>}
                  <p className="text-xs text-primary-300 leading-tight">{email}</p>
                </div>
              </div>
            )}

            <button onClick={onSwitchPortal}
                    className="text-xs text-primary-300 hover:text-white transition-colors px-3 py-2">
              Switch portal
            </button>
            <button onClick={onSignOut}
                    className="text-xs text-primary-300 hover:text-white transition-colors px-3 py-2">
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
              <h2 className="text-base font-bold text-stone-800">One setup step left</h2>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                The cemetery tables exist but the API can’t see them yet. In Supabase go to
                <span className="font-semibold"> Settings → API → Exposed schemas</span> and
                add <code className="bg-stone-100 px-1.5 py-0.5 rounded text-[13px]">cemetery</code>,
                then reload this page.
              </p>
              <p className="text-xs text-stone-400 mt-3">
                If you haven’t run the SQL yet, run
                <code className="bg-stone-100 px-1.5 py-0.5 rounded mx-1">supabase/cemetery_schema.sql</code>
                then
                <code className="bg-stone-100 px-1.5 py-0.5 rounded mx-1">supabase/cemetery_seed_6800.sql</code>
                first.
              </p>
            </div>
          </div>
        )}

        {!loading && !schemaMissing && !park && (
          <div className="max-w-xl mx-auto p-6">
            <div className="card p-6">
              <h2 className="text-base font-bold text-stone-800">No parks configured</h2>
              <p className="text-sm text-stone-600 mt-2">
                Run <code className="bg-stone-100 px-1.5 py-0.5 rounded">supabase/cemetery_seed_6800.sql</code>
                {' '}to load Victory Memorial Park.
              </p>
              {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
            </div>
          </div>
        )}

        {!loading && park && view === 'list' && (
          <CemeteryQuoteList
            park={park}
            onNew={() => { setEditId(null); setView('editor') }}
            onOpen={id => { setEditId(id); setView('editor') }}
            onCompare={() => setView('compare')}
          />
        )}

        {!loading && park && view === 'editor' && (
          <CemeteryQuoteEditor
            park={park}
            advisor={advisor}
            quoteId={editId}
            onBack={() => { setEditId(null); setView('list') }}
            onSaved={id => setEditId(id)}
          />
        )}

        {!loading && park && view === 'compare' && (
          <CemeteryCompare park={park} onBack={() => setView('list')} />
        )}
      </main>
    </div>
  )
}
