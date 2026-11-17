# Generates cemetery_seed_6800.sql from the 11 extracted sheets.
# Column choices follow the old app's workspaceConfig EXACTLY so prices and
# fee lines reproduce what the old app charged.
import csv, io, os, re, sys
from collections import OrderedDict

SH = "/var/lib/postgresql/cemseed/sheets"
PARK, SCHED = "6800", "fs_victory"

def sheet(fid):
    fn = [f for f in os.listdir(SH) if f.startswith(fid + "_")][0]
    rows = list(csv.DictReader(io.StringIO(open(os.path.join(SH, fn), encoding="utf-8").read())))
    return [r for r in rows if any((v or "").strip() for v in r.values())]

def q(v):
    if v is None: return "null"
    s = str(v).strip()
    return "null" if s == "" else "'" + s.replace("'", "''") + "'"

def num(v):
    if v is None: return None
    s = re.sub(r"[^0-9.]", "", str(v))
    if s in ("", "."): return None
    try: return float(s)
    except ValueError: return None

def n(v):
    x = num(v)
    return "null" if x is None else f"{x:g}"

def fee(v):                      # a fee of 0 or blank must produce NO quote line
    x = num(v)
    return "null" if x is None or x == 0 else f"{x:g}"

out, notes = [], []
W = out.append

W("-- " + "─"*74)
W("-- CEMETERY SEED — 6800 Victory Memorial Park")
W("--")
W("-- GENERATED from the 11 pricing_sheets CSVs of the old cemetery project.")
W("-- Do not hand-edit; regenerate instead. Run cemetery_schema.sql first.")
W("--")
W("-- Column choices replicate the old app's workspaceConfig exactly, so every")
W("-- price and every automatic fee line matches what the old app charged:")
W("--   LawnCrypts      price=BASE PRICE,   ECF=ECF PRICE as its own line")
W("--   CremationSpaces price=Price (w/ ECF), ECF inside price (90/10 rule)")
W("--   Markers-Flat    price=BRONZE PRICE + BASE PRICE + INSTALL + ECF")
W("--   Markers-Upright price=Price        + Install + ECF")
W("--   Markers-Pillow  price=Price        + Install + ECF")
W("--   Markers-Plate   price=BRONZE PRICE + INSTALL + ECF")
W("--   Vases           price=PRICE        + INSTALL")
W("--   Urns, Vaults    price only, no fees")
W("--")
W("-- Urns default to GST + PST; every other product is GST only.")
W("--   Pictures        price=Basic Price  + Setting Fee")
W("--")
W("-- Safe to re-run (every insert is upsert-on-conflict).")
W("-- " + "─"*74)
W("")
W("begin;")
W("")

# ── park + fee schedule ──────────────────────────────────────────────────────
W("-- ─── Park and fee schedule ───")
W(f"insert into cemetery.fee_schedules (id, name) values ({q(SCHED)}, 'Victory Memorial Park')")
W("  on conflict (id) do update set name = excluded.name;")
W("insert into cemetery.parks (id, name, address, phone, fee_schedule_id, sort_order) values")
W(f"  ({q(PARK)}, 'Victory Memorial Park', '14831 28th Ave, Surrey, BC, V4P 1P3', null, {q(SCHED)}, 1)")
W("  on conflict (id) do update set name=excluded.name, address=excluded.address,")
W("    fee_schedule_id=excluded.fee_schedule_id, sort_order=excluded.sort_order;")
W("")

