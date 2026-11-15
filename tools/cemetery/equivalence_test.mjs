// Proves src/lib/cemeteryTotals.js reproduces the OLD cemetery app's maths.
//
// `oldApp()` below is a VERBATIM transcription of App.tsx:394-494 from
// wellswangdm/google_cem_app @ 8a8356e — same variable names, same order,
// same Math.min/Math.max placement. It is the reference, not a reimplementation.
//
// Run: node tools/cemetery/equivalence_test.mjs
import { calcCemeteryTotals, defaultDeposit, monthlyPayment } from '../../src/lib/cemeteryTotals.js'

const FIXED_PST = 0.07

function oldApp(items, discountPercent, manualDiscountAmount, gstRate) {
  const rawSubtotal      = items.reduce((sum, item) => sum + item.total, 0)
  const waivedItemsTotal = items.filter(i => i.isWaived).reduce((sum, i) => sum + i.total, 0)
  const manualDiscountInput = manualDiscountAmount || 0
  const effectiveWaiveTotal = waivedItemsTotal > 0 ? waivedItemsTotal : manualDiscountInput
  const percMult = 1 - (discountPercent / 100)
  let unallocatedWaive = effectiveWaiveTotal

  const itemPrep = items.map(i => {
    let discountableRatio = 0
    if (i.isDiscountable) {
      if (i.section === 'Property' && i.isECFIncluded) discountableRatio = 0.9
      else discountableRatio = 1.0
    }
    const grossDiscountable    = i.total * discountableRatio
    const grossNonDiscountable = i.total * (1 - discountableRatio)
    let waivedDiscountable = 0, waivedNonDiscountable = 0
    if (i.isWaived) {
      waivedDiscountable    = grossDiscountable
      waivedNonDiscountable = grossNonDiscountable
    } else if (waivedItemsTotal === 0 && unallocatedWaive > 0) {
      waivedDiscountable = Math.min(grossDiscountable, unallocatedWaive)
      unallocatedWaive  -= waivedDiscountable
    }
    return { item: i, grossDiscountable, grossNonDiscountable, waivedDiscountable, waivedNonDiscountable }
  })

  const itemCalc = itemPrep.map(prep => {
    let waivedNonDisc = prep.waivedNonDiscountable
    if (!prep.item.isWaived && waivedItemsTotal === 0 && unallocatedWaive > 0) {
      const addWaive = Math.min(prep.grossNonDiscountable, unallocatedWaive)
      waivedNonDisc    += addWaive
      unallocatedWaive -= addWaive
    }
    const remainingDiscountable    = Math.max(0, prep.grossDiscountable - prep.waivedDiscountable)
    const remainingNonDiscountable = Math.max(0, prep.grossNonDiscountable - waivedNonDisc)
    const netAfterDisc = prep.item.isWaived ? 0 : (remainingDiscountable * percMult) + remainingNonDiscountable
    return { ...prep, netAfterDisc }
  })

  const totalNetSubtotal = itemCalc.reduce((s, c) => s + c.netAfterDisc, 0)
  const gstTotal = itemCalc.filter(c => c.item.isGSTApplicable)
                           .reduce((s, c) => s + (c.netAfterDisc * gstRate), 0)
  const pstTotal = itemCalc.filter(c => c.item.isPSTApplicable)
                           .reduce((s, c) => s + (c.netAfterDisc * FIXED_PST), 0)
  const grandTotal = Math.round((totalNetSubtotal + gstTotal + pstTotal) * 100) / 100
  return { rawSubtotal, gstTotal, pstTotal, grandTotal, nets: itemCalc.map(c => c.netAfterDisc) }
}

// deterministic PRNG so failures are reproducible
let s = 123456789
const rnd  = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
const pick = a => a[Math.floor(rnd() * a.length)]

const r2 = n => Math.round(n * 100) / 100
let runs = 0, fails = 0
const failures = []

