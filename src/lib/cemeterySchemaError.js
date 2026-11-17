// ─────────────────────────────────────────────────────────────────────────────
// Detecting "the cemetery schema isn't exposed to the API".
//
// Its own module, with no imports, so it can be unit-tested without
// constructing a Supabase client.
//
// This matters more than it looks: creating the schema in SQL and exposing it
// to the REST API are two separate steps, and almost everyone does the first
// and not the second. If we fail to recognise the error the user gets a
// generic "no data" screen instead of the one-line fix.
//
// PostgREST words it differently across versions, hence the spread of
// patterns below. Samples seen in the wild:
//   { code: 'PGRST106', message: 'The schema must be one of the following: public' }
//   { message: 'Invalid schema: cemetery' }
// ─────────────────────────────────────────────────────────────────────────────

export class CemeterySchemaError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CemeterySchemaError'
  }
}

const PATTERNS = [
  /invalid schema/i,
  /schema must be one of/i,
  /not exposed/i,
  /unknown schema/i,
  /schema ["']?cemetery["']? does not exist/i,
  // PGRST205: the table isn't in PostgREST's cache, which is what an
  // unexposed schema looks like from the client side
  /could not find .*in the schema cache/i,
]

export function isSchemaNotExposed(error) {
  if (!error) return false
  if (error.code === 'PGRST106') return true
  const text = [error.message, error.hint, error.details, error.error]
    .filter(Boolean).map(String).join(' ')
  return PATTERNS.some(p => p.test(text))
}
