# Cemetery MVP — my understanding of the current data

Source: `pricing_sheets` dump from the existing (separate) Supabase project, 11 sheets,
received 2026-11-14. This is **my reading, not confirmed fact** — every inference is
marked. Corrections from you overwrite this file; it then becomes the migration spec.

---

## 0. What the dump actually is

`pricing_sheets` has 11 rows. Each row's `csv_data` is a whole spreadsheet tab stored as
one CSV string. Columns `name` (tab name) and `section` (top-level UI grouping) are the
only structured metadata; `description` is NULL on all 11.

`section` takes exactly two values:

| section | sheets |
|---|---|
| `Property` | LawnCrypts, CremationSpaces |
| `Merchandise and Services` | Markers-Flat, Markers-Plate, Markers-Pillow, Markers-Upright, Vases, Urns, Vaults, Pictures (ColdSpring), Interments-Services |

**Naming collision to fix in the new schema:** `section` here means "Property vs
Merchandise", but in cemetery language a *section* is a garden (Royal Heights, Birch
Estates, Memory Lane). The new schema should call the first one something else
(`sheet_group` / `catalog_group`) and reserve `section` for the garden.

**Row ids present:** 1,2,3,4,5,6,7,8,9,12,13. **Ids 10 and 11 are missing** — either
deleted, or two sheets weren't included. See Q1.

---

## 1. Entity map (what I think exists, in plain language)

Five real kinds of thing, not eleven:

### A. Property (interment rights) — "the space you buy"
Two sheets because the two families price differently.

**LawnCrypts** — in-ground graves for full burial.
- `Spaces` column holds the **garden name** (Royal Heights Phase 2, Royal Jade Phase 1,
  Royal Jade Phase 2, Royal Plateau), *not* a count. Header is misleading.
- `Type` = `Upright` | `Flat` | `Estate`. For lawn crypts this is **which marker style
  the grave permits**, and it changes the price of the grave itself:
  Royal Heights Phase 2 is $34,995 as an upright-marker grave and $32,995 as a
  flat-marker grave. `Estate` = private garden ($208,000).
- `BASE PRICE` + `ECF PRICE` = `TOTAL PRICE`. Verified on all 8 rows.
- ECF is $1,050 per row, except the Estate at $2,100 (= 2 × 1,050).
- `FLAT MARKER CODES` free text, e.g. `S– L,M,N; D– N,O,P,Q` — single graves accept
  marker codes L/M/N, doubles accept N/O/P/Q. `n/a` on all Upright rows (consistent:
  an upright grave takes no flat marker). **The letters L–Q appear nowhere in any
  marker sheet.** See Q5.
