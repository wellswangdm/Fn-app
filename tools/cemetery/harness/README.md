# Cemetery render harness (development only)

Renders the real cemetery components against fixture data so layout and
behaviour can be checked without a Supabase backend. Not part of the app build.

    npx vite --config tools/cemetery/harness/vite.config.js

A Vite plugin swaps `src/lib/supabase.js` for one of the mocks below, chosen by
an environment variable, so the real pages run against controlled data:

| command | page | what it exercises |
|---|---|---|
| (none) | `/portal.html` | the unexposed-schema setup card |
| `HARNESS_ROWS=1` | `/list.html` | saved quotes grouped into families |
| `HARNESS_OLDDB=1` | `/list.html` | a database missing the version columns |
| `HARNESS_EDITOR=1` | `/qeditor.html` | option switcher, Add option, Template |
| `HARNESS_FUNERAL=1` | `/funeral.html` | the funeral comparison + summary |
| (none) | `/`, `/compare.html` | quote building and the comparison sheet |

`fixture.json` is real seeded data, exported from the 6800 seed.
