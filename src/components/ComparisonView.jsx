import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function fmt(n) {
  return n == null ? '—' : `$${Number(n).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}

// ─── Self-contained print HTML (no Tailwind dependency) ──────────────────────
function buildPrintHTML({ shown, quotes, categoryData, hasCaskets, casketByQuote, showPrices, showCasketImages }) {
  const n  = shown.length
  const g  = `display:grid;grid-template-columns:repeat(${n},minmax(0,1fr));`
  const cb = i => i < n - 1 ? 'border-right:1px solid #f0f0f0;' : ''

  const versionHeaders = shown.map((q, i) => {
    const ticker = [
      q.discount_amount > 0 && `−${fmt(q.discount_amount)} discount`,
      q.tax_amount > 0 && `+${fmt(q.tax_amount)} tax`,
    ].filter(Boolean).join(' · ')
    return `
    <div style="text-align:center;padding:24px 16px 28px;${cb(i)}">
      <p style="margin:0;font-size:20px;font-weight:700;color:#1d1d1f;font-family:-apple-system,sans-serif">
        ${esc(q.version_label || `V${quotes.indexOf(q) + 1}`)}
      </p>
      ${q.packages?.name ? `<p style="margin:5px 0 0;font-size:12px;color:#86868b">${esc(q.packages.name)}</p>` : ''}
      ${q.arrangement_type ? `<p style="margin:3px 0 0;font-size:11px;color:#86868b;text-transform:capitalize">${esc(q.arrangement_type)}</p>` : ''}
      <p style="margin:16px 0 0;font-size:30px;font-weight:700;color:#1d1d1f;letter-spacing:-.02em">${fmt(q.total)}</p>
      ${ticker ? `<p style="margin:6px 0 0;font-size:10px;color:#a1a1aa">${ticker}</p>` : ''}
    </div>`
  }).join('')

  function catSectionHTML({ catName, itemsByVersion }) {
    return `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#86868b">${esc(catName)}</span>
    </div>
    <div style="${g}">
      ${shown.map((q, i) => `
        <div style="text-align:center;padding:6px 16px 24px;${cb(i)}">
          ${(itemsByVersion[q.id] || []).map(item => `
            <div style="margin-bottom:14px">
              <p style="margin:0;font-size:14px;font-weight:600;color:#1d1d1f;line-height:1.4">${esc(item.name)}</p>
              ${showPrices ? `<p style="margin:3px 0 0;font-size:11px;color:#86868b">${fmt(item.amount)}</p>` : ''}
            </div>`).join('')}
        </div>`).join('')}
    </div>`
  }

  const casketHTML = hasCaskets ? `
    <div style="text-align:center;padding:32px 0 10px;">
      <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#86868b">Casket Selection</span>
    </div>
    <div style="${g}">
      ${shown.map((q, i) => {
        const e = casketByQuote[q.id]; const csk = e?.casket
        return `
          <div style="text-align:center;padding:6px 16px 24px;${cb(i)}">
            ${e ? `
              ${showCasketImages && csk?.imageUrl ? `<img src="${esc(csk.imageUrl)}" style="max-width:130px;width:100%;height:auto;object-fit:contain;border-radius:10px;background:#f5f5f7;margin-bottom:10px">` : ''}
              <p style="margin:0;font-size:14px;font-weight:600;color:#1d1d1f">${esc(e.name)}</p>
              ${csk?.description ? `<p style="margin:4px 0 0;font-size:11px;color:#86868b;line-height:1.4">${esc(csk.description)}</p>` : ''}
              ${showPrices ? `<p style="margin:5px 0 0;font-size:11px;color:#86868b">${fmt(e.price)}</p>` : ''}
            ` : `<span style="font-size:12px;color:#d1d1d6">Not selected</span>`}
          </div>`
      }).join('')}
    </div>` : ''

  const pssCat   = categoryData.find(c => c.catId === 'pss')
  const transCat = categoryData.find(c => c.catId === 'trans')
  const caCat    = categoryData.find(c => c.catId === 'ca')

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,sans-serif;max-width:960px;margin:0 auto;color:#1d1d1f">
      <div style="${g}border-bottom:1px solid #e5e5e5;">${versionHeaders}</div>
      ${pssCat   ? catSectionHTML(pssCat)   : ''}
      ${casketHTML}
      ${transCat ? catSectionHTML(transCat) : ''}
      ${caCat    ? catSectionHTML(caCat)    : ''}
    </div>`
}

// ─── Component ────────────────────────────────────────────────────────────────