- Then 5 unnamed empty columns and a stray `TOTAL` column holding *other rows'* base
  prices in scrambled order (Royal Heights Upright's `TOTAL` = 48945 = Royal Jade Ph2
  Upright's BASE). Dead spreadsheet residue — drop it.
- Not every garden offers every type: Royal Jade Phase 1 is Upright-only.

**CremationSpaces** — niches, boulders, mausoleum crypts, in-ground cremation, memorial-only.
- `Sections` = garden name. Same role as LawnCrypts' `Spaces`, different header.
- `Type` here means **property form** (Niches, Family Niches, Cored Niches, Boulder,
  Mausoleum Crypts, In-Ground Cremation, In-Memory) — a *different meaning* from
  LawnCrypts' `Type` under the same header name.
- `Category` = `Cremation Only` | `Full Burial or Cremation`.
- `Interment Rights` = integer capacity (1, 2, 4, 6, 8, 12, 16).
- `Marker Type` = `Crypt Plate` | `Niche Plate` | `Flat` | `Flat Only` | `N/A`.
  **This is the join to the marker sheets** — it restricts what memorial can be sold
  against the space.
- `Price (w/ ECF)` — one combined column. **ECF is not separable here**, unlike
  LawnCrypts. Inconsistency to resolve in the new schema.
- `In-Memory` rows (Memory Glen Walkway, Ivy Glen, Thousand Flowers Memory Board @ $150)
  are memorial-only — no remains interred — so no interment service should apply, even
  though `Category` still reads "Cremation Only".

### B. Memorials (markers) — four sheets, one concept, four column shapes
The shapes differ because the products behave differently, so the split is meaningful:

| sheet | identity | base granite | totals given | install |
|---|---|---|---|---|
| Markers-Flat | size × series × vase | separate `BASE SIZE` + `BASE PRICE` | **two** totals (with/without base) | 550 / 350 / 195 |
| Markers-Plate | named plate | none (plates have no base) | one total | 350 / 550 / 195 |
| Markers-Upright | model × colour | `Base Size` given, **no price** → included | **none** | 1495 single / 2495 companion |
| Markers-Pillow | dimensions × colour | `Base Size` given, **no price** → included | **none** | 550 |

- Markers-Flat `SERIES` mixes design lines (Expressions, Classic, Garden, Dynasty,
  Highland, Harmony (Asian)) with what look like vendors (OBCO, BJW). ColdSpring appears
  as a vendor in Markers-Plate and Pictures. Series × size × vase is a **sparse** matrix,
  not a full cross product — Harmony has no `w/ Vase` variants at all and has 36x13 /
  44x13 sizes nothing else has.
- Markers-Upright `Type` = `Single` | `Companion`, and `W/ Vase` = `NO` | `YES (1)` |
  `YES (2)` (a count of included vases).
- Upright/Pillow are priced as **model × colour**, 4 colours each, different price per
  colour.

### C. Merchandise with no fee attached
- **Urns** — price only. `Urns` column is the bare model name, `ITEM DESCRIPTION` is that
  + " Urn", `CHI` is `骨灰盒 (型號：<model>)`. All three derive from one field.
  `Funeral Urn Price Page #` cross-references the **funeral** urn catalogue by page —
  a direct link to the funeral side of this app, which already carries ~130 urns.
- **Vaults** — price only. `TYPE` = `Burial` (for caskets) | `Urn`.

### D. Merchandise with a fee attached
- **Vases** — `PRICE` + `INSTALL` = `TOTAL PRICE`. No ECF.
- **Pictures (ColdSpring)** — `Basic Price` + `Setting Fee` ($195 flat) = `Total Price`.
  No ECF. No `*-NAME` columns, so **the fee's display label is unknown** (see Q9).

### E. Services — Interments-Services
One flat list, grouped by `SERIES`:

| SERIES | what it is |
|---|---|
| Opening and Closing Services | the interment itself: Entombment (crypt), Ground Interment (grave), Inurnment (urn), tiered Signature $3,195 / Standard $2,695 / Basic $2,195 |
| Additional Weekend & Holiday Services | surcharges: Sat/Sun/holiday $2,495 (burial) or $1,495 (inurnment), After Hours $1,295 |
| Disinterment Services | Disentombment / Disinterment $8,995, Disinurnment $2,190 |
| Memorial Installation Services | the install fees that the marker sheets denormalise |
| Miscellaneous Services | marker refinishing |
| Additional Document Services | transfer $1,995, deed replacement $85, processing $50 |

The Chinese text carries a rule the English doesn't: every base interment reads
`下葬費 (Mon-Fri 10:30AM - 2:30PM)`. **The base price assumes a weekday daytime window**;
anything outside it takes a surcharge row.

---

## 2. Derivation rules I inferred

Marked ✅ where the arithmetic in the sheet proves it, ❓ where it's a guess.

| # | Rule | Status |
|---|---|---|
| R1 | Lawn crypt total = `BASE PRICE` + `ECF PRICE` | ✅ all 8 rows |
| R2 | Cremation space price already includes ECF; no separate component exists | ✅ column name |
| R3 | Flat/plate marker = `BRONZE PRICE` + `INSTALL` + `ECF`; `+ BASE PRICE` when a granite base is taken | ✅ all rows but one (see D3) |
| R4 | Upright/pillow marker = `Price` + `Install` + `ECF`, granite base included in price | ❓ no total column to check against |
| R5 | Vase = `PRICE` + `INSTALL`, no ECF | ✅ |
| R6 | Picture = `Basic Price` + `Setting Fee`, no ECF | ✅ oval rows only — 7 rectangular rows fail (D1) |
| R7 | Urns and vaults carry no fee and no ECF | ✅ no such columns |
| R8 | **Selecting a marker auto-applies its install fee and its ECF**, each as its own line with the name from `INSTALL-NAME` / `ECF NAME` (+ `-CHI`), at the amount in that row | ❓ this is the rule you described to me; the code must confirm whether they're separate lines or folded into `TOTAL PRICE` |
| R9 | Granite base on a flat marker is **optional** — that's why there are two totals | ❓ Q6 |
| R10 | Property's `Marker Type` restricts which marker products may be quoted with it | ❓ strongly implied |
| R11 | Lawn crypt's `Upright` / `Flat` restricts marker style, and `FLAT MARKER CODES` narrows it further by size | ❓ |
| R12 | Upright marker `Single` / `Companion` must match the space's capacity | ❓ |
| R13 | Property type determines which interment service applies: crypt → Entombment, grave → Ground Interment, niche/urn → Inurnment; `In-Memory` → none | ❓ |
| R14 | `Interment Rights` caps how many interments (and plates) can be sold against one space | ❓ |
| R15 | Availability constraints are encoded in product **names**: "(FOR DOUBLE ONLY)" on Freesia Vase, "(vault burial only, no niches)" on Natural Box urn | ✅ text, ❓ enforcement |
| R16 | Weekend / holiday / after-hours interment = base service + the matching surcharge row | ❓ from the Chinese labels |
| R17 | Every fee row carries its own English and Chinese label, so the quote renders bilingual from data, not translation (matches `quote_templates.is_chinese_enabled`) | ✅ |

**The install amounts in the marker rows match real rows in Interments-Services:**
Single/Companion Marker Installation-Flush $550, Niche Plaque Installation $350,
Vase Installation / Marker Installation $195, Single Upright $1,495, Companion Upright
$2,495, Ledger $2,495, Mausoleum Plaque $550. So the same fee exists in two places — once
denormalised onto each marker row, once as a standalone service item.

> **This is the cemetery version of the duplicate Crematory Fee bug we just fixed on the
> funeral side.** If an advisor picks a marker (auto-adds $550) and also adds "Single
> Marker Installation-Flush" from the services list, the quote double-charges. The new
> schema should make the fee one entity referenced from both paths, with the same
> "already present?" guard.

Note the generic labels work *against* that: every marker row's `INSTALL-NAME` is the
same string "Marker Installation Fee" regardless of whether the amount is 195, 350, 550,
1495 or 2495. The specificity lives only in the number.

---

## 3. What is NOT in this data at all

Design-relevant absences:

1. **No park identifier.** All 11 sheets are one park (6800 Victory Memorial — Royal
   Heights / Royal Jade / Royal Plateau / Birch / Memory Lane / Legacy Lane / Memory
   Glen / Blue Jay Way are its gardens). Single-park is baked in by omission.
2. **No inventory.** No specific grave or niche numbers, no sold/available state. Quoting
   happens at garden + type level.
3. **No taxability.** Nothing per-item. `quote_templates` carries only quote-level
   `gst_rate` 0.05 / `pst_rate` 0.07, so the taxable/non-taxable decision must be
   hard-coded in the app. On the funeral side it's per item (`default_gst`,
   `default_pst`) — that asymmetry needs resolving. (Normally interment rights and ECF
   aren't taxable while merchandise and services are; I need the code to confirm what
   you actually do.)
