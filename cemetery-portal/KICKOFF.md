# Cemetery Portal — Kickoff Brief

> This file was created from the **funeral** session to hand off cleanly to the
> **cemetery** session. If you are the assistant reading this in a fresh session:
> **start with an audit + a written plan for the user's sign-off — do not make
> changes blindly.** Everything the user already decided is captured below.

## What we're building

A **cemetery quoting portal** added to this existing app (the funeral quote app),
as a **second portal** — not a separate repo or separate database.

The user has an **existing standalone cemetery app with its own code and database**.
That app is the **reference**: study its logic and data, then rebuild it as a
cemetery portal inside this unified project with a **properly redesigned schema**
and **reworked, more user-friendly quote layouts/designs**. Migrate the existing
cemetery data into the new tables.

## Decisions already locked in (do not re-litigate)

1. **Unified app + one Supabase project.** Cemetery shares the funeral app's
   backend so it can share login and customers.
2. **Shared, physically:** Supabase **Auth** (accounts), the **`profiles`** table
   (advisors), and **customer/contact records**. One advisor logs in once and sees
   both funeral and cemetery quotes; a customer entered on one side is reusable on
   the other. (User explicitly confirmed this = option #1.)
3. **Separate, logically:** cemetery gets its **own routes/folder**, its **own
   `cemetery_*` tables** (e.g. plots/lots/niches, interment rights, cemetery
   products & services, cemetery quotes + line items), and its **own quote
   layouts**. Funeral and cemetery must never read/write each other's domain tables.
4. **Design language:** doesn't matter to the user — reuse the funeral app's look or
   go fresh, whatever serves the cemetery quote UX best.
5. **Cemetery quote logic differs from funeral** — follow the existing cemetery
   app's logic, not the funeral package/à-la-carte model.

## Current funeral data model (facts the cemetery build needs)

- **Auth:** Supabase Auth via `supabase.auth` (see `src/App.jsx`, `src/lib/supabase.js`).
- **Advisors:** `profiles` table keyed by auth user id (`full_name, phone, advisor_email`).
- **Customers today are NOT a real table** — customer/purchaser/beneficiary details
  are stored **denormalized on `quotes`** (`customer_name/email/phone`, `deceased_name`,
  `purchaser_*`, `beneficiary_*`) plus a loose `quotes.contact_id uuid` with no FK.
- Funeral domain tables: `funeral_homes, service_categories, service_items,
  casket_catalog, funeral_home_caskets, packages, package_items, quotes, quote_items`
  (see `supabase/schema.sql`).

## The one shared-model change this unlocks

"Shared customer records" really means: **promote customers into a proper shared
table** (e.g. `customers`/`contacts`) that BOTH funeral quotes and cemetery quotes
reference by FK — instead of the current per-quote denormalized fields. Plan this as
part of the redesign (with a backfill/migration for existing funeral quotes so
nothing breaks). Do NOT silently rip out the funeral quote fields; migrate carefully.

## Working rules for this branch

- Branch: **`claude/cemetery-portal`** (this branch). Funeral pricing work continues
  independently on `claude/funeral-quote-app-pTPY7`.
- Keep cemetery code under its own folder (e.g. `src/cemetery/`) and routes; keep
  cemetery SQL under `supabase/cemetery/` (or clearly-prefixed files).
- Don't modify funeral domain tables/routes except the deliberate, planned
  shared-customer promotion above.
- The legacy cemetery app is dropped into `cemetery-portal/cemetery-legacy/` purely
  as reference — delete it once its logic and data have been ported.

## What the USER still needs to provide (in THIS cemetery session)

Drop these into `cemetery-portal/cemetery-legacy/`:

1. **Cemetery app code** → `cemetery-legacy/app/`
   - Easiest: paste the **public GitHub URL** and the assistant will `git clone` it in.
   - Or upload a zip / the source files, or paste them.
2. **Cemetery database** → `cemetery-legacy/db/`
   - Required: **schema** (all `CREATE TABLE` DDL).
   - Very helpful: a **data dump** (`pg_dump`/`mysqldump`, or Supabase export) so real
     cemetery inventory/quotes can be migrated.
3. **For the redesign:** screenshots of the current cemetery quote screens + a
   **sample generated cemetery quote (PDF)** so the new layouts match the existing
   logic while improving the presentation.

## First actions for the assistant in this session

1. Ingest `cemetery-legacy/` (code + DB).
2. Produce a written **audit**: what the current cemetery app does, its data model,
   its quote flow, and its pain points.
3. Propose the **redesigned schema** (shared customers + `cemetery_*` tables) and a
   **portal + quote-layout plan**.
4. Get the user's sign-off **before** writing app/DB changes.
