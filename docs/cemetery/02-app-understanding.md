# Cemetery app — what the code actually does

Source: `wellswangdm/google_cem_app` @ `8a8356e`, read 2026-11-14.
3,730 lines: `App.tsx` 2,506 · `QuoteTable.tsx` 293 · `databaseService.ts` 225 ·
`Sidebar.tsx` 212 · `sheetService.ts` 144 · `types.ts` 114 · `geminiService.ts` 69.

This supersedes `01-mvp-data-understanding.md` wherever the two disagree. Corrections to
that first read are marked **[WAS WRONG]**.

---

## 1. The single most important fact

**There is no cemetery logic in this app.** It is a generic
*CSV-sheet → configurable column mapping → quote line items* engine. The words marker,
niche, interment, grave and park appear nowhere in the logic. Nothing knows that a niche
takes a niche plate, that a companion marker needs a companion grave, or that a space has
a capacity.

Every rule I inferred in the first pass as domain logic is actually **per-sheet
configuration**, set by hand in the app's "Sheets" screen and saved to a third Supabase
table I did not have.

### The missing table: `app_settings`

```
app_settings(id = 'global_config', config_data jsonb, last_updated)
```

`config_data` holds:

```js
{
  businessProfile: { name, address, email, phone },
  workspaceConfig: [            // one entry per pricing_sheets row
    { id, name,
      descriptionColumn,        // which column is the English name
      chineseDescriptionColumn, // which column is the Chinese name
      priceColumn,              // which column is the unit price
      subcategoryColumn,        // which column drives the category filter
      ecfPriceColumn,           // Property only
      isECFIncluded,            // Property only
      extraMappings: [ { name, chineseColumn, column } ]   // auto-applied fees
    }, …
  ]
}
```

**`workspaceConfig` is the rule set.** Without it I cannot say what any sheet's price
column is. It is the one piece of data still outstanding.

---

## 2. How a quote line gets built (`addItemToQuote`, App.tsx:643)

Picking a catalogue item appends **one to three kinds of line**:

1. **The item itself** — `unitPrice` = the value in the mapped `priceColumn`.
   Defaults: `isGSTApplicable: true`, `isPSTApplicable: false`,
   `isDiscountable: true` *unless* the name contains "processing fee",
   `isECFIncluded` inherited from the sheet's config.

2. **An ECF line** — only when `section === 'Property'` **and** `isECFIncluded === false`
   **and** the mapped `ecfPriceColumn` value is > 0.
   Named `ECF - <name>` / `管理基金 - <name>`. **Hard-coded `isDiscountable: false`.**

3. **One line per `extraMappings` rule** whose mapped price column is > 0.
   **Hard-coded `isDiscountable: false`.**

### The extra-fee mechanism, exactly (`sheetService.ts:60-78`)

```js
const dynamicName    = entry[m.name] || m.name;
const dynamicChinese = entry[m.chineseColumn] || dynamicName;
if (p > 0) extraPriceResults.push({ name, chineseName, price: p });
```

`m.name` is **itself a column name**, not a literal. The label is read out of the row.
That is why every marker sheet carries `INSTALL-NAME`, `INSTALL-CHI`, `ECF NAME`,
`ECF-CHI`, `BASE-NAME`, `BASE-CHI` — they exist to be pulled as the fee's display name.
The mapping UI labels the three dropdowns "Fee Name Col", "ZH Name Col", "Price Col"
(App.tsx:1807-1816), so this is deliberate and the sheets were built for it.

**`if (p > 0)` is the switch for "no fee here".**
A zero or blank fee column emits no line. So:
- `2nd Scroll Plate` rows with `ECF = 0` → no ECF line. **Intentional.**
- `Adore Celestial Vase Plain 3"` with `INSTALL = 0` → no install line. **Intentional.**

**[WAS WRONG]** I flagged both as data questions (old D9). They are the mechanism working
as designed.

---

## 3. ECF has two supported modes — not an inconsistency

**[WAS WRONG]** My first read called the Property sheets inconsistent because LawnCrypts
splits `BASE PRICE` + `ECF PRICE` while CremationSpaces gives one `Price (w/ ECF)`. They
are the app's **two ECF modes**, chosen per sheet by one checkbox labelled
*"ECF included (90/10 rule)"* (App.tsx:1792):

| `isECFIncluded` | sheet | behaviour |
|---|---|---|
| `false` | LawnCrypts (has `ECF PRICE`) | ECF becomes its own non-discountable line |
| `true` | CremationSpaces (`Price (w/ ECF)`) | ECF is inside the price; **only 90% of the line is discountable** |

The 90/10 rule, App.tsx:410 and 101:

```js
discountableRatio = (i.section === 'Property' && i.isECFIncluded) ? 0.9 : 1.0;
```

