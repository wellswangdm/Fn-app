// ─────────────────────────────────────────────────────────────────────────────
// Turns cemetery quote lines into comparison sections.
//
// Shared by the on-screen comparison, the print sheet and the shared link, so
// the three can't drift apart.
//
// Presentation decisions that matter:
//
//   * Fee lines (granite base, installation, ECF) are FOLDED into the product
//     that produced them by default, so a family sees "Marker — $16,705" and
//     not four lines ending in a $10 endowment fee. The grand total is
//     identical either way; `itemizeFees` shows them separately for an
//     advisor who wants the breakdown.
//
//   * Two sections only — Property, then Merchandise & Services. The same
//     split the line table and the review sheet use, so a quote reads the
//     same way wherever it is seen. The item name already says
//     "24\" x 14\" Marker no Vase (Expressions)"; the heading does not need
//     to repeat it.
// ─────────────────────────────────────────────────────────────────────────────

const PROPERTY = 'Property'

const BUCKET_META = {
  property:    { name: 'Property',                 nameZh: '墓地選擇', sort: 0 },
  merchandise: { name: 'Merchandise & Services',   nameZh: '服務及項目', sort: 1 },
}

/**
 * @param quotes    [{ id, items: [line], ... }]
 * @param productMeta { [productId]: { imageUrl, description } } — presentation
 *                    extras the quote line doesn't snapshot
 * @param opts      { itemizeFees }
 * @returns [{ id, name, nameZh, byQuote: { [quoteId]: [{ name, nameZh, amount, imageUrl, description }] } }]
 */
export function buildComparisonSections(quotes = [], productMeta = {}, { itemizeFees = false } = {}) {
  const products = productMeta || {}
  const sections = new Map()

  const sectionFor = id => {
    const meta = BUCKET_META[id] || BUCKET_META.merchandise
    if (!sections.has(id)) sections.set(id, { id, ...meta, byQuote: {} })
    return sections.get(id)
  }

  for (const q of quotes) {
    const lines = q.items || []

    // Roll child fee lines up to their parent unless itemising.
    const folded = new Map()
    if (!itemizeFees) {
      for (const l of lines) {
        if (!l.parentItemId) continue
        folded.set(l.parentItemId, (folded.get(l.parentItemId) || 0) + (l.isWaived ? 0 : l.lineTotal))
      }
    }

    for (const l of lines) {
      if (!itemizeFees && l.parentItemId) continue          // folded into its parent

      const sec = sectionFor(l.section === PROPERTY ? 'property' : 'merchandise')

      const meta = l.productId ? products[l.productId] : null
      const extra = folded.get(l.id) || 0

      ;(sec.byQuote[q.id] ||= []).push({
        name:        l.name,
        nameZh:      l.nameZh || l.name,
        amount:      (l.isWaived ? 0 : l.lineTotal) + extra,
        waived:      l.isWaived && extra === 0,
        quantity:    l.quantity,
        imageUrl:    meta?.imageUrl || null,
        description: meta?.description || null,
      })
    }
  }

  return [...sections.values()]
    .sort((a, b) => a.sort - b.sort)
    .filter(s => quotes.some(q => (s.byQuote[q.id] || []).length > 0))
}

/** True when any entry anywhere carries an image, so the layout can skip the slot. */
export function sectionsHaveImages(sections = []) {
  return sections.some(s =>
    Object.values(s.byQuote).some(entries => entries.some(e => e.imageUrl)))
}
