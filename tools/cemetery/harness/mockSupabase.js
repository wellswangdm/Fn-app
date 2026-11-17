// Harness stand-in for src/lib/supabase.js: every cemetery query fails with the
// exact error Supabase returns when the schema isn't exposed, so the portal's
// setup screen can be checked through the real code path.
const err = { code: 'PGRST106', message: 'Invalid schema: cemetery' }
const thenable = { then: r => r({ data: null, error: err }) }
const chain = new Proxy(function () {}, {
  get: (_t, prop) => (prop === 'then' ? thenable.then : chain),
  apply: () => chain,
})
export const supabase = {
  schema: () => ({ from: () => chain }),
  from:   () => chain,
  auth:   { getSession: async () => ({ data: { session: null } }) },
}