# ── service categories (the six SERIES families) ─────────────────────────────
CATS = OrderedDict([
    ("Opening and Closing Services",          ("svc_interment",     "下葬及上位服務", 1)),
    ("Additional Weekend & Holiday Services", ("svc_surcharge",     "週末及節假日附加費", 2)),
    ("Disinterment Services",                 ("svc_disinterment",  "取出服務", 3)),
    ("Memorial Installation Services",        ("svc_install",       "墓碑安裝服務", 4)),
    ("Miscellaneous Services",                ("svc_misc",          "其他服務", 5)),
    ("Additional Document Services",          ("svc_documents",     "文件服務", 6)),
])
W("-- ─── Service categories ───")
W("-- The old 'Interments-Services' sheet held these six families in one flat list")
W("-- under a SERIES column the app never used. Interment and memorial installation")
W("-- are different things and are separate categories here.")
W("insert into cemetery.service_categories (id, name, name_zh, sort_order) values")
W(",\n".join(f"  ({q(cid)}, {q(en)}, {q(zh)}, {o})" for en,(cid,zh,o) in CATS.items()))
W("  on conflict (id) do update set name=excluded.name, name_zh=excluded.name_zh, sort_order=excluded.sort_order;")
W("")

# ── services ────────────────────────────────────────────────────────────────
svc = sheet("3")
st_rows, sp_rows, by_name = [], [], {}
for i, r in enumerate(svc, 1):
    sid = f"svc{i:04d}"
    name = (r["ITEM DESCRIPTION"] or "").strip()
    cat = CATS.get((r["SERIES"] or "").strip(), (None,))[0]
    by_name[name] = sid
    st_rows.append(f"  ({q(sid)}, {q(cat)}, {q(r.get('HMIS CODE'))}, {q(name)}, {q(r.get('CHI'))}, {i})")
    sp_rows.append(f"  ({q(SCHED)}, {q(sid)}, {n(r['PRICE'])})")
W("-- ─── Service types (shared definitions) ───")
W("insert into cemetery.service_types (id, category_id, hmis_code, name, name_zh, sort_order) values")
W(",\n".join(st_rows))
W("  on conflict (id) do update set category_id=excluded.category_id, hmis_code=excluded.hmis_code,")
W("    name=excluded.name, name_zh=excluded.name_zh, sort_order=excluded.sort_order, active=true;")
W("")
W("-- ─── Service prices for this park's fee schedule ───")
W("insert into cemetery.service_prices (fee_schedule_id, service_type_id, price) values")
W(",\n".join(sp_rows))
W("  on conflict (fee_schedule_id, service_type_id) do update set price=excluded.price, active=true;")
W("")

# installation services referenced by products, by amount — only where unambiguous
INST = {}
for nm, sid in by_name.items():
    INST[nm] = sid
def inst_ref(amount, kind, variant=None):
    a = num(amount)
    if a is None or a == 0: return "null"
    if kind == "upright":
        if a == 1495: return q(INST.get("Single Marker Installation - Upright"))
        if a == 2495: return q(INST.get("Companion Marker Installation - Upright"))
    if a == 350: return q(INST.get("Niche Plaque Installation"))
    if a == 195 and kind == "vase": return q(INST.get("Vase Installation"))
    if a == 195: return q(INST.get("Marker Installation"))
    return "null"   # 550 flush is both Single and Companion at the same price — ambiguous, left unlinked

# ── property types ──────────────────────────────────────────────────────────
PT = OrderedDict()
def ptype(name, zh):
    key = re.sub(r"[^a-z0-9]+", "_", (name or "other").lower()).strip("_") or "other"
    if key not in PT: PT[key] = (name, zh, len(PT) + 1)
    return key

lc, cs = sheet("1"), sheet("4")
prop_rows = []
pi = 0
for r in lc:
    pi += 1
    t = (r["Type"] or "").strip()
    key = ptype("Estate" if t == "Estate" else "Lawn Crypt", "私家花園" if t == "Estate" else "草地墓位")
    prop_rows.append("  (" + ", ".join([
        q(f"prp{PARK}_{pi:04d}"), q(PARK), q(key), q(r["Spaces"]), q(r.get("Type-CHI")),
        q(r["ITEM DESCRIPTION"]), q(r.get("CHI")), "null",
        n(r["BASE PRICE"]), n(r["ECF PRICE"]), "false",
        q(t), "null", "null", "null", q(r.get("FLAT MARKER CODES")), str(pi)]) + ")")
