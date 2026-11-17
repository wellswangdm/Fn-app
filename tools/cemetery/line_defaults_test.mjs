// Asserts the quote-line defaults across the WHOLE seeded catalogue:
//   * the only non-discountable lines are endowment care (ECF)
//   * installation and granite base are discountable
//   * urns default to GST + PST; nothing else carries PST
// Run: node tools/cemetery/line_defaults_test.mjs
import fs from 'node:fs'
import { linesForProduct, linesForProperty, linesForService } from '../../src/lib/cemeteryTotals.js'

const fx = JSON.parse(fs.readFileSync(new URL('./fixture.json', import.meta.url)))
const fail = []
const seen = { kinds: new Set(), nonDisc: new Set(), pstCats: new Set() }

for (const p of fx.products) {
  for (const l of linesForProduct(p)) {
    seen.kinds.add(l.sourceKind)
    if (!l.isDiscountable) seen.nonDisc.add(`${l.sourceKind}:${l.name}`)
    if (l.isPst) seen.pstCats.add(p.categoryId)

    // discountability
    if (l.sourceKind === 'fee_ecf' && l.isDiscountable)
      fail.push(`ECF should NOT be discountable: ${p.id} "${l.name}"`)
    if (l.sourceKind === 'fee_install' && !l.isDiscountable)
      fail.push(`installation SHOULD be discountable: ${p.id} "${l.name}"`)
    if (l.sourceKind === 'fee_base' && !l.isDiscountable)
      fail.push(`granite base SHOULD be discountable: ${p.id} "${l.name}"`)
    if (l.sourceKind === 'product' && !l.isDiscountable)
      fail.push(`product SHOULD be discountable: ${p.id} "${l.name}"`)

    // tax
    if (l.sourceKind === 'product') {
      const wantPst = p.categoryId === 'urn'
      if (!!l.isPst !== wantPst)
        fail.push(`${p.categoryId} "${l.name}" isPst=${l.isPst}, expected ${wantPst}`)
      if (!l.isGst) fail.push(`${p.id} "${l.name}" lost GST`)
    }
  }
}

for (const prop of fx.properties) {
  for (const l of linesForProperty(prop)) {
    if (l.sourceKind === 'fee_ecf' && l.isDiscountable)
      fail.push(`property ECF should NOT be discountable: ${prop.id}`)
    if (l.sourceKind === 'property' && !l.isDiscountable)
      fail.push(`property SHOULD be discountable: ${prop.id}`)
  }
}
for (const s of fx.services) {
  for (const l of linesForService(s)) {
    if (!l.isDiscountable) fail.push(`service SHOULD be discountable: "${l.name}"`)
  }
}

const nonDiscKinds = [...new Set([...seen.nonDisc].map(s => s.split(':')[0]))]
console.log('line kinds produced      :', [...seen.kinds].sort().join(', '))
console.log('non-discountable kinds   :', nonDiscKinds.join(', ') || '(none)')
console.log('distinct non-disc labels :', [...new Set([...seen.nonDisc].map(s => s.split(':')[1]))].join(', '))
console.log('categories defaulting PST:', [...seen.pstCats].join(', ') || '(none)')
console.log(fail.length === 0
  ? `\nPASS — ${fx.products.length} products, ${fx.properties.length} properties, ${fx.services.length} services checked`
  : `\nFAIL (${fail.length}):\n  ` + fail.slice(0, 15).join('\n  '))
process.exit(fail.length ? 1 : 0)