const STATUS_CLS = {
  finalized: 'bg-blue-50 text-blue-600 border-blue-200',
  accepted:  'bg-green-50 text-green-600 border-green-200',
}

export default function ComparisonView({ contactId, currentQuoteId, onClose }) {
  const [quotes,           setQuotes]           = useState([])
  const [itemsByQuote,     setItemsByQuote]      = useState({})
  const [categoryMap,      setCategoryMap]       = useState({})
  const [casketMap,        setCasketMap]         = useState({})
  const [selected,         setSelected]          = useState(new Set())
  const [showPrices,       setShowPrices]        = useState(true)
  const [showCasketImages, setShowCasketImages]  = useState(true)
  const [loading,          setLoading]           = useState(true)

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
      if (sids.length) {
        const { data: siData } = await supabase
          .from('service_items').select('id, category_id, service_categories(id, name)').in('id', sids)
        ;(siData || []).forEach(si => {
          catMap[si.id] = { categoryName: si.service_categories?.name || '' }
        })
      }

      const cids = [...new Set((items || []).filter(i => i.is_casket_item && i.casket_id).map(i => i.casket_id))]
      let cskMap = {}
      if (cids.length) {
        const { data: d } = await supabase.from('caskets').select('id, name, price, description, image_url').in('id', cids)
        ;(d || []).forEach(c => { cskMap[c.id] = { name: c.name, price: Number(c.price), description: c.description, imageUrl: c.image_url } })
      }

      setQuotes(qs); setItemsByQuote(grouped); setCategoryMap(catMap)
      setCasketMap(cskMap)
      setSelected(new Set(qs.map(q => q.id))); setLoading(false)
    }
    load()
  }, [contactId])

  function toggle(id) {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const shown = quotes.filter(q => selected.has(q.id))
  const cols  = shown.length

  function buildCategoryData() {
    const PSS   = { catId: 'pss',   catName: 'Professional Staff & Services', itemsByVersion: {} }
    const TRANS = { catId: 'trans', catName: 'Transportation',                itemsByVersion: {} }
    const CA    = { catId: 'ca',    catName: 'Cash Advanced Items',           itemsByVersion: {} }

    shown.forEach(q => {
      ;(itemsByQuote[q.id] || []).forEach(item => {
        if (item.is_casket_item) return
        const catName = item.service_item_id ? (categoryMap[item.service_item_id]?.categoryName || '') : ''
        const n = catName.toLowerCase()
        const bucket = n.includes('cash') ? CA : n.includes('transport') ? TRANS : PSS
        const entry  = { name: item.name, amount: item.price * item.quantity }
        if (!bucket.itemsByVersion[q.id]) bucket.itemsByVersion[q.id] = []
        bucket.itemsByVersion[q.id].push(entry)
      })
    })

    const result = []
    if (shown.some(q => PSS.itemsByVersion[q.id]?.length))   result.push(PSS)
    if (shown.some(q => TRANS.itemsByVersion[q.id]?.length)) result.push(TRANS)
    if (shown.some(q => CA.itemsByVersion[q.id]?.length))    result.push(CA)
    return result
  }

  function getCasketByQuote() {
    const r = {}
    shown.forEach(q => {
      const item = (itemsByQuote[q.id] || []).find(i => i.is_casket_item)
      if (item) r[q.id] = { name: item.name, price: item.price, casket: item.casket_id ? casketMap[item.casket_id] : null }
    })
    return r
  }

  const hasCaskets    = shown.some(q => (itemsByQuote[q.id] || []).some(i => i.is_casket_item))
  const casketByQuote = hasCaskets ? getCasketByQuote() : {}
  const categoryData  = shown.length ? buildCategoryData() : []

  function handlePrint() {
    const win = window.open('', '_blank')
    if (!win) { alert('Allow popups for this site to print.'); return }
    const html = buildPrintHTML({ shown, quotes, categoryData, hasCaskets, casketByQuote, showPrices, showCasketImages })
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote Comparison</title>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;padding:24px}@page{margin:1.5cm}@media print{body{padding:0}}</style>
</head>
<body>${html}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),400))<\/script></body>
</html>`)
    win.document.close()
  }

  const gridStyle = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
  const colBorder = i => i < cols - 1 ? 'border-r border-stone-100' : ''

  function renderCatSection({ catId, catName, itemsByVersion }) {
    return (
      <div key={catId}>
        <div className="pt-8 pb-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{catName}</span>
        </div>
        <div className="grid" style={gridStyle}>
          {shown.map((q, idx) => (
            <div key={q.id} className={`px-8 pb-8 text-center ${colBorder(idx)}`}>
              {(itemsByVersion[q.id] || []).map((item, i) => (
                <div key={i} className="mt-4">
                  <p className="text-sm font-semibold text-stone-800 leading-snug">{item.name}</p>
                  {showPrices && <p className="text-[11px] text-stone-400 mt-1">{fmt(item.amount)}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const pssCat   = categoryData.find(c => c.catId === 'pss')
  const transCat = categoryData.find(c => c.catId === 'trans')
  const caCat    = categoryData.find(c => c.catId === 'ca')

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-4">

        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-800">Compare Versions</h2>
            <p className="text-xs text-stone-400 mt-0.5">Each column shows everything included in that version</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint} className="text-xs font-medium text-stone-500 hover:text-primary-700 border border-stone-200 hover:border-primary-300 px-3 py-1.5 rounded-lg transition-colors">
              Print / Save PDF
            </button>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
          </div>
        </div>

        {loading ? <p className="text-sm text-stone-400 p-8 text-center">Loading…</p> : (
          <>
            {/* Toolbar */}
            <div className="flex gap-2 px-6 py-3 border-b border-stone-100 flex-wrap items-center bg-stone-50/50">
              {quotes.map((q, i) => (
                <button key={q.id} onClick={() => toggle(q.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${selected.has(q.id) ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-stone-200 bg-white text-stone-400'}`}>
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
                    Casket images
                  </label>
                )}
              </div>
            </div>

            {shown.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-16">Select at least one version.</p>
            ) : (
              <div className="overflow-x-auto">
                <div style={{ minWidth: `${cols * 220}px` }}>

                  {/* Version headers — price + ticker */}
                  <div className="grid border-b border-stone-100" style={gridStyle}>
                    {shown.map((q, idx) => {
                      const ticker = [
                        q.discount_amount > 0 && `−${fmt(q.discount_amount)} discount`,
                        q.tax_amount > 0 && `+${fmt(q.tax_amount)} tax`,
                      ].filter(Boolean).join(' · ')
                      return (
                        <div key={q.id} className={`px-8 py-7 pb-8 text-center ${colBorder(idx)}`}>
                          <p className={`text-xl font-bold ${q.id === currentQuoteId ? 'text-primary-700' : 'text-stone-900'}`}>
                            {q.version_label || `V${quotes.indexOf(q) + 1}`}
                          </p>
                          {q.packages?.name && <p className="text-xs text-stone-400 mt-1.5">{q.packages.name}</p>}
                          {q.arrangement_type && <p className="text-[11px] text-stone-400 capitalize mt-0.5">{q.arrangement_type}</p>}
                          {STATUS_CLS[q.status] && (
                            <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CLS[q.status]}`}>{q.status}</span>
                          )}
                          <p className="text-3xl font-bold text-stone-900 mt-4 tracking-tight">{fmt(q.total)}</p>
                          {ticker && <p className="text-[10px] text-stone-400 mt-1.5">{ticker}</p>}
                        </div>
                      )
                    })}
                  </div>

                  {/* Professional Staff & Services */}
                  {pssCat && renderCatSection(pssCat)}

                  {/* Caskets */}
                  {hasCaskets && (
                    <div>
                      <div className="pt-8 pb-2 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Casket Selection</span>
                      </div>
                      <div className="grid" style={gridStyle}>
                        {shown.map((q, idx) => {
                          const entry = casketByQuote[q.id]; const csk = entry?.casket
                          return (
                            <div key={q.id} className={`px-8 pb-8 text-center ${colBorder(idx)}`}>
                              {entry ? (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  {showCasketImages && (
                                    csk?.imageUrl
                                      ? <img src={csk.imageUrl} alt={entry.name} className="max-w-[140px] w-full object-contain rounded-xl bg-stone-50 max-h-28" />
                                      : <div className="w-28 h-16 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-[10px]">No image</div>
                                  )}
                                  <p className="text-sm font-semibold text-stone-800">{entry.name}</p>
                                  {csk?.description && <p className="text-[10px] text-stone-400 leading-tight max-w-[180px]">{csk.description}</p>}
                                  {showPrices && <p className="text-[11px] text-stone-400">{fmt(entry.price)}</p>}
                                </div>
                              ) : <p className="text-xs text-stone-300 mt-4">Not selected</p>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Transportation */}
                  {transCat && renderCatSection(transCat)}

                  {/* Cash Advanced */}
                  {caCat && renderCatSection(caCat)}

                  <div className="pb-8" />

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
