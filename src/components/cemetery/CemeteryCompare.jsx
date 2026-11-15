import { useEffect, useState } from 'react'
import CemeteryCompareTable from './CemeteryCompareTable.jsx'
import { fetchQuotes, fetchQuote, fromDbQuote } from '../../lib/cemetery.js'
import { calcCemeteryTotals, paymentPlanSummary } from '../../lib/cemeteryTotals.js'

// ─────────────────────────────────────────────────────────────────────────────
// Cemetery quote comparison — picker + data loading.
// The table itself is CemeteryCompareTable (presentational, fixture-testable).
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

const MAX = 6

export default function CemeteryCompare({ park, onBack }) {
  const [available, setAvailable] = useState([])
  const [selected,  setSelected]  = useState([])
  const [loaded,    setLoaded]    = useState([])
  const [busy,      setBusy]      = useState(false)
  const [error,     setError]     = useState('')
  const [onlyDiffs, setOnlyDiffs] = useState(false)
  const [zh,        setZh]        = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const qs = await fetchQuotes({ parkId: park.id })
        if (alive) setAvailable(qs)
      } catch (e) { if (alive) setError(e.message || String(e)) }
    })()
    return () => { alive = false }
  }, [park.id])

  useEffect(() => {
    let alive = true
    if (selected.length === 0) { setLoaded([]); return }
    setBusy(true)
    ;(async () => {
      try {
        const full = await Promise.all(selected.map(id => fetchQuote(id)))
        if (!alive) return
        setLoaded(full.map(f => {
          const { items, ...rest } = f
          const q = fromDbQuote(rest)
          const totals = calcCemeteryTotals(items, {
            discountPercent:   q.discountPercent,
            manualWaiveAmount: q.manualWaiveAmount,
            gstRate: q.gstRate, pstRate: q.pstRate,
          })
          return { ...q, items, totals, plan: paymentPlanSummary({ ...q, grandTotal: totals.grandTotal }) }
        }))
      } catch (e) { if (alive) setError(e.message || String(e)) }
      finally { if (alive) setBusy(false) }
    })()
    return () => { alive = false }
  }, [selected])

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : s.length >= MAX ? s : [...s, id])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button onClick={onBack} className="btn-ghost">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          {zh ? '返回' : 'Back'}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-stone-500">
            <input type="checkbox" checked={onlyDiffs} onChange={e => setOnlyDiffs(e.target.checked)}
                   className="w-4 h-4 rounded text-primary-600" />
            {zh ? '只看差異' : 'Differences only'}
          </label>
          <button onClick={() => setZh(v => !v)} className="btn-secondary text-xs">
            {zh ? 'English' : '中文'}
          </button>
          <button onClick={() => window.print()} disabled={loaded.length === 0}
                  className="btn-primary text-xs">
            {zh ? '列印' : 'Print'}
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-3 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="card p-4 print:hidden">
        <h2 className="text-sm font-semibold text-stone-700">
          {zh ? `選擇報價 (最多 ${MAX} 份)` : `Choose quotes to compare (up to ${MAX})`}
        </h2>
        {available.length === 0 ? (
          <p className="text-xs text-stone-400 mt-2">No saved quotes for this park yet.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {available.map(a => {
              const on = selected.includes(a.id)
              return (
                <button key={a.id} onClick={() => toggle(a.id)}
                        className={`px-3 py-2 rounded-lg text-xs border text-left transition-colors ${
                          on ? 'bg-primary-50 border-primary-300 text-primary-800'
                             : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                  <span className="font-semibold block">
                    {a.client_name || a.template_name || 'Untitled'}
                  </span>
                  <span className="text-stone-400">
                    {fmt(a.grand_total)} · {new Date(a.updated_at).toLocaleDateString('en-CA')}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {busy && <p className="text-sm text-stone-400 text-center py-6">Loading quotes…</p>}

      {!busy && loaded.length > 0 && (
        <div id="print-zone">
          <CemeteryCompareTable quotes={loaded} zh={zh} onlyDiffs={onlyDiffs} />
        </div>
      )}
    </div>
  )
}
