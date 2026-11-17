// ─────────────────────────────────────────────────────────────────────────────
// Grouping quotes into families.
//
// A FAMILY is one contact_id and owns several OPTIONS of the same quote.
// Comparing happens inside a family — you compare the options built for those
// people, not every quote in the park.
//
// Its own module, with no imports, so it can be unit-tested without
// constructing a Supabase client.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param rows quote rows, newest-updated first
 * @returns [{ key, contactId, name, total, updatedAt, options[] }]
 */
export function groupIntoFamilies(rows = []) {
  const byKey = new Map()
  for (const r of rows) {
    // A quote saved before families existed has no contact_id; it stands
    // alone under its own id rather than being lumped in with others.
    const key = r.contact_id || r.id
    if (!byKey.has(key)) byKey.set(key, { key, contactId: r.contact_id, options: [] })
    byKey.get(key).options.push(r)
  }

  return [...byKey.values()].map(g => {
    g.options.sort((a, b) =>
      (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
      new Date(a.created_at) - new Date(b.created_at))
    g.name      = g.options.find(o => o.client_name)?.client_name || ''
    g.total     = g.options[0]?.grand_total ?? 0
    g.updatedAt = g.options.reduce(
      (m, o) => (o.updated_at > m ? o.updated_at : m), g.options[0]?.updated_at)
    return g
  }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}
