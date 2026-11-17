// Verifies we recognise "the cemetery schema isn't exposed" across the wordings
// PostgREST uses, and don't mistake ordinary errors for it.
// Run: node tools/cemetery/schema_error_test.mjs
import { isSchemaNotExposed } from '../../src/lib/cemeterySchemaError.js'

const SHOULD_MATCH = [
  { label: 'what the user actually saw', err: { message: 'Invalid schema: cemetery' } },
  { label: 'PGRST106 by code',           err: { code: 'PGRST106', message: 'The schema must be one of the following: public, graphql_public' } },
  { label: 'PGRST106 by message only',   err: { message: 'The schema must be one of the following: public' } },
  { label: 'schema not exposed',         err: { message: 'schema "cemetery" is not exposed via the API' } },
  { label: 'unknown schema',             err: { message: 'Unknown schema: cemetery' } },
  { label: 'missing from schema cache',  err: { message: "Could not find the table 'cemetery.parks' in the schema cache" } },
  { label: 'hint carries it',            err: { message: 'Bad Request', hint: 'Invalid schema: cemetery' } },
]

const SHOULD_NOT_MATCH = [
  { label: 'RLS denial',        err: { code: '42501', message: 'new row violates row-level security policy' } },
  { label: 'missing column',    err: { code: '42703', message: 'column parks.foo does not exist' } },
  { label: 'network failure',   err: { message: 'TypeError: Failed to fetch' } },
  { label: 'bad credentials',   err: { message: 'Invalid API key' } },
  { label: 'unique violation',  err: { code: '23505', message: 'duplicate key value violates unique constraint' } },
  { label: 'null error',        err: null },
  { label: 'empty object',      err: {} },
]

let fail = 0
for (const { label, err } of SHOULD_MATCH) {
  const got = isSchemaNotExposed(err)
  if (!got) { fail++; console.log(`  MISS  ${label}:`, JSON.stringify(err)) }
}
for (const { label, err } of SHOULD_NOT_MATCH) {
  const got = isSchemaNotExposed(err)
  if (got) { fail++; console.log(`  FALSE POSITIVE  ${label}:`, JSON.stringify(err)) }
}
console.log(`schema-error detection: ${SHOULD_MATCH.length} recognised, ${SHOULD_NOT_MATCH.length} correctly ignored, ${fail} failures`)
process.exit(fail === 0 ? 0 : 1)
