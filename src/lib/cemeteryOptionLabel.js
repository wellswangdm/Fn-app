// ─────────────────────────────────────────────────────────────────────────────
// What an option is called.
//
// The same option is shown in five places — the saved list, the option
// switcher in the builder, the Option name field, and the comparison's chips
// and column headings. They each used to work out a name for themselves, so
// one option could read "Benny Kam" in the list, "Option 1" in the switcher
// and "Royal Jade Phase 2 (Estate)" in the comparison.
//
// Now there is one rule, used everywhere:
//
//   whatever is stored on the quote  →  else the property on it  →  else "Option N"
//
// and the resolved name is STORED when the quote is saved, so a reader that
// has no line items (the list) agrees with one that does (the builder).
//
// Its own module, with no imports, so it can be unit-tested without
// constructing a Supabase client.
// ─────────────────────────────────────────────────────────────────────────────

const PROPERTY = 'Property'

export const fallbackLabel = index => `Option ${index + 1}`

/** The property this option is built around, if it has one yet. */
export function propertyNameOf(lines = []) {
  const p = lines.find(l => l.section === PROPERTY && !l.parentItemId)
  return (p?.name || '').trim()
}

/**
 * The name to auto-assign when the advisor has not typed one: the property,
 * or "Option N" until there is a property. `taken` are the other options'
 * names, so two options built on the same property don't end up identical.
 */
export function autoLabel(lines, index, taken = []) {
  const base = propertyNameOf(lines) || fallbackLabel(index)
  if (!taken.includes(base)) return base
  for (let n = 2; n < 50; n++) {
    const candidate = `${base} (${n})`
    if (!taken.includes(candidate)) return candidate
  }
  return `${base} (${index + 1})`
}

/**
 * Whether a stored name still looks auto-assigned rather than typed by the
 * advisor. A blank option is saved as "Option 2" before it has a property;
 * without this it would keep that name forever instead of taking the
 * property's once one is added.
 */
export function looksAuto(label, lines = []) {
  const t = (label || '').trim()
  if (!t) return true
  if (/^Option \d+$/.test(t)) return true
  const prop = propertyNameOf(lines)
  if (!prop) return false
  return t === prop || new RegExp(`^${prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\(\\d+\\)$`).test(t)
}

/**
 * What to display for a saved option row. Readers without line items use
 * this; it relies on the label having been resolved at save time.
 */
export function optionLabel(row, index = 0) {
  return (row?.version_label || '').trim() || fallbackLabel(index)
}
