// ─────────────────────────────────────────────────────────────────────────────
// Default quote terms.
//
// The terms are the one piece of free text on a quote, so they can't simply
// follow the viewing language — an advisor who has typed their own wording
// must see exactly that, in whatever language they wrote it.
//
// So: if the saved terms are still one of the defaults (or empty), render the
// default for the language being viewed. If they have been edited, render what
// was written and leave it alone.
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_TERMS_EN = 'Prices are subject to change without further notice.'
export const DEFAULT_TERMS_ZH = '價格如有變更，恕不另行通知。'

const DEFAULTS = [DEFAULT_TERMS_EN, DEFAULT_TERMS_ZH]

export function isDefaultTerms(terms) {
  const t = String(terms || '').trim()
  return t === '' || DEFAULTS.includes(t)
}

/** The terms to display for the current viewing language. */
export function termsFor(terms, showChinese) {
  if (isDefaultTerms(terms)) {
    return showChinese ? DEFAULT_TERMS_ZH : DEFAULT_TERMS_EN
  }
  return terms
}
