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
  const [categoryMap,     setCategoryMap]      = useState({}) // serviceItemId -> { categoryId, categoryName, sortOrder }
  const [casketMap,       setCasketMap]        = useState({}) // casketId -> { name, price, description, imageUrl }
  const [catOrder,        setCatOrder]         = useState([]) // [{ id, name, sortOrder }] sorted
  const [selected,        setSelected]         = useState(new Set())
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
        .from('quote_items')
        .select('*')
        .in('quote_id', qs.map(q => q.id))

      const grouped = {}
      qs.forEach(q => { grouped[q.id] = [] })
      ;(items || []).forEach(i => { grouped[i.quote_id]?.push(i) })

      // Fetch service item → category info
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
              id:        si.category_id,
              name:      si.service_categories?.name || 'Other',
              sortOrder: si.service_categories?.sort_order ?? 999,
            })
          }
        })
        orderedCats = [...catSeen.values()].sort((a, b) => a.sortOrder - b.sortOrder)
      }

      // Fetch casket data
      const cids = [...new Set((items || []).filter(i => i.is_casket_item && i.casket_id).map(i => i.casket_id))]
      let cskMap = {}
      if (cids.length) {
        const { data: cskData } = await supabase
          .from('caskets')
          .select('id, name, price, description, image_url')
          .in('id', cids)
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

  function buildCategoryRows() {
    const catRowsMap = new Map() // categoryId -> Map(key -> { name, prices })
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

    if (uncatRows.size > 0) {
      result.push({ catId: 'uncategorized', catName: 'Other Items', rows: [...uncatRows.values()] })
    }
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

        {/* Header */}
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
            {/* Toggle pills + casket images toggle */}
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
              {hasCaskets && (
                <label className="ml-auto flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showCasketImages}
                    onChange={e => setShowCasketImages(e.target.checked)}
                    className="rounded"
                  />
                  Show casket images
                </label>
              )}
            </div>

            {shown.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-16">Select at least one version.</p>
            ) : (
              <div className="overflow-x-auto">
                <table id="compare-print-zone" className="w-full text-sm">

                  {/* Version header columns */}
                  <thead>
                    <tr className="border-b-2 border-stone-100">
                      <th className="text-left px-6 py-5 text-xs font-semibold uppercase tracking-wider text-stone-400 w-56 min-w-[14rem]">
                        Item
                      </th>
                      {shown.map(q => (
                        <th key={q.id} className="px-5 py-5 text-center min-w-[160px]">
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
                    {/* ── Category rows ───────────────────────────────────── */}
                    {categoryRows.map(({ catId, catName, rows }) => (
                      <>
                        <tr key={`hd-${catId}`} className="bg-stone-50">
                          <td colSpan={shown.length + 1} className="px-6 py-2.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{catName}</span>
                          </td>
                        </tr>
                        {rows.map(row => (
                          <tr key={`${catId}-${row.name}`} className="border-b border-stone-50 hover:bg-stone-50/40 transition-colors">
                            <td className="px-6 py-2.5 text-sm text-stone-600 leading-snug">{row.name}</td>
                            {shown.map(q => (
                              <td key={q.id} className="px-5 py-2.5 text-center text-sm">
                                {row.prices[q.id] != null
                                  ? <span className="font-medium text-stone-700">{fmt(row.prices[q.id])}</span>
                                  : <span className="text-stone-200">—</span>
                                }
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
                          <td colSpan={shown.length + 1} className="px-6 py-2.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Casket Selection</span>
                          </td>
                        </tr>

                        {showCasketImages && (
                          <tr className="border-b border-stone-50">
                            <td className="px-6 py-3 text-xs text-stone-400 align-top">Model</td>
                            {shown.map(q => {
                              const entry = casketByQuote[q.id]
                              const csk   = entry?.casket
                              return (
                                <td key={q.id} className="px-4 py-3 text-center align-top">
                                  {entry ? (
                                    <div className="inline-flex flex-col items-center gap-1.5 max-w-[140px]">
                                      {csk?.imageUrl
                                        ? <img src={csk.imageUrl} alt={entry.name} className="w-full object-contain rounded-xl bg-stone-50 border border-stone-100 max-h-28" />
                                        : <div className="w-full h-16 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-[10px]">No image</div>
                                      }
                                      <p className="text-xs font-semibold text-stone-700 text-center leading-tight">{entry.name}</p>
                                      {csk?.description && (
                                        <p className="text-[10px] text-stone-400 text-center leading-tight line-clamp-3">{csk.description}</p>
                                      )}
                                    </div>
                                  ) : <span className="text-stone-200 text-sm">—</span>}
                                </td>
                              )
                            })}
                          </tr>
                        )}

                        <tr className="border-b border-stone-50 hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-2.5 text-sm text-stone-600">Casket Price</td>
                          {shown.map(q => {
                            const entry = casketByQuote[q.id]
                            return (
                              <td key={q.id} className="px-5 py-2.5 text-center text-sm">
                                {entry
                                  ? <span className="font-medium text-stone-700">{fmt(entry.price)}</span>
                                  : <span className="text-stone-200">—</span>
                                }
                              </td>
                            )
                          })}
                        </tr>
                      </>
                    )}

                    {/* ── Summary ─────────────────────────────────────────── */}
                    <tr className="bg-stone-50">
                      <td colSpan={shown.length + 1} className="px-6 py-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Summary</span>
                      </td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="px-6 py-2.5 text-sm text-stone-500">Subtotal</td>
                      {shown.map(q => (
                        <td key={q.id} className="px-5 py-2.5 text-center text-sm text-stone-700">{fmt(q.subtotal)}</td>
                      ))}
                    </tr>
                    {shown.some(q => q.package_discount > 0) && (
                      <tr className="border-b border-stone-100">
                        <td className="px-6 py-2.5 text-sm text-stone-500">Package Discount</td>
                        {shown.map(q => (
                          <td key={q.id} className="px-5 py-2.5 text-center text-sm text-emerald-600">
                            {q.package_discount > 0 ? `−${fmt(q.package_discount)}` : <span className="text-stone-200">—</span>}
                          </td>
                        ))}
                      </tr>
                    )}
                    {shown.some(q => (q.discount_amount - (q.package_discount || 0)) > 0) && (
                      <tr className="border-b border-stone-100">
                        <td className="px-6 py-2.5 text-sm text-stone-500">Additional Discount</td>
                        {shown.map(q => {
                          const d = q.discount_amount - (q.package_discount || 0)
                          return (
                            <td key={q.id} className="px-5 py-2.5 text-center text-sm text-red-500">
                              {d > 0 ? `−${fmt(d)}` : <span className="text-stone-200">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    )}
                    <tr className="border-b border-stone-100">
                      <td className="px-6 py-2.5 text-sm text-stone-500">Tax</td>
                      {shown.map(q => (
                        <td key={q.id} className="px-5 py-2.5 text-center text-sm text-stone-600">{fmt(q.tax_amount)}</td>
                      ))}
                    </tr>
                    <tr className="border-t-2 border-stone-200">
                      <td className="px-6 py-5 text-sm font-bold text-stone-800">Total</td>
                      {shown.map(q => (
                        <td key={q.id} className="px-5 py-5 text-center">
                          <span className="text-xl font-bold text-primary-800">{fmt(q.total)}</span>
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
