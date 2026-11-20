// One rule for what a funeral quote version is called, used by the list, the
// editor's switcher and all three spots in the comparison:
//   the name you typed → the package it is built on → "Version N" ("Quote" alone)
// Run: node tools/cemetery/version_label_test.mjs
import { versionName, versionNameOf } from '../../src/lib/versionLabel.js'

const fail = []
const eq = (what, got, want) => {
  if (got !== want) fail.push(`${what}\n      got  ${JSON.stringify(got)}\n      want ${JSON.stringify(want)}`)
}

// the rule
eq('typed name wins',
   versionName({ versionLabel: 'Cremation', packageName: 'Heritage Funeral Package', index: 1, count: 3 }),
   'Cremation')
eq('otherwise the package',
   versionName({ packageName: 'Heritage Funeral Package', index: 2, count: 3 }),
   'Heritage Funeral Package')
eq('otherwise the number',
   versionName({ index: 2, count: 3 }), 'Version 3')
eq('a lone version is just a quote',
   versionName({ index: 0, count: 1 }), 'Quote')
eq('a blank typed name is not a name',
   versionName({ versionLabel: '   ', packageName: 'Tribute Burial Package', index: 0, count: 2 }),
   'Tribute Burial Package')
eq('a blank package is not a name',
   versionName({ packageName: '  ', index: 1, count: 2 }), 'Version 2')
eq('nothing at all', versionName(), 'Version 1')

// applied to a row as PostgREST returns it
eq('row: typed name',
   versionNameOf({ version_label: 'Full service', packages: { name: 'X' } }, 0, 2), 'Full service')
eq('row: package',
   versionNameOf({ version_label: null, packages: { name: 'Honour Cremation Package' } }, 2, 3),
   'Honour Cremation Package')
eq('row: no package relation',
   versionNameOf({ version_label: null }, 1, 2), 'Version 2')
eq('row: lone quote', versionNameOf({ version_label: null }, 0, 1), 'Quote')
eq('row: nothing', versionNameOf(undefined, 0, 0), 'Version 1')

// the old `V${i+1}` spelling is gone everywhere
eq('never the old V-form', versionName({ index: 2, count: 4 }).startsWith('V '), false)

console.log(fail.length
  ? `version names — FAIL (${fail.length}):\n  ${fail.join('\n  ')}`
  : 'version names: one rule, 13 cases — PASS')
process.exit(fail.length ? 1 : 0)
