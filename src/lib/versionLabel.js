// ─────────────────────────────────────────────────────────────────────────────
// What a funeral quote version is called — in one place.
//
// The name was being derived in five places (the list, the editor's version
// switcher, and three spots in the comparison: its chips, its column headings
// and its printed/shared HTML), each with its own `version_label || \`V${i+1}\``.
// So an unnamed version could read "V3" on one screen and something else on
// the next, which is exactly the confusion flagged in the cemetery portal.
//
// The rule, matching cemeteryOptionLabel.js:
//   the name you typed  →  the main thing in the quote  →  a number
// where "the main thing" is the package here and the property there, and a
// lone option is just "Quote" rather than "Option 1".
//
// Both portals say "option" to the advisor. The identifiers here still say
// version because the database column is quotes.version_label — renaming them
// would mean renaming that, which is not worth a schema migration.
// ─────────────────────────────────────────────────────────────────────────────

export function versionName({ versionLabel, packageName, index = 0, count = 0 } = {}) {
  return (versionLabel || '').trim()
      || (packageName  || '').trim()
      || (count === 1 ? 'Quote' : `Option ${index + 1}`)
}

/**
 * The same rule applied to a quote row as PostgREST returns it.
 * `count` is how many options the contact has; pass the group's length.
 */
export function versionNameOf(quote, index = 0, count = 0) {
  return versionName({
    versionLabel: quote?.version_label,
    packageName:  quote?.packages?.name,
    index, count,
  })
}
