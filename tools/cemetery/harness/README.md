# Cemetery render harness (development only)

Renders the real cemetery components against real seeded data
(`tools/cemetery/fixture.json`, exported from the seed) so layout and the
quote maths can be checked without a Supabase backend.

    npx vite --config tools/cemetery/harness/vite.config.js

Not referenced by the app build.
