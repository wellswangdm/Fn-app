# Cemetery portal — blueprint

What is built, what is deliberately deferred, and what I still need from you.
Supersedes the open questions in `01-mvp-data-understanding.md` wherever they
have since been answered.

---

## Built and verified

| | |
|---|---|
| `supabase/cemetery_schema.sql` | 12 tables + 1 view in a `cemetery` schema |
| `supabase/cemetery_seed_6800.sql` | 50 properties, 43 services, 385 products |
| `src/lib/cemeteryTotals.js` | quote maths, proven equivalent to the old app |
| `src/lib/cemetery.js` | data access |
| `src/pages/Cemetery*` + `src/components/cemetery/*` | the portal |
| `tools/cemetery/` | seed generator, validator, equivalence test, render harness |

**What was checked, not assumed**

- Schema and seed run clean on Postgres 16 and are re-runnable.
- 435 seeded rows reconcile field-for-field with the source sheets, 0 errors.
- 25,000 fuzzed scenarios match a verbatim transcription of the old
  `App.tsx` algorithm — totals, per-line nets and payment plans.
- A 6-pick quote renders at \$72,528.75, matching a hand calculation.
- Comparison holds at 2/4/6 quotes and 128 rows, desktop and 390px phone.

---

## To run it

In the Supabase SQL editor, in this order:

1. `supabase/cemetery_schema.sql`
2. `supabase/cemetery_seed_6800.sql`

Then **Settings → API → Exposed schemas**, add `cemetery`. Without that last
step every cemetery query fails and the portal shows a setup notice explaining
it. Nothing here touches the funeral portal's tables.

---

## Deferred by design — HMIS advisor / customer split

You asked to keep this for the blueprint. The groundwork is in:

- `hmis_code` is on `properties`, `products` and `service_types`, and is
  carried onto `quote_items` as a snapshot, so a saved quote keeps the code
  that applied when it was quoted.
- The catalogue picker already shows HMIS, and the line table takes a
  `showHmis` prop (currently an editor toggle, default off).

What is **not** built, and what I would need from you first:

1. **Where the boundary sits.** My assumption: anything an advisor sees in the
   app shows HMIS; anything that leaves the building — the printed/PDF quote,
   an emailed copy, a shared link — does not. Confirm, because the alternative
   (a per-quote toggle) is a different design.
2. **Whether the contract needs more than the code** — quantities, a particular
   ordering, a grouping by vendor. If the goal is "build the contract more
   efficiently", the useful output may be a copyable advisor worksheet rather
   than the code printed on the quote.
3. **The gaps.** Not every row has an HMIS code today: `Markers-Flat` has two
   missing or mismatched (`56" x 16" Harmony`, and `24" x 30" Harmony` carries
   the 24x14 suffix), and the Baby Casket/Vault row has none. Codes are also
   **not unique** — they are price-band codes, so one code covers several
   products. Any contract workflow keyed on HMIS has to tolerate that.

---

## The other three parks

Nothing park-specific is hard-coded, so adding a park is data, not code:

```
0839  Boal Chapel & Memorial Gardens
0838  Ocean View Burial Park          ─┐ share one fee schedule
0836  Forest Lawn Memorial Park       ─┘
```

Per park you need: a `parks` row, its `properties` (sections and prices), and
`park_products` rows for whatever it sells. Ocean View and Forest Lawn point at
the **same** `fee_schedules` row, so their shared services and installation fees
are one set of numbers, edited once.

To add one, send me its price sheets in the same form as the first eleven and
I will generate the seed the same way, with the same validation.

---

## Price updates

Today: a generated, re-runnable SQL file per park, which you run in Supabase —
the same way the funeral portal works. Prices are not editable from the client
(RLS makes the catalogue read-only to the app).

You said updates need to be easy and usually per park. A per-park CSV upload
screen inside the portal is the natural next step, but it is a real piece of
work and I have not built it. Worth deciding before the other three parks land,
because it changes how you'll want their data delivered.

---

## Things I changed on purpose

Each of these is a deliberate departure from the old app. Say the word on any
of them and I will put it back.

1. **Inch marks are preserved.** The old CSV parser toggled on every `"` and
   dropped it, so `10" x 10"` rendered as `10 x 10`. Names now show correctly.
2. **The portrait setting fee has its own label.** The old config pointed the
   fee's name column at `Item Description`, so every portrait produced two
   lines with the same name at different prices. It is now "Portrait Setting
   Fee" / 相片安裝費 on the `portrait` category.
3. **No "ECF Included" badge on merchandise.** The old app set
   `isECFIncluded: true` on every merchandise sheet, which rendered an amber
   ECF badge on markers, urns and vases that have no ECF in their price. The
   badge is now shown only where it is true — on property priced with ECF
   included. The 90/10 maths was already correctly gated and is unchanged.
4. **Fee lines belong to their product.** Remove a marker and its granite base,
   installation and ECF go with it. They were independent lines before.
5. **Service families are real categories.** Interment, memorial installation,
   documents, disinterment, weekend/holiday surcharges and miscellaneous were
   one flat list of 43 under a `SERIES` column the app never used.
6. **`app_settings` is not migrated**, per your instruction.

**Not changed:** every price, every fee amount, and every calculation. The
eight rows whose components disagree with their sheet's own `TOTAL` column are
carried over exactly as they are — the old app never read those columns, so
"fixing" them would have changed what you charge.

---

## Still open

1. **The HMIS questions above.**
2. **Price-update workflow** — SQL files, or build the upload screen.
3. **Shared customers.** `cemetery.quotes.contact_id` exists but is not wired
   to anything. The funeral side has its own contact handling; joining them is
   its own piece of work.
4. **Images.** `products.image_url` is empty. The funeral portal shares casket
   photos across homes via `casket_catalog`; the same can be done here, and the
   urns cross-reference the funeral urn price list by page number, so those may
   be the same products with photos you already have.
5. **Rules the app still does not enforce** — marker type vs property, capacity
   vs interments, single/companion vs grave, weekday vs weekend interment. The
   columns are all seeded; nothing validates against them. Tell me which of
   these you actually want enforced rather than left to the advisor.
6. **The eight total-column discrepancies and the Vases duplicates** — still
   parked, still unjudged, listed in `01-mvp-data-understanding.md`.
