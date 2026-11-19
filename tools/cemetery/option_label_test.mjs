// One rule for what an option is called, used by all five screens that show it.
// Run: node tools/cemetery/option_label_test.mjs
import { autoLabel, optionLabel, propertyNameOf, fallbackLabel, looksAuto }
  from '../../src/lib/cemeteryOptionLabel.js'

const prop = name => ({ section: 'Property', name })
const ecf  = name => ({ section: 'Property', name: `ECF - ${name}`, parentItemId: 'x' })
const fee  = ()   => ({ section: 'Merchandise and Services', name: 'Processing Fee' })

const fail = []
const eq = (what, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) {
    fail.push(`${what}\n      got  ${JSON.stringify(got)}\n      want ${JSON.stringify(want)}`)
  }
}

// ── the property an option is built around ──────────────────────────────────
eq('property name, ignoring its ECF child line',
   propertyNameOf([fee(), prop('Royal Jade Phase 2 (Estate)'), ecf('Royal Jade Phase 2 (Estate)')]),
   'Royal Jade Phase 2 (Estate)')
eq('no property yet', propertyNameOf([fee()]), '')

// ── auto naming ─────────────────────────────────────────────────────────────
eq('auto name is the property', autoLabel([prop('Royal Plateau (Upright)')], 0, []), 'Royal Plateau (Upright)')
eq('auto name without a property', autoLabel([fee()], 1, []), 'Option 2')
eq('a blank option takes the property as soon as it has one',
   autoLabel([prop('Birch Estate Brick Niches')], 1, []), 'Birch Estate Brick Niches')
eq('two options on the same property do not end up identical',
   autoLabel([prop('Royal Plateau (Upright)')], 1, ['Royal Plateau (Upright)']),
   'Royal Plateau (Upright) (2)')
eq('and a third', autoLabel([prop('Royal Plateau (Upright)')], 2,
     ['Royal Plateau (Upright)', 'Royal Plateau (Upright) (2)']), 'Royal Plateau (Upright) (3)')

// ── what a saved row displays ───────────────────────────────────────────────
eq('stored name wins — never the client name',
   optionLabel({ version_label: 'Royal Jade Phase 2 (Estate)', client_name: 'Benny Kam' }, 0),
   'Royal Jade Phase 2 (Estate)')
eq('blank falls back to the number',
   optionLabel({ version_label: '   ', client_name: 'Benny Kam' }, 1), 'Option 2')
eq('missing row', optionLabel(undefined, 0), 'Option 1')
eq('fallback numbering', fallbackLabel(2), 'Option 3')

// ── is a stored name still auto, or did the advisor type it? ────────────────
eq('blank is auto',                   looksAuto('', [prop('Royal Plateau')]), true)
eq('"Option 2" is auto',              looksAuto('Option 2', []), true)
eq('"Option 2" is still auto once a property arrives',
   looksAuto('Option 2', [prop('Royal Plateau')]), true)
eq('matching the property is auto',   looksAuto('Royal Plateau', [prop('Royal Plateau')]), true)
eq('a collision suffix is auto',      looksAuto('Royal Plateau (2)', [prop('Royal Plateau')]), true)
eq('a typed name is not auto',        looksAuto("Mum's choice", [prop('Royal Plateau')]), false)
eq('a typed name with no property is not auto', looksAuto("Mum's choice", []), false)
eq('a property name containing regex characters is handled',
   looksAuto('Brookeside (Single, 18"x24")', [prop('Brookeside (Single, 18"x24")')]), true)

console.log(fail.length
  ? `option labels — FAIL (${fail.length}):\n  ${fail.join('\n  ')}`
  : 'option labels: one rule, 18 cases — PASS')
process.exit(fail.length ? 1 : 0)