4. **No effective dates.** One `last_updated` per whole sheet. No price history, so an
   old quote can't be re-priced at its original prices.
5. **No product IDs.** `ITEM DESCRIPTION` — itself built by string concatenation from the
   other columns — is the de facto key. `quote_templates.items` is a jsonb snapshot, so
   saved quotes hold names and prices, not references. Renaming a product won't break an
   old quote (good), but nothing links them either (no integrity, no re-pricing).
6. **HMIS codes are not unique and cannot be keys.** See D7.
7. **No packages/bundles**, unlike the funeral side.
8. **No link table** between marker products and the properties that accept them — only
   the free-text `FLAT MARKER CODES` and `Marker Type`.

---

## 4. Data problems found (independent of migration)

These are in your live data now. I have **not** changed anything.

**D1 — Pictures: 7 of 21 rows don't add up.** Every `Oval …` row and the Expressions row
satisfy `Basic + 195 = Total`. All seven `Rectangular … Precious Portrait R1x` rows fail,
by inconsistent amounts:

| row | Basic | +195 | Total shown | gap |
|---|---|---|---|---|
| Rect B&W R10 | 1491 | 1686 | 1662 | −24 |
| Rect B&W R11 | 772 | 967 | 954 | −13 |
| Rect B&W R12 | 586 | 781 | 771 | −10 |
| Rect Color R10 | 2315 | 2510 | 2472 | −38 |
| Rect Color R11 | 1418 | 1613 | 1590 | −23 |
| Rect Color R12 | 1144 | 1339 | 1320 | −19 |
| Rect Color R13 | 1052 | 1247 | 1230 | −17 |

The gaps imply setting fees of 171/182/185/157/172/176/178 rather than 195. Which column
is authoritative?

**D2 — Vases: duplicate and conflicting rows.** 6 rows, 4 distinct products.
Fiore Vase appears **twice, identically** (1035/195/1230). Freesia Vase (FOR DOUBLE ONLY)
appears **twice with different prices**: 450/195/645 and 635/195/830. Which Freesia price
is right?

