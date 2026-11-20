import { useEffect, useMemo, useState } from 'react'
import CemeteryCompareSheet from './CemeteryCompareSheet.jsx'
import {
  fetchQuotes, fetchQuote, fromDbQuote, fetchProductMeta, createComparisonShare,
} from '../../lib/cemetery.js'
import { calcCemeteryTotals, paymentPlanSummary } from '../../lib/cemeteryTotals.js'
import { buildComparisonSections, sectionsHaveImages } from '../../lib/cemeteryCompare.js'
import { buildCemeteryPrintHTML, buildCemeteryWebHTML } from '../../lib/cemeteryCompareHtml.js'
import { useChineseMode } from '../../lib/useChineseMode.js'
import { optionName, propertyNameOf } from '../../lib/cemeteryOptionLabel.js'

// ─────────────────────────────────────────────────────────────────────────────
// Cemetery comparison — selection, options and sharing.
// The presentation itself is CemeteryCompareSheet; print and share output come
// from cemeteryCompareHtml.js so all three stay identical.
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

const MAX = 4

export default function CemeteryCompare({ park, contactId, onClose }) {
  const [available, setAvailable] = useState([])
  const [selected,  setSelected]  = useState([])
  const [loaded,    setLoaded]    = useState([])
  const [productMeta, setProductMeta] = useState({})
  const [loading,   setLoading]   = useState(true)
  const [busy,      setBusy]      = useState(false)
  const [error,     setError]     = useState('')

  const [showPrices,  setShowPrices]  = useState(true)
  const [showImages,  setShowImages]  = useState(true)
  const [showTicker,  setShowTicker]  = useState(true)
  const [showPayment, setShowPayment] = useState(true)
  const [itemizeFees, setItemizeFees] = useState(false)
  // Shared with the review screen and the funeral portal, so comparing two
  // quotes never depends on the language each was built in.
  const [zh,          setZh]          = useChineseMode()
  const [shareStatus, setShareStatus] = useState(null)
  // Two columns side by side on a phone, scaled to fit, rather than a sheet
  // that scrolls sideways.
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const onChange = e => setIsNarrow(e.matches)
    setIsNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // Only this family's options. Previously every quote in the park was
        // listed and the first two auto-selected, which is the wrong
        // hierarchy and unusable once there are many quotes.
        const qs = await fetchQuotes({ parkId: park.id, contactId })
        if (!alive) return
        setAvailable(qs)
        setSelected(qs.map(q => q.id))
      } catch (e) { if (alive) setError(e.message || String(e)) }
      finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [park.id, contactId])

  useEffect(() => {
    let alive = true
    if (selected.length === 0) { setLoaded([]); return }
    setBusy(true)
    ;(async () => {
      try {
        const full = await Promise.all(selected.map(id => fetchQuote(id)))
        if (!alive) return
        const prepared = full.map((f, i) => {
          const { items, ...rest } = f
          const q = fromDbQuote(rest)
          const totals = calcCemeteryTotals(items, {
            discountPercent:   q.discountPercent,
            manualWaiveAmount: q.manualWaiveAmount,
            gstRate: q.gstRate, pstRate: q.pstRate,
          })
          return {
            ...q, items, totals,
            label:    optionName({ versionLabel: q.versionLabel,
                                   propertyName: propertyNameOf(items), index: i }),
            parkName: park.name,
            plan:     paymentPlanSummary({ ...q, grandTotal: totals.grandTotal }),
          }
        })
        const meta = await fetchProductMeta(
          prepared.flatMap(q => q.items.map(l => l.productId)))
        if (!alive) return
        setProductMeta(meta)
        setLoaded(prepared)
      } catch (e) { if (alive) setError(e.message || String(e)) }
      finally { if (alive) setBusy(false) }
    })()
    return () => { alive = false }
  }, [selected, park.name])

  const sections = useMemo(
    () => buildComparisonSections(loaded, productMeta, { itemizeFees }),
    [loaded, productMeta, itemizeFees])

  const anyImages = useMemo(() => sectionsHaveImages(sections), [sections])

  const htmlProps = {
    quotes: loaded, sections, showPrices,
    showImages: showImages && anyImages, showTicker, showPayment, zh,
    title: `${park.name} — Quote Comparison`,
  }

  // A phone shows two options side by side and no more — three columns in
  // 390px is not a comparison. Picking a third swaps out the one selected
  // longest ago, so the chips are what choose the pair.
  const MAX_ON_NARROW = 2

  function toggle(id) {
    setSelected(s => {
      if (s.includes(id)) return s.filter(x => x !== id)
      const cap = isNarrow ? MAX_ON_NARROW : MAX
      return s.length >= cap ? [...s.slice(1), id] : [...s, id]
    })
  }

  function handlePrint() {
    const win = window.open('', '_blank')
    if (!win) { alert('Allow popups for this site to print.'); return }
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${park.name} — Quote Comparison</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;padding:24px}
/* size:auto uses whatever paper is loaded — Letter or A4 — instead of
   fitting a named page box inside it and shrinking everything. */
