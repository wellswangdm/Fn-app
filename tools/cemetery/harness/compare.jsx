// Harness: renders CemeteryCompareTable with N generated quotes to prove the
// layout holds as quote count and item count grow. ?n=6&items=24
import React from 'react'
import { createRoot } from 'react-dom/client'
import CemeteryCompareTable from '../../../src/components/cemetery/CemeteryCompareTable.jsx'
import {
  calcCemeteryTotals, linesForProperty, linesForProduct, linesForService,
  processingFeeLine, paymentPlanSummary,
} from '../../../src/lib/cemeteryTotals.js'
import fixture from '../fixture.json'
import '../../../src/index.css'

const qs = new URLSearchParams(location.search)
const N     = Number(qs.get('n') || 4)
const ITEMS = Number(qs.get('items') || 12)

// deterministic pick so screenshots are stable
let s = 42
const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff

const quotes = Array.from({ length: N }, (_, qi) => {
  const items = [processingFeeLine()]
  // every quote shares a couple of lines, then diverges — so differences show
  items.push(...linesForProperty(fixture.properties[qi % 3]))
  items.push(...linesForService(fixture.services[0]))
  for (let k = 0; k < ITEMS; k++) {
    const idx = Math.floor(rnd() * fixture.products.length)
    items.push(...linesForProduct(fixture.products[(idx + qi * 3) % fixture.products.length]))
  }
  if (qi % 2 === 1) items[1].isWaived = true
  const discountPercent = [0, 5, 10, 7.5, 0, 12][qi % 6]
  const totals = calcCemeteryTotals(items, { discountPercent, manualWaiveAmount: 0, gstRate: 0.05, pstRate: 0.07 })
  const q = {
    id: `q${qi}`, clientName: `Option ${qi + 1}`, discountPercent,
    isMonthlyPaymentEnabled: qi % 2 === 0, depositAmount: 5000, interestRate: 4.9, paymentMonths: 60,
    gstRate: 0.05, pstRate: 0.07, items, totals,
  }
  return { ...q, plan: paymentPlanSummary({ ...q, grandTotal: totals.grandTotal }) }
})

createRoot(document.getElementById('root')).render(
  <div className="min-h-screen bg-stone-50 p-6">
    <h1 className="text-sm font-semibold text-stone-600 mb-3">
      Comparison harness — {N} quotes, ~{ITEMS} products each ({quotes[0].items.length} lines in option 1)
    </h1>
    <CemeteryCompareTable quotes={quotes} zh={false} onlyDiffs={qs.get('diffs') === '1'} />
  </div>
)
