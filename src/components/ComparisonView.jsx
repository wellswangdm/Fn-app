import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

const STATUS_CLS = {
  draft:     'bg-amber-50 text-amber-600 border-amber-200',
  finalized: 'bg-blue-50 text-blue-600 border-blue-200',
  accepted:  'bg-green-50 text-green-600 border-green-200',
}

function openPrint() {
  const zone = document.getElementById('compare-print-zone')
  if (!zone) return
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(l => `<link rel="stylesheet" href="${l.href}">`)
    .join('\n')
  const win = window.open('', '_blank')
  if (!win) { alert('Allow popups for this site to print.'); return }
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${stylesheets}
  <style>body{margin:0;padding:20px;background:#fff}@media print{body{padding:0}}</style>
</head>
<body>
  ${zone.outerHTML}
  <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),400))<\/script>
</body>
</html>`)
  win.document.close()
}

export default function ComparisonView({ contactId, currentQuoteId, onClose }) {
  const [quotes,          setQuotes]          = useState([])
  const [itemsByQuote,    setItemsByQuote]     = useState({})
  const [categoryMap,     setCategoryMap]      = useState({})
  const [casketMap,       setCasketMap]        = useState({})
  const [catOrder,        setCatOrder]         = useState([])
  const [selected,        setSelected]         = useState(new Set())
  const [showPrices,      setShowPrices]       = useState(true)
  const [showCasketImages, setShowCasketImages] = useState(true)
  const [loading,         setLoading]          = useState(true)

  useEffect(() => {
    async function load() {
      const { data: qs } = await supabase
        .from('quotes')
        .select('id, quote_number, status, total, subtotal, package_discount, discount_amount, tax_amount, arrangement_type, created_at, version_label, packages(name)')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: true })

      if (!qs?.length) { setLoading(false); return }

      const { data: items } = await supabase
        .from('quote_items').select('*').in('quote_id', qs.map(q => q.id))

      const grouped = {}
      qs.forEach(q => { grouped[q.id] = [] })
      ;(items || []).forEach(i => { grouped[i.quote_id]?.push(i) })

      const sids = [...new Set((items || []).filter(i => i.service_item_id).map(i => i.service_item_id))]
      let catMap = {}
      let orderedCats = []
      if (sids.length) {
        const { data: siData } = await supabase
          .from('service_items')
          .select('id, category_id, service_categories(id, name, sort_order)')
          .in('id', sids)
        const catSeen = new Map()
        ;(siData || []).forEach(si => {
          catMap[si.id] = {
            categoryId:   si.category_id,
            categoryName: si.service_categories?.name || 'Other',
            sortOrder:    si.service_categories?.sort_order ?? 999,
          }
          if (si.category_id && !catSeen.has(si.category_id)) {
            catSeen.set(si.category_id, {
              id: si.category_id,
              name: si.service_categories?.name || 'Other',
              sortOrder: si.service_categories?.sort_order ?? 999,
            })
          }
        })
        orderedCats = [...catSeen.values()].sort((a, b) => a.sortOrder - b.sortOrder)
      }

      const cids = [...new Set((items || []).filter(i => i.is_casket_item && i.casket_id).map(i => i.casket_id))]
      let cskMap = {}
      if (cids.length) {
        const { data: cskData } = await supabase
          .from('caskets').select('id, name, price, description, image_url').in('id', cids)
        ;(cskData || []).forEach(c => {
          cskMap[c.id] = { name: c.name, price: Number(c.price), description: c.description, imageUrl: c.image_url }
        })
      }

      setQuotes(qs)
      setItemsByQuote(grouped)
      setCategoryMap(catMap)
      setCasketMap(cskMap)
      setCatOrder(orderedCats)
      setSelected(new Set(qs.map(q => q.id)))
      setLoading(false)
    }
    load()
  }, [contactId])

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const shown = quotes.filter(q => selected.has(q.id))
  const cols  = shown.length

  // Build category rows: categoryId → ordered list of { name, prices: {quoteId: amount} }
  function buildCategoryRows() {
    const catRowsMap = new Map()
    const uncatRows  = new Map()

    shown.forEach(q => {
      ;(itemsByQuote[q.id] || []).forEach(item => {
        if (item.is_casket_item) return
        const key     = item.service_item_id || item.name
        const catInfo = item.service_item_id ? categoryMap[item.service_item_id] : null
        const catId   = catInfo?.categoryId || 'uncategorized'
        const bucket  = catId === 'uncategorized' ? uncatRows : (catRowsMap.get(catId) || new Map())
        if (catId !== 'uncategorized') catRowsMap.set(catId, bucket)
        if (!bucket.has(key)) bucket.set(key, { name: item.name, prices: {} })
        bucket.get(key).prices[q.id] = item.price * item.quantity
      })
    })

    const result = catOrder
      .filter(cat => catRowsMap.has(cat.id))
      .map(cat => ({ catId: cat.id, catName: cat.name, rows: [...catRowsMap.get(cat.id).values()] }))
    if (uncatRows.size > 0)
      result.push({ catId: 'uncategorized', catName: 'Other Items', rows: [...uncatRows.values()] })
    return result
  }

  function getCasketByQuote() {
    const result = {}
    shown.forEach(q => {
      const item = (itemsByQuote[q.id] || []).find(i => i.is_casket_item)
      if (item) result[q.id] = { name: item.name, price: item.price, casket: item.casket_id ? casketMap[item.casket_id] : null }
    })
    return result
  }

  const hasCaskets    = shown.some(q => (itemsByQuote[q.id] || []).some(i => i.is_casket_item))
  const casketByQuote = hasCaskets ? getCasketByQuote() : {}
  const categoryRows  = shown.length ? buildCategoryRows() : []

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-4">

        {/* ── Modal header ───────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-800">Compare Versions</h2>
            <p className="text-xs text-stone-400 mt-0.5">Toggle versions to include or exclude them</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openPrint}
              className="text-xs font-medium text-stone-500 hover:text-primary-700 border border-stone-200
                         hover:border-primary-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Print / Save PDF
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
          </div>
        </div>

        {loading ? <p className="text-sm text-stone-400 p-8 text-center">Loading…</p> : (
          <>
            {/* ── Toolbar: version pills + display toggles ─────────────── */}
            <div className="flex gap-2 px-6 py-3 border-b border-stone-100 flex-wrap items-center bg-stone-50/60">
              {quotes.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => toggle(q.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                    selected.has(q.id)
                      ? 'border-primary-300 bg-primary-50 text-primary-700'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selected.has(q.id) ? 'bg-primary-500' : 'bg-stone-300'}`} />
                  {q.version_label || `V${i + 1}`}
                  {q.id === currentQuoteId && <span className="text-[10px] opacity-60 ml-1">current</span>}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer select-none">
                  <input type="checkbox" checked={showPrices} onChange={e => setShowPrices(e.target.checked)} className="rounded" />
                  Show prices
                </label>
                {hasCaskets && (
                  <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer select-none">
                    <input type="checkbox" checked={showCasketImages} onChange={e => setShowCasketImages(e.target.checked)} className="rounded" />
                    Show casket images
                  </label>
                )}
              </div>
            </div>

            {shown.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-16">Select at least one version.</p>
            ) : (
              <div className="overflow-x-auto">
                <table id="compare-print-zone" className="w-full text-sm border-collapse">

                  {/* ── Version column headers ──────────────────────────── */}
                  <thead>
                    <tr className="border-b-2 border-stone-100">
                      {shown.map(q => (
                        <th key={q.id} className="px-6 py-5 text-center" style={{ width: `${100 / cols}%` }}>
                          <p className={`text-base font-bold ${q.id === currentQuoteId ? 'text-primary-700' : 'text-stone-800'}`}>
                            {q.version_label || `V${quotes.indexOf(q) + 1}`}
                          </p>
                          <p className="text-xs text-stone-400 font-normal mt-0.5">{q.packages?.name || 'No package'}</p>
                          <p className="text-[11px] text-stone-400 font-normal capitalize mt-0.5">{q.arrangement_type}</p>
                          <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CLS[q.status] || 'bg-stone-100 text-stone-500 border-stone-200'}`}>
                            {q.status}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* ── Service item categories ──────────────────────── */}
                    {categoryRows.map(({ catId, catName, rows }) => (
                      <>
                        {/* Section header */}
                        <tr key={`hd-${catId}`} className="bg-stone-50">
                          <td colSpan={cols} className="px-6 py-2.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{catName}</span>
                          </td>
                        </tr>

                        {/* Item rows — item name lives inside each version cell */}
                        {rows.map(row => (
                          <tr key={`${catId}-${row.name}`} className="border-b border-stone-50">
                            {shown.map(q => (
                              <td key={q.id} className="px-6 py-3 text-center align-top">
                                {row.prices[q.id] != null ? (
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className="text-sm text-stone-700 leading-snug">{row.name}</span>
                                    {showPrices && (
                                      <span className="text-[11px] text-stone-400">{fmt(row.prices[q.id])}</span>
                                    )}
                                  </div>
                                ) : null}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}

                    {/* ── Casket section ──────────────────────────────────── */}
                    {hasCaskets && (
                      <>
                        <tr className="bg-stone-50">
                          <td colSpan={cols} className="px-6 py-2.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Casket Selection</span>
                          </td>
                        </tr>
                        <tr className="border-b border-stone-50">
                          {shown.map(q => {
                            const entry = casketByQuote[q.id]
                            const csk   = entry?.casket
                            return (
                              <td key={q.id} className="px-6 py-4 text-center align-top">
                                {entry ? (
                                  <div className="flex flex-col items-center gap-2">
                                    {showCasketImages && (
                                      csk?.imageUrl
                                        ? <img src={csk.imageUrl} alt={entry.name} className="w-full max-w-[140px] object-contain rounded-xl bg-stone-50 border border-stone-100 max-h-28" />
                                        : <div className="w-28 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-[10px]">No image</div>
                                    )}
                                    <span className="text-sm font-semibold text-stone-700 leading-snug">{entry.name}</span>
                                    {csk?.description && (
                                      <span className="text-[10px] text-stone-400 leading-tight max-w-[160px] text-center line-clamp-3">{csk.description}</span>
                                    )}
                                    {showPrices && (
                                      <span className="text-[11px] text-stone-400">{fmt(entry.price)}</span>
                                    )}
                                  </div>
                                ) : null}
                              </td>
                            )
                          })}
                        </tr>
                      </>
                    )}

                    {/* ── Summary ─────────────────────────────────────────── */}
                    <tr className="bg-stone-50">
                      <td colSpan={cols} className="px-6 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Summary</span>
                      </td>
                    </tr>

                    <tr className="border-b border-stone-100">
                      {shown.map(q => (
                        <td key={q.id} className="px-6 py-2.5 text-center">
                          <p className="text-[10px] text-stone-400 uppercase tracking-wider">Subtotal</p>
                          <p className="text-sm text-stone-700 mt-0.5">{fmt(q.subtotal)}</p>
                        </td>
                      ))}
                    </tr>

                    {shown.some(q => q.package_discount > 0) && (
                      <tr className="border-b border-stone-100">
                        {shown.map(q => (
                          <td key={q.id} className="px-6 py-2.5 text-center">
                            {q.package_discount > 0 ? (
                              <>
                                <p className="text-[10px] text-stone-400 uppercase tracking-wider">Pkg Discount</p>
                                <p className="text-sm text-emerald-600 mt-0.5">−{fmt(q.package_discount)}</p>
                              </>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    )}

                    {shown.some(q => (q.discount_amount - (q.package_discount || 0)) > 0) && (
                      <tr className="border-b border-stone-100">
                        {shown.map(q => {
                          const d = q.discount_amount - (q.package_discount || 0)
                          return (
                            <td key={q.id} className="px-6 py-2.5 text-center">
                              {d > 0 ? (
                                <>
                                  <p className="text-[10px] text-stone-400 uppercase tracking-wider">Discount</p>
                                  <p className="text-sm text-red-500 mt-0.5">−{fmt(d)}</p>
                                </>
                              ) : null}
                            </td>
                          )
                        })}
                      </tr>
                    )}

                    <tr className="border-b border-stone-100">
                      {shown.map(q => (
                        <td key={q.id} className="px-6 py-2.5 text-center">
                          <p className="text-[10px] text-stone-400 uppercase tracking-wider">Tax</p>
                          <p className="text-sm text-stone-600 mt-0.5">{fmt(q.tax_amount)}</p>
                        </td>
                      ))}
                    </tr>

                    <tr className="border-t-2 border-stone-200">
                      {shown.map(q => (
                        <td key={q.id} className="px-6 py-6 text-center">
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Total</p>
                          <p className="text-2xl font-bold text-primary-800">{fmt(q.total)}</p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