**D3 — Markers-Flat, BJW 7"x5": the only row whose total doesn't reconcile.**
Bronze 575, install column 350, ECF 10 → should total 935, but `TOTAL PRICE` says 765,
which implies an install of 180. `TOTAL PRICE W/ BASE` 982 = 765 + 217 base, so the base
arithmetic is fine. Is install 350 or 180?

**D4 — Garden series: 28x16 and 24x30 prices look swapped.** In Classic, Dynasty and
Highland, `28" x 16"` w/ vase is 3,943 and `24" x 30"` w/ vase is 6,566. In **Garden** the
two are reversed (28x16 = 6,566, 24x30 = 3,943), for both the vase and no-vase variants.
The granite base prices still follow the correct size in every series, so only the bronze
prices are crossed. Deliberate, or a data-entry swap?

**D5 — "Baby Casket / Vault Combination Burial Vault" has the literal text
`(price missing)`** in the price column, and no HMIS code.

**D6 — Missing / wrong HMIS codes in Markers-Flat.** `56" x 16" Harmony (Asian)` has an
empty code. `24" x 30" Harmony` carries `MBFGB0J7FI`, but the `FI` suffix is the 24x14
size everywhere else (24x30 uses `FQ`).

**D7 — HMIS codes are price-band codes, not product codes.** `MGREOT30HK` is on models
197, 297, 297A, 397, 397A and MS102 — every Mahogany upright in roughly the $9–10k band.
All five Scattering Urns share `UOSGFSAFC`. And `MBR062MOKA` sits on two different
Markers-Plate products at different prices (4¼x3⅛ Ossuary $763 and 13x1 Memory Board
$760). Confirm this is intended, because it means HMIS cannot be the primary key — and ID
collisions are exactly what bit us on the funeral casket catalogue.

**D8 — Markers-Plate is truncated.** The last row's final value ends `墓碑保養`,
missing the `費` and the closing quote. Either the dump was cut or the stored CSV is
damaged.

**D9 — "Adore Celestial Vase Plain 3"" has install 0** while every other vase has 195.
Intended (an insert, not an installation) or an omission?

**D10 — Chinese labels that disagree with the English.** `Ossuary-Adult` is
`撒骨灰費用` (scattering fee), not ossuary. `Inurnment-Youth` is `下葬費` (burial) where
every other inurnment is `上位費`.

**D11 — Spelling.** `Brookeside` in the item name vs `Brookside` in the Sections column.
`Pillow Marker  (` has a double space throughout.

---

## 5. Open questions

### Blocking — I need these before designing the schema

1. **Sheets 10 and 11.** Ids 1–9, 12, 13 are present. What were 10 and 11, and do I need
   them?
2. **Are all 11 sheets one park (6800)?** I'm assuming yes from the garden names.
3. **For the other three parks (0839 Boal, 0838 Ocean View, 0836 Forest Lawn):** is the
   merchandise catalogue the *same products at different prices*, or *different products*?
   You said Forest Lawn and Ocean View share fee schedules but differ in sections — does
   "fee schedules" mean the Interments-Services list, the install/ECF amounts, or both?
   This decides whether we get one shared catalogue with per-park pricing (like
   `casket_catalog` + `funeral_home_caskets` on the funeral side) or four separate ones.
4. **Does the app auto-add the install and ECF lines, or does the advisor tick them?**
   And does the quote show marker + install + ECF as three lines, or one line at
   `TOTAL PRICE`? (The code will tell me; your intent is what matters.)
5. **The flat marker codes L, M, N, O, P, Q.** Where does letter → marker size live?
   It isn't in any sheet I have.
6. **Granite base on a flat marker: optional or mandatory?** Two totals suggests a
   choice, but a flush-set marker with no base may not be a real option in some gardens.
7. **Tax.** Which categories are taxable, and GST-only vs GST+PST? Specifically: interment
   rights, ECF, install fees, markers, urns, vaults, vases, pictures.

### Non-blocking — data decisions I'll need eventually

8. D1–D4 above: which number is authoritative in each case.
9. Pictures' setting fee: what should the line be called on the quote (and in Chinese)?
   It's the only fee with no `*-NAME` columns.
10. Should `In-Memory` properties be blocked from having an interment service added?
11. Should the cemetery urns reuse the funeral side's urn records and photos, the way we
    did for casket photos? The `Funeral Urn Price Page #` column suggests they're the
    same products.

---

## 6. Next steps (unchanged from the plan)

1. You correct this document.
2. I read the app code and reconcile it against this — the code is where the rules you
   described actually live, and it will answer Q4 and Q7 and probably Q5.
3. *Then* we design the `cemetery` schema and the migration. No building before that.