for r in cs:
    pi += 1
    key = ptype((r["Type"] or "").strip(), (r.get("Type-CHI") or "").strip())
    prop_rows.append("  (" + ", ".join([
        q(f"prp{PARK}_{pi:04d}"), q(PARK), q(key), q(r["Sections"]), q(r.get("Type-CHI")),
        q(r["ITEM DESCRIPTION"]), q(r.get("CHI")), "null",
        n(r["Price (w/ ECF)"]), "null", "true",
        "null", q(r.get("Marker Type")), q(r.get("Category")),
        n(r.get("Interment Rights")), "null", str(pi)]) + ")")

W("-- ─── Property types ───")
W("insert into cemetery.property_types (id, name, name_zh, sort_order) values")
W(",\n".join(f"  ({q(k)}, {q(v[0])}, {q(v[1])}, {v[2]})" for k, v in PT.items()))
W("  on conflict (id) do update set name=excluded.name, name_zh=excluded.name_zh, sort_order=excluded.sort_order;")
W("")
W("-- ─── Properties (interment rights) ───")
W("-- ecf_included=false  -> ecf_price becomes its own non-discountable line (lawn crypts)")
W("-- ecf_included=true   -> ECF is inside price; 90/10 discountable split (cremation spaces)")
W("insert into cemetery.properties (id, park_id, property_type_id, section, section_zh,")
W("  name, name_zh, hmis_code, price, ecf_price, ecf_included,")
W("  marker_style, marker_type_allowed, interment_category, interment_rights,")
W("  flat_marker_codes, sort_order) values")
W(",\n".join(prop_rows))
W("  on conflict (id) do update set section=excluded.section, section_zh=excluded.section_zh,")
W("    name=excluded.name, name_zh=excluded.name_zh, price=excluded.price,")
W("    ecf_price=excluded.ecf_price, ecf_included=excluded.ecf_included,")
W("    marker_style=excluded.marker_style, marker_type_allowed=excluded.marker_type_allowed,")
W("    interment_category=excluded.interment_category, interment_rights=excluded.interment_rights,")
W("    flat_marker_codes=excluded.flat_marker_codes, sort_order=excluded.sort_order, active=true;")
W("")

# ── product categories ──────────────────────────────────────────────────────
PC = [
 ("marker_flat","Flat Markers","平碑","Marker Installation Fee","墓碑安裝費","Marker ECF","墓碑保養費","Marker Granite Base","墓碑石底座",1),
 ("marker_upright","Upright Markers","立碑","Marker Installation Fee","墓碑安裝費","Marker ECF","墓碑保養費",None,None,2),
 ("marker_pillow","Pillow Markers","枕頭墓碑","Marker Installation Fee","墓碑安裝費","Marker ECF","墓碑保養費",None,None,3),
 ("marker_plate","Marker Plates","青銅名牌","Marker Installation Fee","墓碑安裝費","Marker ECF","墓碑保養費",None,None,4),
 ("vase","Vases","花瓶","Vase Installation Fee","花瓶安裝費",None,None,None,None,5),
 ("portrait","Portraits","相片","Portrait Setting Fee","相片安裝費",None,None,None,None,6),
 ("urn","Urns","骨灰盒",None,None,None,None,None,None,7),
 ("vault","Vaults","外棺",None,None,None,None,None,None,8),
]
W("-- ─── Product categories (and the labels for automatic fee lines) ───")
W("-- These labels were per-row columns in the CSVs (INSTALL-NAME / ECF NAME /")
W("-- BASE-NAME). Eight rows here replace the same strings repeated ~500 times.")
W("-- Granite base label is composed in the app as: base_size || ' ' || base_label_suffix")
W("insert into cemetery.product_categories (id, name, name_zh, install_label, install_label_zh,")
W("  ecf_label, ecf_label_zh, base_label_suffix, base_label_suffix_zh, sort_order) values")
W(",\n".join("  (" + ", ".join([q(c[0]),q(c[1]),q(c[2]),q(c[3]),q(c[4]),q(c[5]),q(c[6]),q(c[7]),q(c[8]),str(c[9])]) + ")" for c in PC))
W("  on conflict (id) do update set name=excluded.name, name_zh=excluded.name_zh,")
W("    install_label=excluded.install_label, install_label_zh=excluded.install_label_zh,")
W("    ecf_label=excluded.ecf_label, ecf_label_zh=excluded.ecf_label_zh,")
W("    base_label_suffix=excluded.base_label_suffix,")
W("    base_label_suffix_zh=excluded.base_label_suffix_zh, sort_order=excluded.sort_order;")
W("")

