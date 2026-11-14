import csv, io, os, re, subprocess
SH="/var/lib/postgresql/cemseed/sheets"; PGDATA="/var/lib/postgresql/cemval"
def sheet(fid):
    fn=[f for f in os.listdir(SH) if f.startswith(fid+"_")][0]
    rows=list(csv.DictReader(io.StringIO(open(os.path.join(SH,fn),encoding="utf-8").read())))
    return [r for r in rows if any((v or "").strip() for v in r.values())]
def num(v):
    s=re.sub(r"[^0-9.]","",str(v or ""))
    if s in ("","."): return None
    try: return float(s)
    except: return None
def psql(sql):
    r=subprocess.run(["su","postgres","-s","/bin/bash","-c",
        f'psql -h {PGDATA} -d postgres -tAF"\t" -c {sql!r}'],capture_output=True,text=True)
    return [l.split("\t") for l in r.stdout.strip().split("\n") if l]

db={r[0]:r for r in psql("select pp.product_id, p.name, pp.price, coalesce(pp.base_price,0), coalesce(pp.install_price,0), coalesce(pp.ecf_price,0) from cemetery.park_products pp join cemetery.products p on p.id=pp.product_id")}
dbp={r[0]:r for r in psql("select id, name, price, coalesce(ecf_price,0), ecf_included from cemetery.properties")}

SPECS=[  # sheet, id-prefix, price col, base col, install col, ecf col, name col
 ("2","mkf","BRONZE PRICE","BASE PRICE","INSTALL","ECF","MARKER"),
 ("12","mku","Price",None,"Install","ECF","MARKER"),
 ("13","mkp","Price",None,"Install","ECF","MARKER"),
 ("7","mkt","BRONZE PRICE",None,"INSTALL","ECF","MARKER"),
 ("9","vas","PRICE",None,"INSTALL",None,"ITEM"),
 ("8","por","Basic Price",None,"Setting Fee",None,"Item Description"),
 ("6","urn","Price",None,None,None,"ITEM DESCRIPTION"),
 ("5","vlt","PRICE",None,None,None,"ITEM DESCRIPTION"),
]
field_err=[]; total_mismatch=[]; checked=0
for fid,pre,pc,bc,ic,ec,nc in SPECS:
    for i,r in enumerate(sheet(fid),1):
        pid=f"{pre}{i:04d}"; checked+=1
        if pid not in db: field_err.append(f"{pid} MISSING from db"); continue
        _,dname,dprice,dbase,dinst,decf = db[pid]
        want={"price":num(r[pc]) or 0,
              "base": (num(r[bc]) if bc else None) or 0,
              "install":(num(r[ic]) if ic else None) or 0,
              "ecf":(num(r[ec]) if ec else None) or 0}
        got={"price":float(dprice),"base":float(dbase),"install":float(dinst),"ecf":float(decf)}
        for k in want:
            if abs(want[k]-got[k])>0.005:
                field_err.append(f"{pid} {k}: sheet={want[k]} db={got[k]}  [{r[nc][:45]}]")
        if (r[nc] or "").strip()!=dname:
            field_err.append(f"{pid} NAME: sheet={r[nc]!r} db={dname!r}")
        # reconcile against whatever total the sheet itself carries (app never used these)
        tcol=next((c for c in ("TOTAL PRICE W/ BASE","TOTAL PRICE","Total Price") if c in r),None)
        if tcol and num(r[tcol]) is not None:
            s=sum(got.values()); t=num(r[tcol])
            if abs(s-t)>0.005: total_mismatch.append((pid,r[nc][:48],s,t,round(s-t,2)))

# properties
for fid,pre,pc,ec,nc,inc in [("1","prp6800_","BASE PRICE","ECF PRICE","ITEM DESCRIPTION",False),
                             ("4","prp6800_","Price (w/ ECF)",None,"ITEM DESCRIPTION",True)]:
    off = 0 if fid=="1" else len(sheet("1"))
    for i,r in enumerate(sheet(fid),1):
        pid=f"{pre}{i+off:04d}"; checked+=1
        if pid not in dbp: field_err.append(f"{pid} MISSING"); continue
        _,dname,dprice,decf,dinc = dbp[pid]
        if abs((num(r[pc]) or 0)-float(dprice))>0.005: field_err.append(f"{pid} price sheet={r[pc]} db={dprice}")
        if ec and abs((num(r[ec]) or 0)-float(decf))>0.005: field_err.append(f"{pid} ecf sheet={r[ec]} db={decf}")
        if (dinc=="t")!=inc: field_err.append(f"{pid} ecf_included={dinc} expected {inc}")
        if (r[nc] or "").strip()!=dname: field_err.append(f"{pid} NAME sheet={r[nc]!r} db={dname!r}")
        if not inc:  # lawn crypts: base+ecf must equal the sheet's TOTAL PRICE
            s=(num(r[pc]) or 0)+(num(r[ec]) or 0); t=num(r["TOTAL PRICE"])
            if t is not None and abs(s-t)>0.005: total_mismatch.append((pid,r[nc][:48],s,t,round(s-t,2)))

print(f"rows checked: {checked}")
print(f"\n=== FIELD-LEVEL ERRORS (sheet vs database): {len(field_err)} ===")
for e in field_err[:25]: print("  !", e)
print(f"\n=== rows whose component sum != the sheet's own TOTAL column: {len(total_mismatch)} ===")
print("    (the old app never read those TOTAL columns, so these are pre-existing")
print("     inconsistencies in the source sheets, carried over untouched)")
for pid,nm,s,t,d in total_mismatch: print(f"  {pid}  {nm:<50} sum={s:>9.2f} sheet_total={t:>9.2f} diff={d:>8.2f}")