So a $24,995 niche with ECF included exposes $22,495.50 to the percentage discount and
shields $2,499.50. A flat 10% assumption, applied only to Property lines.

Note the ECF controls render **only for `section === 'Property'`**, and the extra-fee
controls **only for Merchandise and Services** (App.tsx:1790). So the markers' $10 ECF
cannot use the ECF mechanism — it must be configured as an `extraMappings` rule, which is
exactly what `ECF NAME` / `ECF-CHI` are there for.

---

## 4. Tax: decided per quote by the advisor, never stored

**[WAS WRONG]** My Q7 asked which categories are taxable. The app has no answer because
it stores none.

- Every line is created `isGSTApplicable: true`, `isPSTApplicable: false`.
- The advisor then ticks GST / PST per line in the quote table (`QuoteTable.tsx:241-242`,
  and as chips on mobile).
- `DEFAULT_GST = 0.05`, editable per quote. `FIXED_PST = 0.07`.
- The PST calculation uses the `FIXED_PST` **constant**, not `currentQuote.pstRate`
  (App.tsx:472), so the stored `pstRate` on a quote has no effect on its maths.

So taxability is a per-line human decision every time, not a property of the product.

---

## 5. Discount, waive, and the two-pass allocation

Three separate levers, and they interact:

- **`discountPercent`** — a percentage, applied only to the *discountable portion* of each
  line (×1.0 normally, ×0.9 for ECF-included Property lines).
- **`isWaived`** per line — the line contributes 0 and renders struck through as
  `WAIVED` / `已減免`.
- **`manualDiscountAmount`** — a global dollar waive, default name "Miscellaneous Waived".

The allocation (App.tsx:394-474) is genuinely non-trivial, and worth preserving exactly:

1. If **any** line is explicitly waived, `manualDiscountAmount` is ignored
   (`effectiveWaiveTotal = waivedItemsTotal > 0 ? waivedItemsTotal : manualDiscountInput`),
   and the quote's `manualDiscountAmount` is then *overwritten* with the waived sum so the
   figure displayed stays in sync.
2. Otherwise the dollar waive is consumed **against discountable portions first**, line by
   line in order, then in a second pass against non-discountable portions.
3. The percentage discount applies to whatever discountable amount survives.
4. GST and PST are charged on the **post-discount** net of each line.

Order matters: the waive is allocated in line order, so reordering lines can change the
split between discountable and non-discountable absorption.

---

## 6. What the app never reads

This is the biggest correction. These columns are **reference material for whoever reads
the spreadsheet**, not app inputs:

`FLAT MARKER CODES` · `Interment Rights` · `Marker Type` · `Category`
(Full Burial / Cremation Only) · `Type` / `Type-CHI` · `Spaces` · `Sections` ·
`DIMENSIONS (OD)` · `Tablet Dimensions` · `Base Size` · `Sizes` · `Color` ·
`Model` · `Funeral Urn Price Page #` · `W/ Vase` · the stray `TOTAL` column in LawnCrypts

Partial exceptions, both inert:
- `MARKER SIZE` and `VASE` are copied into `item.metadata` (`sheetService.ts:114-119`).
  **`metadata` is never read by any logic** — not for filtering, pricing or validation.
- `description` is built as `` `${subcat} ${entry['MARKER SIZE']}` `` and shown in the
  picker.
- Whichever column is set as `subcategoryColumn` becomes the category filter dropdown —
  so `SERIES` (markers), `Category` (pictures) or `SERIES` (interments) may be doing that
  job, depending on the config.

**[WAS WRONG]** My old R10–R14 (marker type restricts markers, capacity caps interments,
single/companion must match the grave, property type picks the interment service) are
**not implemented anywhere**. They may well be rules *you* follow, in your head, while
quoting — but the app does not know them. That is a question for you, not a bug.

---

## 7. Identity: SKU is not a key

`sheetService.ts:97-100`:

```js
const sku = entry['HMIS CODE'] || entry['SKU'] || `M-${index}`;
id: `item-${index}-${Date.now()}-${Math.random()…}`
```

The catalogue item's `id` is **randomly regenerated on every parse**. `sku` is only
carried onto the quote line as `productId` and fed to the AI matcher.

**[WAS WRONG]** Old D7 warned that duplicate HMIS codes are dangerous because they can't
be a primary key. They aren't used as one, so duplicate HMIS codes are harmless here.
(They do matter for the *new* schema, where I'd want real stable ids — but that's a design
question, not a defect in what you have.)

The practical consequence: **the catalogue is ephemeral**. It lives in `localStorage`
(`quote_gen_catalog`, `quote_gen_sources`) and is rebuilt from the CSV on every load.
Saved quotes in `quote_templates.items` are self-contained jsonb snapshots with name,
price and every flag frozen in — so a price change never touches an old quote, and an old
quote can never be re-priced.