# ── products + park_products ────────────────────────────────────────────────
P, PP = [], []
# Urns carry PST as well as GST; everything else is GST only.
PST_CATEGORIES = {"urn"}

def add(pid, cat, hmis, name, zh, price, base=None, ecf=None, install=None, inst_ref_sql="null",
        series=None, model=None, variant=None, size=None, base_size=None, color=None,
        dims=None, vase=None, vcount=None, page=None, note=None, order=0):
    P.append("  (" + ", ".join([
        q(pid), q(cat), q(hmis), q(name), q(zh), q(series), q(model), q(variant),
        q(size), q(base_size), q(color), q(dims),
        "null" if vase is None else ("true" if vase else "false"),
        n(vcount) if vcount is not None else "null",
        q(page), inst_ref_sql,
        "true",                                        # default_gst
        "true" if cat in PST_CATEGORIES else "false",  # default_pst
        "true",                                        # default_discountable
        q(note), str(order)]) + ")")
    PP.append("  (" + ", ".join([
        q(PARK), q(pid), n(price) if num(price) is not None else "0",
        fee(base), fee(ecf), fee(install), str(order)]) + ")")

for i, r in enumerate(sheet("2"), 1):          # Markers-Flat
    add(f"mkf{i:04d}", "marker_flat", r.get("HMIS CODE"), r["MARKER"], r.get("CHI"),
        r["BRONZE PRICE"], r.get("BASE PRICE"), r.get("ECF"), r.get("INSTALL"),
        inst_ref(r.get("INSTALL"), "flat"),
        series=r.get("SERIES"), size=r.get("MARKER SIZE"), base_size=r.get("BASE SIZE"),
        vase=(r.get("VASE") or "").strip().upper() == "YES", order=i)
for i, r in enumerate(sheet("12"), 1):         # Markers-Upright
    wv = (r.get("W/ Vase") or "").strip()
    m = re.search(r"\((\d+)\)", wv)
    add(f"mku{i:04d}", "marker_upright", r.get("HMIS"), r["MARKER"], r.get("CHI"),
        r["Price"], None, r.get("ECF"), r.get("Install"),
        inst_ref(r.get("Install"), "upright", r.get("Type")),
        model=r.get("Model"), variant=r.get("Type"), size=r.get("Tablet Dimensions"),
        base_size=r.get("Base Size"), color=r.get("Color"),
        vase=wv.upper().startswith("YES"), vcount=(m.group(1) if m else None), order=i)
for i, r in enumerate(sheet("13"), 1):         # Markers-Pillow
    add(f"mkp{i:04d}", "marker_pillow", r.get("HMIS"), r["MARKER"], r.get("CHI"),
        r["Price"], None, r.get("ECF"), r.get("Install"),
        inst_ref(r.get("Install"), "pillow"),
        size=r.get("Tablet Dimensions"), base_size=r.get("Base Size"),
        color=r.get("Color"), order=i)
for i, r in enumerate(sheet("7"), 1):          # Markers-Plate
    add(f"mkt{i:04d}", "marker_plate", r.get("HMIS CODE"), r["MARKER"], r.get("CHI"),
        r["BRONZE PRICE"], None, r.get("ECF"), r.get("INSTALL"),
        inst_ref(r.get("INSTALL"), "plate"), size=r.get("MARKER SIZE"), order=i)
