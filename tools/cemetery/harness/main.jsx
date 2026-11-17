// Dev-only harness: renders the real cemetery components against real seeded
// data so the layout can be checked without a Supabase backend.
// Not part of the app build. See tools/cemetery/harness/README.md
import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import CemeteryCatalog   from '../../../src/components/cemetery/CemeteryCatalog.jsx'
import CemeteryLineTable from '../../../src/components/cemetery/CemeteryLineTable.jsx'
import CemeteryReview    from '../../../src/components/cemetery/CemeteryReview.jsx'
import {
  calcCemeteryTotals, linesForProperty, linesForProduct, linesForService,
  customLine, processingFeeLine, removeLine, setQuantity, paymentPlanSummary, defaultDeposit,
} from '../../../src/lib/cemeteryTotals.js'
import { useChineseMode } from '../../../src/lib/useChineseMode.js'
import fixture from '../fixture.json'
import '../../../src/index.css'

const park = fixture.park

function App() {
  const [lines, setLines] = useState(() => [processingFeeLine()])
  const [zh, setZh] = useChineseMode()   // same shared preference the app uses
  const [review, setReview] = useState(false)
  const [pct, setPct] = useState(0)
  const [waive, setWaive] = useState(0)

  const totals = useMemo(() => calcCemeteryTotals(lines, {
    discountPercent: pct, manualWaiveAmount: waive,
    gstRate: Number(park.gst_rate), pstRate: Number(park.pst_rate),
  }), [lines, pct, waive])

  const netByLine = useMemo(() => {
    const m = {}; lines.forEach((l, i) => { m[l.id] = totals.lines[i]?.net }); return m
  }, [lines, totals])

  const quote = {
    clientName: 'Harness Preview', clientPhone: '604-555-0100',
    advisorName: 'Advisor Name', advisorEmail: 'advisor@example.com',
    discountPercent: pct, manualWaiveName: 'Miscellaneous Waived',
    gstRate: Number(park.gst_rate), pstRate: Number(park.pst_rate),
    terms: 'Prices are subject to change without further notice.',
    isMonthlyPaymentEnabled: true, depositAmount: defaultDeposit(totals.grandTotal),
    interestRate: 4.9, paymentMonths: 60,
  }
  const plan = paymentPlanSummary({ ...quote, grandTotal: totals.grandTotal })

  if (review) {
    return <CemeteryReview park={park} quote={quote} lines={lines} totals={totals}
                           plan={plan} onClose={() => setReview(false)} />
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-primary-800 text-white px-6 py-4 flex items-center gap-3">
        <h1 className="text-lg font-semibold">Cemetery harness — {park.id} {park.name}</h1>
        <div className="ml-auto flex gap-2">
          <button className="btn-secondary text-xs" onClick={() => setZh(v => !v)}>{zh ? 'English' : '中文'}</button>
          <button className="btn-secondary text-xs" onClick={() => setReview(true)}>Review</button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">
        <aside className="card p-4">
          <CemeteryCatalog
            properties={fixture.properties} products={fixture.products} services={fixture.services}
            showChinese={zh}
            onAddProperty={p => setLines(l => [...l, ...linesForProperty(p)])}
            onAddProduct={p  => setLines(l => [...l, ...linesForProduct(p)])}
            onAddService={s  => setLines(l => [...l, ...linesForService(s)])}
            onAddCustom={c   => setLines(l => [...l, customLine(c)])}
          />
        </aside>
        <div className="space-y-4">
          <div className="card p-4 flex gap-4 items-end">
            <div><label className="label">Discount %</label>
              <input className="input text-sm w-24" type="number" value={pct}
                     onChange={e => setPct(Number(e.target.value) || 0)} /></div>
            <div><label className="label">Dollar waive</label>
              <input className="input text-sm w-32" type="number" value={waive}
                     onChange={e => setWaive(Number(e.target.value) || 0)} /></div>
            <div className="ml-auto text-right">
              <p className="label">Grand total</p>
              <p className="text-xl font-bold text-primary-800">
                ${totals.grandTotal.toLocaleString('en-CA', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <CemeteryLineTable
            lines={lines} netByLine={netByLine} showChinese={zh} showHmis
            onRemove={id => setLines(l => removeLine(l, id))}
            onQuantity={(id, q) => setLines(l => setQuantity(l, id, q))}
            onToggle={(id, f) => setLines(l => l.map(x => x.id === id
              ? { ...x, [f]: f === 'isDiscountable' ? !x.isDiscountable : !x[f] } : x))}
            onMove={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
createRoot(document.getElementById('root')).render(<App />)
