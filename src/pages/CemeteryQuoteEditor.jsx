import { useEffect, useMemo, useRef, useState } from 'react'
import CemeteryCatalog   from '../components/cemetery/CemeteryCatalog.jsx'
import CemeteryLineTable from '../components/cemetery/CemeteryLineTable.jsx'
import CemeteryReview    from '../components/cemetery/CemeteryReview.jsx'
import {
  fetchCatalog, fetchQuote, saveQuote, fromDbQuote,
  addOptionToFamily, saveAsTemplate, fetchQuotes,
} from '../lib/cemetery.js'
import { useChineseMode } from '../lib/useChineseMode.js'
import {
  calcCemeteryTotals, linesForProperty, linesForProduct, linesForService,
  customLine, processingFeeLine, removeLine, setQuantity,
  defaultDeposit, monthlyPayment, paymentPlanSummary,
} from '../lib/cemeteryTotals.js'

const MS = 'Merchandise and Services'
import { DEFAULT_TERMS_EN } from '../lib/cemeteryTerms.js'

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function CemeteryQuoteEditor({ park, advisor, quoteId, onBack, onSaved, onCompare, onOpenQuote }) {
  const [catalog, setCatalog] = useState({ properties: [], products: [], services: [] })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [saving,  setSaving]  = useState(false)
  const [notice,  setNotice]  = useState('')
  const [review,  setReview]  = useState(false)
  const [showHmis, setShowHmis] = useState(false)

  const [lines, setLines] = useState(() => [processingFeeLine()])
  const [q, setQ] = useState(() => ({
    id: null,
    parkId:        park.id,
    clientName:    '',
    clientEmail:   '',
    clientPhone:   '',
    advisorName:   advisor?.name  || '',
    advisorEmail:  advisor?.email || '',
    advisorPhone:  advisor?.phone || '',
    discountPercent:   0,
    manualWaiveAmount: 0,
    manualWaiveName:   'Miscellaneous Waived',
    gstRate: Number(park.gst_rate) || 0.05,
    pstRate: Number(park.pst_rate) || 0.07,
    isMonthlyPaymentEnabled: false,
    depositAmount:  0,
    interestRate:   0,
    paymentMonths:  60,
    terms:  DEFAULT_TERMS_EN,
    notes:  '',
    imageUrl: null,
    imageHeight: 320,
    status: 'draft',
    contactId: null,
    versionLabel: '',
    sortOrder: 0,
    isTemplate: false,
    templateName: '',
  }))
  const [depositManual, setDepositManual] = useState(false)
  const imageInput = useRef(null)

  // The other options in this family, so you can move between them without
  // going back to the list; and the templates, so a quote can be started
  // from one here rather than only from the Templates tab.
  const [siblings,  setSiblings]  = useState([])
  const [templates, setTemplates] = useState([])
  const [menu,      setMenu]      = useState(null)   // 'add' | 'template'

  // Switching options or loading a template throws away unsaved work, so
  // track whether there is any.
  const [dirty, setDirty] = useState(false)
  const hydrating = useRef(true)

  // Language is a VIEWING preference, shared with the funeral portal and with
  // the review and comparison screens — not a property of the saved quote.
  // Saving it per quote meant two quotes could be stored in different
  // languages and had to be edited one at a time before they could be
  // compared.
  const [showChinese, setShowChinese] = useChineseMode()

  // ── Load catalogue (and an existing quote) ────────────────────────────────
  useEffect(() => {
    let alive = true
    setLoading(true); setError('')
    ;(async () => {
      try {
        const cat = await fetchCatalog(park)
        if (!alive) return
        setCatalog(cat)
        if (quoteId) {
          const loaded = await fetchQuote(quoteId)
          if (!alive) return
          const { items, ...rest } = loaded
          const q0 = fromDbQuote(rest)
          setQ(prev => ({ ...prev, ...q0 }))
          setLines(items)
          setDepositManual(true)
          if (q0.contactId) {
            const fam = await fetchQuotes({ parkId: park.id, contactId: q0.contactId })
            if (alive) setSiblings(fam)
          }
        }
        const tpl = await fetchQuotes({ parkId: park.id, templates: true })
        if (alive) setTemplates(tpl)
      } catch (e) {
        if (alive) setError(e.message || String(e))
      } finally {
        if (alive) {
          setLoading(false)
          setDirty(false)
          // let the next real edit mark the quote dirty
          setTimeout(() => { hydrating.current = false }, 0)
        }
      }
    })()
    hydrating.current = true
    return () => { alive = false }
  }, [park.id, quoteId])

  useEffect(() => {
    if (hydrating.current) return
    setDirty(true)
  }, [lines, q])

  /**
   * Re-read the family's options. Called after adding one so the switcher
   * updates in place, rather than relying on the parent navigating — if that
   * wiring is ever missing again, the list is still right.
   */
  async function refreshSiblings(contactId) {
    const cid = contactId || q.contactId
    if (!cid) return
    try {
      const fam = await fetchQuotes({ parkId: park.id, contactId: cid })
      setSiblings(fam)
    } catch { /* the switcher just keeps what it had */ }
  }

  function confirmDiscard(what) {
    if (!dirty) return true
    return window.confirm(
      showChinese
        ? `尚未儲存的修改將會遺失，確定要${what}嗎？`
        : `You have unsaved changes. They will be lost if you ${what}. Continue?`)
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const totals = useMemo(() => calcCemeteryTotals(lines, {
    discountPercent:   q.discountPercent,
    manualWaiveAmount: q.manualWaiveAmount,
    gstRate: q.gstRate,
    pstRate: q.pstRate,
  }), [lines, q.discountPercent, q.manualWaiveAmount, q.gstRate, q.pstRate])

  const netByLine = useMemo(() => {
    const m = {}
    lines.forEach((l, i) => { m[l.id] = totals.lines[i]?.net })
    return m
  }, [lines, totals])

  // Deposit follows the total until the advisor edits it, matching the old app.
  const deposit = depositManual ? q.depositAmount : defaultDeposit(totals.grandTotal)
  const monthly = monthlyPayment({
    grandTotal:    totals.grandTotal,
    depositAmount: deposit,
    interestRate:  q.interestRate,
    paymentMonths: q.paymentMonths,
  })
  const plan = paymentPlanSummary({
    grandTotal: totals.grandTotal, depositAmount: deposit,
    interestRate: q.interestRate, paymentMonths: q.paymentMonths,
  })

  // An option is named after the property on it unless the advisor renames it.
  const propertyName = lines.find(l => l.section === 'Property' && !l.parentItemId)?.name || ''
  const effectiveLabel = q.versionLabel || propertyName

  // ── Line operations ───────────────────────────────────────────────────────
  const add = next => setLines(ls => [...ls, ...next])

  function handleToggle(id, field) {
    setLines(ls => ls.map(l => l.id !== id ? l : {
      ...l,
      [field]: field === 'isDiscountable' ? !l.isDiscountable : !l[field],
    }))
  }

  function handleMove(id, dir) {
    setLines(ls => {
      const idx = ls.findIndex(l => l.id === id)
      if (idx < 0) return ls
      const section = ls[idx].section
      const sameIdx = ls.map((l, i) => ({ l, i })).filter(x => x.l.section === section)
      const posIn   = sameIdx.findIndex(x => x.i === idx)
      const target  = sameIdx[posIn + dir]
      if (!target) return ls
      const out = [...ls]
      ;[out[idx], out[target.i]] = [out[target.i], out[idx]]
      return out
    })
  }

  function onImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setQ(p => ({ ...p, imageUrl: ev.target?.result, imageHeight: p.imageHeight || 320 }))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function save() {
    setSaving(true); setError('')
    try {
      // Settle the family id BEFORE saving and keep the same value in state.
      // Generating it inline meant the database got one and the editor kept
      // null, so the next save minted another and orphaned any sibling
      // options this quote already had.
      const contactId = q.contactId || crypto.randomUUID()
      const id = await saveQuote({
        ...q,
        contactId,
        versionLabel: effectiveLabel,
        depositAmount: deposit,
        monthlyPaymentAmount: monthly,
        totals,
      }, lines, advisor?.userId)
      setQ(p => ({ ...p, id, contactId, versionLabel: effectiveLabel }))
      setDirty(false)
      onSaved?.(id)
      setNotice(showChinese ? '已儲存' : 'Saved')
      return id
    } catch (e) {
      setError(e.message || String(e))
      return null
    } finally { setSaving(false) }
  }

  /** Save a COPY as a template. The quote stays a quote. */
  async function saveTemplate() {
    const name = window.prompt('Name for this template:', propertyName || '')
    if (!name) return
    setSaving(true); setError('')
    try {
      await saveAsTemplate({ ...q, depositAmount: deposit, totals }, lines, advisor?.userId, name)
      setNotice(showChinese ? `已另存為範本「${name}」` : `Saved a template called "${name}"`)
    } catch (e) {
      setError(e.message || String(e))
    } finally { setSaving(false) }
  }

  /**
   * Another option for the same family — what a comparison compares.
   * `blank` starts from nothing rather than a copy of this one, because a
   * second option is often a different approach, not a tweak of the first.
   */
  async function addOption(blank) {
    setMenu(null)
    setSaving(true); setError('')
    try {
      // The current option has to exist before it can have a sibling.
      let id = q.id
      if (!id || dirty) {
        const contactId = q.contactId || crypto.randomUUID()
        id = await saveQuote({
          ...q, id, contactId, versionLabel: effectiveLabel,
          depositAmount: deposit, monthlyPaymentAmount: monthly, totals,
        }, lines, advisor?.userId)
        setQ(p => ({ ...p, id, contactId }))
      }
      const newId = await addOptionToFamily(id, advisor?.userId, { blank })
      await refreshSiblings(q.contactId)
      setNotice(showChinese ? '已新增方案' : 'Option added')
      onOpenQuote?.(newId)
    } catch (e) {
      setError(e.message || String(e))
    } finally { setSaving(false) }
  }

  /** Replace this option's contents with a template's. */
  async function useTemplate(t) {
    setMenu(null)
    if (!confirmDiscard(showChinese ? '載入範本' : 'load a template')) return
    setSaving(true); setError('')
    try {
      const loaded = await fetchQuote(t.id)
      const { items, ...rest } = loaded
      const tq = fromDbQuote(rest)
      // Take the contents and the money settings; keep who this quote is for.
      setLines(items)
      setQ(p => ({
        ...p,
        discountPercent: tq.discountPercent,
        manualWaiveAmount: tq.manualWaiveAmount,
        manualWaiveName: tq.manualWaiveName,
        isMonthlyPaymentEnabled: tq.isMonthlyPaymentEnabled,
        interestRate: tq.interestRate,
        paymentMonths: tq.paymentMonths,
        terms: tq.terms || p.terms,
      }))
      setNotice(showChinese ? `已載入範本「${t.template_name}」` : `Loaded template "${t.template_name}"`)
    } catch (e) {
      setError(e.message || String(e))
    } finally { setSaving(false) }
  }

  function switchOption(id) {
    if (id === q.id) return
    if (!confirmDiscard(showChinese ? '切換方案' : 'switch options')) return
    onOpenQuote?.(id)
  }

  if (review) {
    return (
      <CemeteryReview
        park={park}
        quote={{ ...q, depositAmount: deposit, monthlyPaymentAmount: monthly }}
        lines={lines}
        totals={totals}
        plan={plan}
        onClose={() => setReview(false)}
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onBack} className="btn-ghost">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          {showChinese ? '返回' : 'Back'}
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-stone-500 mr-1">
            <input type="checkbox" checked={showHmis} onChange={e => setShowHmis(e.target.checked)}
                   className="w-4 h-4 rounded text-primary-600" />
            HMIS
          </label>
          <button onClick={() => setShowChinese(!showChinese)} className="btn-secondary text-xs">
            {showChinese ? 'English' : '中文'}
          </button>
          <button onClick={() => setReview(true)} className="btn-secondary text-xs">
            {showChinese ? '預覽' : 'Review'}
          </button>
          {onCompare && (
            // Pass the family, not the click event — comparing is scoped to
            // this quote's family.
            <button onClick={() => onCompare(q.contactId)}
                    disabled={!q.contactId}
                    title={q.contactId ? undefined
                      : (showChinese ? '請先儲存報價' : 'Save the quote first')}
                    className="btn-secondary text-xs disabled:opacity-40">
              {showChinese ? '對比' : 'Compare'}
            </button>
          )}
          {/* Add option — copy this one, or start from nothing */}
          <Menu open={menu === 'add'}
                onToggle={() => setMenu(m => (m === 'add' ? null : 'add'))}
                label={showChinese ? '新增方案' : 'Add option'} disabled={saving}>
            <MenuItem onClick={() => addOption(false)}
                      title={showChinese ? '複製此方案' : 'Copy this option'}
                      hint={showChinese ? '以目前內容為基礎' : 'Start from what is here now'} />
            <MenuItem onClick={() => addOption(true)}
                      title={showChinese ? '建立空白方案' : 'Start blank'}
                      hint={showChinese ? '只保留客戶資料' : 'Keep the client, drop the items'} />
          </Menu>

          {/* Pull from a template without leaving the builder */}
          <Menu open={menu === 'template'}
                onToggle={() => setMenu(m => (m === 'template' ? null : 'template'))}
                label={showChinese ? '範本' : 'Template'} disabled={saving}>
            {templates.length === 0 ? (
              <p className="px-3 py-2 text-xs text-stone-400">
                {showChinese ? '尚無範本' : 'No templates saved yet'}
              </p>
            ) : templates.map(t => (
              <MenuItem key={t.id} onClick={() => useTemplate(t)}
                        title={t.template_name || 'Untitled'}
                        hint={showChinese ? '載入此範本的項目' : 'Load this template\u2019s items'} />
            ))}
            <div className="border-t border-stone-100 mt-1 pt-1">
              <MenuItem onClick={saveTemplate}
                        title={showChinese ? '另存為範本' : 'Save as template'}
                        hint={showChinese ? '不會更動此報價' : 'Saves a copy; this quote is untouched'} />
            </div>
          </Menu>
          <button onClick={() => save()} disabled={saving} className="btn-primary text-xs">
            {saving ? (showChinese ? '儲存中…' : 'Saving…') : (showChinese ? '儲存報價' : 'Save quote')}
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-3 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {/* Options in this family — switch without going back to the list */}
      {siblings.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            {showChinese ? '方案' : 'Options'}
          </span>
          {siblings.map((s2, i) => {
            const active = s2.id === q.id
            return (
              <button key={s2.id} onClick={() => switchOption(s2.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                  active ? 'border-primary-300 bg-primary-50 text-primary-700'
                         : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle ${
                  active ? 'bg-primary-500' : 'bg-stone-300'}`} />
                {s2.version_label || `${showChinese ? '方案' : 'Option'} ${i + 1}`}
                {active && <span className="ml-1.5 text-[10px] opacity-60">
                  {showChinese ? '編輯中' : 'editing'}</span>}
              </button>
            )
          })}
        </div>
      )}

      {notice && !error && (
        <div className="card p-3 border-emerald-200 bg-emerald-50 flex items-center gap-3">
          <p className="text-sm text-emerald-800 flex-1">{notice}</p>
          <button onClick={() => setNotice('')} className="text-emerald-600 text-lg leading-none">×</button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-stone-400 py-10 text-center">Loading catalogue…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-5 items-start">

          {/* ── Catalogue ── */}
          <aside className="card p-4 lg:sticky lg:top-6">
            <h2 className="text-sm font-semibold text-stone-700 mb-3">
              {showChinese ? '目錄' : 'Catalogue'}
            </h2>
            <CemeteryCatalog
              {...catalog}
              showChinese={showChinese}
              onAddProperty={p => add(linesForProperty(p))}
              onAddProduct={p  => add(linesForProduct(p))}
              onAddService={s  => add(linesForService(s))}
              onAddCustom={c   => add([customLine(c)])}
            />
          </aside>

          {/* ── Quote ── */}
          <div className="space-y-5 min-w-0">

            {/* Option name — the heading above this option's column in a
                comparison. Defaults to the property on the quote. */}
            <div className="card p-4">
              <label className="label">{showChinese ? '方案名稱' : 'Option name'}</label>
              <input className="input text-sm" value={q.versionLabel}
                     placeholder={propertyName || (showChinese ? '例如：企碑地' : 'e.g. Royal Plateau (Upright)')}
                     onChange={e => setQ(p => ({ ...p, versionLabel: e.target.value }))} />
              <p className="text-[11px] text-stone-400 mt-1">
                {showChinese
                  ? '留空則使用墓地名稱。此名稱只在對比時顯示。'
                  : 'Leave blank to use the property name. Shown as the column heading when comparing.'}
              </p>
            </div>

            {/* Client — kept for finding the quote later; not printed */}
            <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="label">{showChinese ? '客戶姓名' : 'Client name'}</label>
                <input className="input text-sm" value={q.clientName}
                       onChange={e => setQ(p => ({ ...p, clientName: e.target.value }))} />
              </div>
              <div>
                <label className="label">{showChinese ? '電話' : 'Phone'}</label>
                <input className="input text-sm" value={q.clientPhone}
                       onChange={e => setQ(p => ({ ...p, clientPhone: e.target.value }))} />
              </div>
              <div>
                <label className="label">{showChinese ? '電郵' : 'Email'}</label>
                <input className="input text-sm" value={q.clientEmail}
                       onChange={e => setQ(p => ({ ...p, clientEmail: e.target.value }))} />
              </div>
            </div>

            <CemeteryLineTable
              lines={lines}
              netByLine={netByLine}
              showChinese={showChinese}
              showHmis={showHmis}
              onRemove={id => setLines(ls => removeLine(ls, id))}
              onQuantity={(id, qty) => setLines(ls => setQuantity(ls, id, qty))}
              onToggle={handleToggle}
              onMove={handleMove}
            />

            {/* Discount + totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="card p-4 space-y-3">
                <h3 className="text-sm font-semibold text-stone-700">
                  {showChinese ? '折扣及減免' : 'Discount & waive'}
                </h3>

                <div>
                  <label className="label">{showChinese ? '折扣百分比' : 'Discount %'}</label>
                  <input type="number" min="0" max="100" step="0.5" className="input text-sm"
                         value={q.discountPercent}
                         onChange={e => setQ(p => ({ ...p, discountPercent: Number(e.target.value) || 0 }))} />
                  <p className="text-[11px] text-stone-400 mt-1">
                    {showChinese
                      ? '只適用於可折扣部分；含管理基金的墓地只有 90% 可折。'
                      : 'Applies to discountable portions only; ECF-included property exposes 90%.'}
                  </p>
                </div>

                <div>
                  <label className="label">{showChinese ? '減免金額' : 'Dollar waive'}</label>
                  <input type="number" min="0" step="0.01" className="input text-sm"
                         value={totals.waiveFromLines ? totals.waiveAmount : q.manualWaiveAmount}
                         disabled={totals.waiveFromLines}
                         onChange={e => setQ(p => ({ ...p, manualWaiveAmount: Number(e.target.value) || 0 }))} />
                  <input className="input text-sm mt-2" placeholder="Waive label"
                         value={q.manualWaiveName}
                         onChange={e => setQ(p => ({ ...p, manualWaiveName: e.target.value }))} />
                  {totals.waiveFromLines && (
                    <p className="text-[11px] text-amber-700 mt-1">
                      {showChinese
                        ? '已有個別項目標記減免，此金額由該等項目決定。'
                        : 'Lines are individually waived, so this figure comes from them.'}
                    </p>
                  )}
                  {!totals.waiveFromLines && totals.unallocatedWaive > 0 && (
                    <p className="text-[11px] text-amber-700 mt-1">
                      {fmt(totals.unallocatedWaive)} of the waive exceeds the quote and was not applied.
                    </p>
                  )}
                </div>
              </div>

              <div className="card p-4">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">
                  {showChinese ? '總計' : 'Totals'}
                </h3>
                <dl className="space-y-1.5 text-sm">
                  <Row label={showChinese ? '小計' : 'Subtotal'} value={fmt(totals.subtotal)} />
                  {totals.waiveAmount > 0 && (
                    <Row label={q.manualWaiveName || 'Waived'} value={`− ${fmt(totals.waiveAmount)}`} muted />
                  )}
                  {totals.percentSavings > 0 && (
                    <Row label={`${q.discountPercent}% ${showChinese ? '折扣' : 'discount'}`}
                         value={`− ${fmt(totals.percentSavings)}`} muted />
                  )}
                  <Row label={showChinese ? '稅前小計' : 'Net subtotal'} value={fmt(totals.netSubtotal)} />
                  <Row label={`GST (${(q.gstRate * 100).toFixed(0)}%)`} value={fmt(totals.gstTotal)} muted />
                  <Row label={`PST (${(q.pstRate * 100).toFixed(0)}%)`} value={fmt(totals.pstTotal)} muted />
                  <div className="pt-2 mt-1 border-t border-stone-200 flex justify-between items-baseline">
                    <dt className="text-sm font-semibold text-stone-700">
                      {showChinese ? '總額' : 'Grand total'}
                    </dt>
                    <dd className="text-xl font-bold text-primary-800">{fmt(totals.grandTotal)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Payment plan */}
            <div className="card p-4 space-y-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={q.isMonthlyPaymentEnabled}
                       onChange={e => setQ(p => ({ ...p, isMonthlyPaymentEnabled: e.target.checked }))}
                       className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm font-semibold text-stone-700">
                  {showChinese ? '分期付款計劃' : 'Monthly payment plan'}
                </span>
              </label>

              {q.isMonthlyPaymentEnabled && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="label">{showChinese ? '首期' : 'Deposit'}</label>
                      <input type="number" min="0" step="0.01" className="input text-sm"
                             value={deposit}
                             onChange={e => { setDepositManual(true); setQ(p => ({ ...p, depositAmount: Number(e.target.value) || 0 })) }} />
                      {!depositManual && (
                        <p className="text-[11px] text-stone-400 mt-1">
                          Default: 10% rounded up to $100
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="label">{showChinese ? '年利率 %' : 'Interest rate %'}</label>
                      <input type="number" min="0" step="0.01" className="input text-sm"
                             value={q.interestRate}
                             onChange={e => setQ(p => ({ ...p, interestRate: Number(e.target.value) || 0 }))} />
                    </div>
                    <div>
                      <label className="label">{showChinese ? '期數 (月)' : 'Term (months)'}</label>
                      <input type="number" min="1" step="1" className="input text-sm"
                             value={q.paymentMonths}
                             onChange={e => setQ(p => ({ ...p, paymentMonths: Number(e.target.value) || 1 }))} />
                    </div>
                  </div>

                  <div className="bg-stone-50 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <Stat label={showChinese ? '首期' : 'Deposit'}  value={fmt(plan.deposit)} />
                    <Stat label={showChinese ? '融資額' : 'Financed'} value={fmt(plan.financed)} />
                    <Stat label={showChinese ? '每月' : 'Monthly'}   value={fmt(plan.monthly)} strong />
                    <Stat label={showChinese ? '總付款' : 'Total paid'} value={fmt(plan.totalPaid)} />
                  </div>
                </>
              )}
            </div>

            {/* Image + terms */}
            <div className="card p-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => imageInput.current?.click()} className="btn-secondary text-xs">
                  {q.imageUrl
                    ? (showChinese ? '更換圖片' : 'Replace image')
                    : (showChinese ? '加入圖片' : 'Add image')}
                </button>
                {q.imageUrl && (
                  <>
                    <button onClick={() => setQ(p => ({ ...p, imageUrl: null }))} className="btn-ghost text-xs">
                      {showChinese ? '移除' : 'Remove'}
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[11px] text-stone-400">Height</span>
                      <input type="range" min="80" max="700" step="10" value={q.imageHeight || 320}
                             onChange={e => setQ(p => ({ ...p, imageHeight: Number(e.target.value) }))}
                             className="w-32" />
                    </div>
                  </>
                )}
                <input ref={imageInput} type="file" accept="image/*" onChange={onImage} className="hidden" />
              </div>

              {q.imageUrl && (
                <img src={q.imageUrl} alt="" className="rounded-lg border border-stone-200 object-contain w-full"
                     style={{ height: q.imageHeight || 320 }} />
              )}

              <div>
                <label className="label">{showChinese ? '條款' : 'Terms'}</label>
                <textarea className="input text-sm" rows={2} value={q.terms}
                          onChange={e => setQ(p => ({ ...p, terms: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Menu({ open, onToggle, label, disabled, children }) {
  return (
    <div className="relative">
      <button onClick={onToggle} disabled={disabled} className="btn-secondary text-xs">
        {label}
        <svg className="w-3 h-3 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 mt-1 z-20 w-64 card p-1 max-h-72 overflow-y-auto">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

function MenuItem({ onClick, title, hint }) {
  return (
    <button onClick={onClick}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors">
      <span className="block text-xs font-medium text-stone-700">{title}</span>
      {hint && <span className="block text-[11px] text-stone-400 mt-0.5">{hint}</span>}
    </button>
  )
}

function Row({ label, value, muted }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={muted ? 'text-stone-500' : 'text-stone-600'}>{label}</dt>
      <dd className={muted ? 'text-stone-500' : 'text-stone-800 font-medium'}>{value}</dd>
    </div>
  )
}

function Stat({ label, value, strong }) {
  return (
    <div>
      <p className="text-[11px] text-stone-400 uppercase tracking-wider">{label}</p>
      <p className={strong ? 'text-base font-bold text-primary-800' : 'text-sm font-medium text-stone-700'}>
        {value}
      </p>
    </div>
  )
}