for (let t = 0; t < 20000; t++) {
  const n = 1 + Math.floor(rnd() * 9)
  const old = [], neu = []
  for (let k = 0; k < n; k++) {
    const total   = pick([0, 10, 195, 550, 1050, 2695, 14650, 24995, 34995, 208000]) * (1 + Math.floor(rnd() * 3))
    const section = rnd() < 0.35 ? 'Property' : 'Merchandise and Services'
    const flags = {
      isDiscountable: rnd() < 0.7,
      isWaived:       rnd() < 0.15,
      ecf:            rnd() < 0.5,
      gst:            rnd() < 0.9,
      pst:            rnd() < 0.25,
    }
    old.push({ total, section, isDiscountable: flags.isDiscountable, isWaived: flags.isWaived,
               isECFIncluded: flags.ecf, isGSTApplicable: flags.gst, isPSTApplicable: flags.pst })
    neu.push({ lineTotal: total, section, isDiscountable: flags.isDiscountable, isWaived: flags.isWaived,
               ecfIncluded: flags.ecf, isGst: flags.gst, isPst: flags.pst })
  }
  const discountPercent = pick([0, 0, 5, 7.5, 10, 15, 100])
  const manualWaive     = pick([0, 0, 0, 100, 1050, 5000, 999999])
  const gstRate         = 0.05

  const a = oldApp(old, discountPercent, manualWaive, gstRate)
  const b = calcCemeteryTotals(neu, { discountPercent, manualWaiveAmount: manualWaive, gstRate, pstRate: FIXED_PST })

  runs++
  const checks = [
    ['subtotal',   r2(a.rawSubtotal), b.subtotal],
    ['gstTotal',   r2(a.gstTotal),    b.gstTotal],
    ['pstTotal',   r2(a.pstTotal),    b.pstTotal],
    ['grandTotal', a.grandTotal,      b.grandTotal],
    ...a.nets.map((v, i) => [`net[${i}]`, r2(v), b.lines[i].net]),
  ]
  for (const [label, want, got] of checks) {
    if (Math.abs(want - got) > 0.005) {
      fails++
      if (failures.length < 5) failures.push({ t, label, want, got, discountPercent, manualWaive, items: old })
      break
    }
  }
}

console.log(`equivalence vs old App.tsx:  ${runs - fails}/${runs} scenarios identical`)
if (failures.length) {
  console.log('\nFAILURES:')
  for (const f of failures) console.log(JSON.stringify(f, null, 2))
}

// ── payment plan, against the old app's formula ─────────────────────────────
let pf = 0, pr = 0
for (let t = 0; t < 5000; t++) {
  const grandTotal = r2(rnd() * 250000)
  const manual     = rnd() < 0.5
  const months     = pick([12, 24, 36, 60, 72, 84, 120])
  const rate       = pick([0, 0, 4.9, 6.5, 9.99])

  const minDeposit      = grandTotal * 0.1
  const oldDefault      = Math.ceil(minDeposit / 100) * 100
  const deposit         = manual ? r2(grandTotal * 0.25) : oldDefault
  const financeAmount   = Math.max(0, grandTotal - deposit)
  let oldMonthly = 0
  if (months > 0) {
    if (rate > 0) { const r = rate / 100 / 12
      oldMonthly = (financeAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
    } else oldMonthly = financeAmount / months
  }
  pr++
  const okDep = manual || defaultDeposit(grandTotal) === oldDefault
  const mine  = monthlyPayment({ grandTotal, depositAmount: deposit, interestRate: rate, paymentMonths: months })
  if (!okDep || Math.abs(r2(oldMonthly) - mine) > 0.005) { pf++; if (pf <= 3) console.log('  payment mismatch', { grandTotal, deposit, months, rate, oldMonthly: r2(oldMonthly), mine }) }
}
console.log(`payment plan:                ${pr - pf}/${pr} scenarios identical`)

process.exit(fails + pf === 0 ? 0 : 1)