---

## 8. The price-column fallback

`sheetService.ts:47-52`, used only when no `priceColumn` is configured:

```js
rawPrice = entry['TOTAL PRICE W/ BASE'] || entry['TOTAL PRICE'] || entry['BRONZE PRICE'] || '0';
```

and `processSheetData` (App.tsx:188) otherwise guesses the first header containing
"PRICE".

**[WAS WRONG]** My Q6 asked whether the granite base is optional. The app's answer is:
*whichever column you mapped*. Either `priceColumn = TOTAL PRICE W/ BASE` (base always in,
no choice offered) or `priceColumn = BRONZE PRICE` with `BASE PRICE` as an extra-fee rule
(base always added as its own line). **I can't tell which without `workspaceConfig`.**

Prices are cleaned with `replace(/[^0-9.]/g, '')`, so `$1,200` → `1200`. The literal text
`(price missing)` on the Baby Casket/Vault row → `0`, and a zero-priced item is still
added to the quote at $0.

---

## 9. CSV parsing is naive

`parseLine` (`sheetService.ts:18-34`) toggles `inQuote` on **every** `"` and drops all
quote characters. It has no concept of `""` as an escaped quote. So the stored value
`10" x 10"` renders as `10 x 10` — inch marks vanish from every marker name and size.
Embedded commas inside quoted fields do survive, because the toggle count stays even.

Also: a sheet whose last row is truncated mid-quote (old D8, Markers-Plate) will parse
that row with shifted/missing trailing values rather than failing loudly.

---

## 10. Features to preserve in the migration

Not optional extras — these are what the app *is*:

| feature | where |
|---|---|
| Per-sheet column mapping UI, saved to cloud for all devices | App.tsx:1761-1824, `handleSaveWorkspaceConfig` |
| Auto-applied fees driven by data, with labels pulled from the row | `sheetService.ts:60-78` |
| Two ECF modes incl. the 90/10 rule | App.tsx:410 |
| Per-line GST / PST / Non-Disc / Waive toggles | `QuoteTable.tsx` |
| Two-pass waive allocation + percentage discount | App.tsx:394-474 |
| **Monthly payment plan** — deposit (default = grand total × 10%, rounded up to the nearest $100), interest rate, term in months, amortised payment | App.tsx:479-494 |
| Bilingual EN / 繁中 throughout, including terms and section headings | `isChineseEnabled` |
| **Comparison tool** — several quotes side by side, with density auto-scaling | `activeView === 'compare'` |
| A4 print / PDF export via `html2pdf`, with adaptive font size and padding to force a one-page fit | `handleSavePDF`, App.tsx:811-833 |
| Image attach on the quote, drag-to-resize height | `onImageChange`, `handleResizeStart` |
| Quote templates saved to / loaded from the cloud | `saveTemplate`, `handleLoadTemplate` |
| Reorder lines by drag or steppers, within a section only | `QuoteTable.tsx:50-80` |
| Custom ad-hoc line items, with an ECF prompt for Property ones | `handleAddCustomItem`, `handleConfirmEcf` |
| Local CSV upload as an extra source alongside the cloud sheets | `onFileChange` |
| $50 Processing Fee auto-seeded on every new quote, non-discountable | `createInitialProcessingFee` |

Dead code: **`geminiService.ts` is never imported.** The AI matcher
(`gemini-3-pro-preview`, natural-language → SKU) is written but not wired up; the empty
state still advertises "use AI jumpstart above". `@google/genai` is a dependency.
`getSampleData()` returns `[]`.

---

## 11. No parks, no users, no auth

- **Park** is just letterhead: one `businessProfile` (name/address/email/phone), defaulting
  to Victory Memorial Park, 14831 28th Ave Surrey. Stored in `localStorage` and mirrored to
  `app_settings`. Switching park = retyping the business info. There is no park dimension
  on sheets, items or quotes.
- **No accounts.** No login, no `user_id` on `quote_templates`. Every quote and every
  config is global and shared.
- All three tables are reached with a hard-coded **anon** key, including `DELETE`
  (`deleteSheetFromCloud`, `deleteTemplateFromCloud`).

---

## 12. Still outstanding

1. **`app_settings.config_data`** — the `workspaceConfig` mappings. Without it I don't know
   any sheet's price column or fee rules. This is the last piece of the picture.
2. Which of the unused columns encode rules **you apply manually** and want the new portal
   to enforce (marker type ↔ property, capacity, single/companion, weekday vs weekend
   interment), versus which are just reference.
3. The three park questions from the first doc, which the code can't answer because it has
   no park concept.

Everything else in `01-mvp-data-understanding.md` under "Data problems" stays **parked and
unjudged** until you say otherwise.