@page{size:auto;margin:12mm}@media print{body{padding:0}}</style></head>
<body>${buildCemeteryPrintHTML(htmlProps)}
<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),400))<\/script></body></html>`)
    win.document.close()
  }

  function handleOpenHTML() {
    const win = window.open('', '_blank')
    if (!win) { alert('Allow popups for this site to preview.'); return }
    win.document.write(buildCemeteryWebHTML(htmlProps))
    win.document.close()
  }

  async function handleShare() {
    if (shareStatus === 'uploading') return
    setShareStatus('uploading')
    try {
      const id  = await createComparisonShare(buildCemeteryWebHTML(htmlProps))
      const url = `${window.location.origin}/share/${id}`
      await navigator.clipboard.writeText(url)
      setShareStatus('done')
      setTimeout(() => setShareStatus(null), 4000)
    } catch (e) {
      console.error('Share failed:', e?.message ?? e)
      setShareStatus('error')
      setTimeout(() => setShareStatus(null), 3000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-4">

        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-stone-100 flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-stone-800">Compare Options</h2>
            {/* The explanation is the first thing to go when space is tight. */}
            <p className="hidden sm:block text-xs text-stone-400 mt-0.5">
              Each column shows everything included in that option
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button
              onClick={handleShare}
              disabled={shareStatus === 'uploading' || loaded.length === 0}
              className={`text-xs font-medium border px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50
                ${shareStatus === 'done'  ? 'border-emerald-300 text-emerald-600 bg-emerald-50' :
                  shareStatus === 'error' ? 'border-red-300 text-red-500' :
                  'border-stone-200 text-stone-500 hover:text-primary-700 hover:border-primary-300'}`}
            >
              {shareStatus === 'uploading' ? 'Uploading…' :
               shareStatus === 'done'      ? 'Link copied!' :
               shareStatus === 'error'     ? 'Error — retry?' : 'Share link'}
            </button>
            <button onClick={handleOpenHTML} disabled={loaded.length === 0}
                    className="text-xs font-medium text-stone-500 hover:text-primary-700 border border-stone-200
                               hover:border-primary-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              Open HTML
            </button>
            <button onClick={handlePrint} disabled={loaded.length === 0}
                    className="text-xs font-medium text-stone-500 hover:text-primary-700 border border-stone-200
                               hover:border-primary-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              Print / Save PDF
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none ml-1">×</button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-stone-400 p-8 text-center">Loading…</p>
        ) : available.length === 0 ? (
          <p className="text-sm text-stone-400 p-10 text-center">
            This family has only one option. Open it and use “Add option” to build
            an alternative, then compare them here.
          </p>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex gap-2 px-4 sm:px-6 py-3 border-b border-stone-100 flex-wrap items-center bg-stone-50/50">
              {available.map((a, i) => (
                <button key={a.id} onClick={() => toggle(a.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
                    selected.includes(a.id)
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-stone-200 bg-white text-stone-400'}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    selected.includes(a.id) ? 'bg-primary-500' : 'bg-stone-300'}`} />
                  {/* The same label as the column heading above. The family
                      name is on every option, so it tells them apart not at all. */}
                  {loaded.find(l => l.id === a.id)?.label
                    || optionName({ versionLabel: a.version_label, index: i })}
                </button>
              ))}

              <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <Check checked={zh} onChange={setZh}>中文</Check>
                <Check checked={showPrices} onChange={setShowPrices}>Show prices</Check>
                {anyImages && <Check checked={showImages} onChange={setShowImages}>Images</Check>}
                <Check checked={showTicker} onChange={setShowTicker}>Discount &amp; tax</Check>
                <Check checked={showPayment} onChange={setShowPayment}>Payment options</Check>
                <Check checked={itemizeFees} onChange={setItemizeFees}>Itemize fees</Check>
              </div>
            </div>

            {error && <p className="text-sm text-red-600 px-6 py-3">{error}</p>}

            {busy ? (
              <p className="text-sm text-stone-400 p-10 text-center">Loading quotes…</p>
            ) : loaded.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-16">Select at least one option.</p>
            ) : (
              // #print-zone is what the app's global print rule makes visible;
              // without it a browser Print from this modal produced a blank page.
              <div id="print-zone">
              <CemeteryCompareSheet
                isNarrow={isNarrow}
                quotes={isNarrow ? loaded.slice(0, MAX_ON_NARROW) : loaded}
                sections={sections}
                showPrices={showPrices}
                showImages={showImages && anyImages}
                showTicker={showTicker}
                showPayment={showPayment}
                zh={zh}
              />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Check({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-1.5 text-sm text-stone-500 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded" />
      {children}
    </label>
  )
}
