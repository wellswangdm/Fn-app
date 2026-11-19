// ─────────────────────────────────────────────────────────────────────────────
// What an option is called. One rule, no modes:
//
//     the name you typed  →  else the property it is built around  →  "Option N"
//
// Nothing is auto-filled, nothing is inferred, and the name is not copied into
// the quote when it is saved. `version_label` holds only a name somebody
// actually typed, so there is never a stored name quietly disagreeing with the
// property it was derived from.
//
// Screens that have the line items work the property out from them; the saved
// list asks for the property names it needs in one query.
// ─────────────────────────────────────────────────────────────────────────────

const PROPERTY = 'Property'

/** The property an option is built around, if it has one yet. */
export function propertyNameOf(lines = []) {
  const p = lines.find(l => l.section === PROPERTY && !l.parentItemId)
  return (p?.name || '').trim()
}

/** @param {{ versionLabel?, propertyName?, index? }} */
export function optionName({ versionLabel, propertyName, index = 0 } = {}) {
  return (versionLabel || '').trim()
      || (propertyName || '').trim()
      || `Option ${index + 1}`
}
