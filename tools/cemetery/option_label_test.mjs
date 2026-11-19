// One rule for what an option is called:
//   the name you typed → else the property it is built around → "Option N"
// Run: node tools/cemetery/option_label_test.mjs
import { optionName, propertyNameOf } from '../../src/lib/cemeteryOptionLabel.js'

const prop = name => ({ section: 'Property', name })
const ecf  = name => ({ section: 'Property', name: `ECF - ${name}`, parentItemId: 'x' })
const fee  = ()   => ({ section: 'Merchandise and Services', name: 'Processing Fee' })

const fail = []
const eq = (what, got, want) => {
  if (got !== want) fail.push(`${what}\n      got  ${JSON.stringify(got)}\n      want ${JSON.stringify(want)}`)
}

// the property an option is built around, never its ECF child line
eq('property name', propertyNameOf([fee(), prop('Royal Jade Phase 2 (Estate)'),
                                   ecf('Royal Jade Phase 2 (Estate)')]),
   'Royal Jade Phase 2 (Estate)')
eq('no property yet', propertyNameOf([fee()]), '')

// the rule
eq('typed name wins',
   optionName({ versionLabel: "Mum's choice", propertyName: 'Royal Plateau', index: 0 }),
   "Mum's choice")
eq('otherwise the property',
   optionName({ propertyName: 'Royal Plateau (Upright)', index: 0 }), 'Royal Plateau (Upright)')
eq('otherwise the number',
   optionName({ index: 1 }), 'Option 2')
eq('a blank typed name is not a name',
   optionName({ versionLabel: '   ', propertyName: 'Royal Plateau', index: 0 }), 'Royal Plateau')
eq('a blank name and no property',
   optionName({ versionLabel: '  ', index: 2 }), 'Option 3')
eq('nothing at all', optionName(), 'Option 1')

console.log(fail.length
  ? `option names — FAIL (${fail.length}):\n  ${fail.join('\n  ')}`
  : 'option names: one rule, 8 cases — PASS')
process.exit(fail.length ? 1 : 0)