for i, r in enumerate(sheet("9"), 1):          # Vases
    add(f"vas{i:04d}", "vase", r.get("HMIS CODE"), r["ITEM"], r.get("CHI"),
        r["PRICE"], None, None, r.get("INSTALL"),
        inst_ref(r.get("INSTALL"), "vase"), order=i)
for i, r in enumerate(sheet("8"), 1):          # Pictures (ColdSpring)
    add(f"por{i:04d}", "portrait", r.get("HMIS Code"), r["Item Description"], r.get("CHI"),
        r["Basic Price"], None, None, r.get("Setting Fee"), "null",
        series=r.get("Category"), size=r.get("Sizes"), order=i)
for i, r in enumerate(sheet("6"), 1):          # Urns
    pg = (r.get("Funeral Urn Price Page #") or "").strip()
    add(f"urn{i:04d}", "urn", r.get("HMIS Code"), r["ITEM DESCRIPTION"], r.get("CHI"),
        r["Price"], page=(None if pg.upper() in ("", "N/A") else pg), order=i)
for i, r in enumerate(sheet("5"), 1):          # Vaults
    raw = (r.get("PRICE") or "").strip()
    add(f"vlt{i:04d}", "vault", r.get("HMIS CODE"), r["ITEM DESCRIPTION"], r.get("CHI"),
        r["PRICE"], variant=r.get("TYPE"), dims=r.get("DIMENSIONS (OD)"),
        note=(f"source price cell read: {raw}" if num(raw) is None else None), order=i)
    if num(raw) is None: notes.append(f"Vaults: '{r['ITEM DESCRIPTION']}' price cell is {raw!r} -> seeded as 0")

W("-- ─── Products (shared catalogue — image_url left null for later) ───")
W("insert into cemetery.products (id, category_id, hmis_code, name, name_zh, series, model,")
W("  variant, size, base_size, color, dimensions, vase_included, vase_count, catalog_page,")
W("  install_service_type_id, default_gst, default_pst, default_discountable,")
W("  notes, sort_order) values")
W(",\n".join(P))
W("  on conflict (id) do update set category_id=excluded.category_id, hmis_code=excluded.hmis_code,")
W("    name=excluded.name, name_zh=excluded.name_zh, series=excluded.series, model=excluded.model,")
W("    variant=excluded.variant, size=excluded.size, base_size=excluded.base_size,")
W("    color=excluded.color, dimensions=excluded.dimensions, vase_included=excluded.vase_included,")
W("    vase_count=excluded.vase_count, catalog_page=excluded.catalog_page,")
W("    install_service_type_id=excluded.install_service_type_id,")
W("    default_gst=excluded.default_gst, default_pst=excluded.default_pst,")
W("    default_discountable=excluded.default_discountable, notes=excluded.notes,")
W("    sort_order=excluded.sort_order, active=true;")
W("")
W("-- ─── Park products (availability + per-park price and fees) ───")
W("-- A null fee produces no quote line, exactly as the old app's `if (p > 0)` did.")
W("insert into cemetery.park_products (park_id, product_id, price, base_price, ecf_price,")
W("  install_price, sort_order) values")
W(",\n".join(PP))
W("  on conflict (park_id, product_id) do update set price=excluded.price,")
W("    base_price=excluded.base_price, ecf_price=excluded.ecf_price,")
W("    install_price=excluded.install_price, sort_order=excluded.sort_order, active=true;")
W("")
W("commit;")
W("")

path = "/home/user/Fn-app/supabase/cemetery_seed_6800.sql"
open(path, "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"wrote {path}")
print(f"  properties      {len(prop_rows)}")
print(f"  service_types   {len(st_rows)}")
print(f"  products        {len(P)}")
print(f"  park_products   {len(PP)}")
print(f"  property_types  {len(PT)}  -> {', '.join(PT)}")
if notes:
    print("\nnotes:")
    for x in notes: print("  -", x)
