// Harness: renders the customer-facing comparison sheet with realistic quotes.
// ?n=3&zh=1&itemize=1
import React from 'react'
import { createRoot } from 'react-dom/client'
import CemeteryCompareSheet from '../../../src/components/cemetery/CemeteryCompareSheet.jsx'
import { buildComparisonSections } from '../../../src/lib/cemeteryCompare.js'
import {
  calcCemeteryTotals, linesForProperty, linesForProduct, linesForService,
  processingFeeLine, paymentPlanSummary, defaultDeposit,
} from '../../../src/lib/cemeteryTotals.js'
import fixture from '../fixture.json'
import '../../../src/index.css'

const qs = new URLSearchParams(location.search)
const N       = Number(qs.get('n') || 3)
const zh      = qs.get('zh') === '1'
const itemize = qs.get('itemize') === '1'

const find = (list, pred) => list.find(pred)
const prop  = i => fixture.properties[i]
const byCat = (cat, i) => fixture.products.filter(p => p.categoryId === cat)[i]
const svc   = n => find(fixture.services, s => s.name === n) || fixture.services[0]

// Three realistic options a family would actually be shown
const RECIPES = [
  { label: 'Sarah Chen',  propIdx: 0, marker: ['marker_flat', 9],    urn: null, vase: 0,  svc: 'Signature Ground Interment', months: 60 },
  { label: 'Chen Family', propIdx: 1, marker: ['marker_upright', 0], urn: null, vase: 1,  svc: 'Standard Ground Interment',  months: 84 },
  { label: 'Memorial',    propIdx: 9, marker: ['marker_plate', 0],   urn: 0,    vase: null, svc: 'Basic Niche Inurnment',    months: 0 },
  { label: 'Option 4',    propIdx: 12, marker: ['marker_pillow', 2], urn: 3,   vase: null, svc: 'Double Inurnment',          months: 36 },
]

const quotes = RECIPES.slice(0, N).map((r, i) => {
  const items = [processingFeeLine()]
  items.push(...linesForProperty(prop(r.propIdx)))
  if (r.marker) items.push(...linesForProduct(byCat(r.marker[0], r.marker[1])))
  if (r.vase  != null) items.push(...linesForProduct(byCat('vase', r.vase)))
  if (r.urn   != null) items.push(...linesForProduct(byCat('urn', r.urn)))
  items.push(...linesForService(svc(r.svc)))
  const discountPercent = [0, 5, 0, 10][i]
  const manualWaive = i === 2 ? 1295 : 0
  const totals = calcCemeteryTotals(items, { discountPercent, manualWaiveAmount: manualWaive, gstRate: 0.05, pstRate: 0.07 })
  const q = {
    id: `q${i}`, label: r.label, parkName: fixture.park.name,
    discountPercent, manualWaiveName: 'Courtesy waived', gstRate: 0.05, pstRate: 0.07,
    interestRate: r.months ? 4.9 : 0,
    isMonthlyPaymentEnabled: r.months > 0,
    depositAmount: defaultDeposit(totals.grandTotal), paymentMonths: r.months || 60,
    items, totals,
  }
  return { ...q, plan: paymentPlanSummary({ ...q, grandTotal: totals.grandTotal }) }
})

// Product presentation extras, as fetchProductMeta() returns them
const productMeta = {}
for (const p of fixture.products) {
  productMeta[p.id] = { imageUrl: p.image_url || null, description: null }
}

const sections = buildComparisonSections(quotes, productMeta, { itemizeFees: itemize })

createRoot(document.getElementById('root')).render(
  <div className="min-h-screen bg-black/60 p-4 flex items-start justify-center">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl">
      <div className="px-6 py-4 border-b border-stone-100">
        <h2 className="text-sm font-bold text-stone-800">Compare Options</h2>
        <p className="text-xs text-stone-400 mt-0.5">Each column shows everything included in that option</p>
      </div>
      <CemeteryCompareSheet quotes={quotes} sections={sections}
        showPrices showImages={false} showTicker showPayment zh={zh} />
    </div>
  </div>
)
