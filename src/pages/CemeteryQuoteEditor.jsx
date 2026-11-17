import { useEffect, useMemo, useRef, useState } from 'react'
import CemeteryCatalog   from '../components/cemetery/CemeteryCatalog.jsx'
import CemeteryLineTable from '../components/cemetery/CemeteryLineTable.jsx'
import CemeteryReview    from '../components/cemetery/CemeteryReview.jsx'
import { fetchCatalog, fetchQuote, saveQuote, fromDbQuote } from '../lib/cemetery.js'
import {
  calcCemeteryTotals, linesForProperty, linesForProduct, linesForService,
  customLine, processingFeeLine, removeLine, setQuantity,
  defaultDeposit, monthlyPayment, paymentPlanSummary,
} from '../lib/cemeteryTotals.js'

const MS = 'Merchandise and Services'
const TERMS_EN = 'Prices are subject to change without further notice.'
const TERMS_ZH = '價格如有變更，恕不另行通知。'

function fmt(n) {
  return `$${Number(n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`
}

export default function CemeteryQuoteEditor({ park, advisor, quoteId, onBack, onSaved, onCompare }) {
  const [catalog, setCatalog] = useState({ properties: [], products: [], services: [] })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [saving,  setSaving]  = useState(false)
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
    isChineseEnabled: false,
    terms:  TERMS_EN,
    notes:  '',
    imageUrl: null,
    imageHeight: 320,
    status: 'draft',
    isTemplate: false,
    templateName: '',
  }))
  const [depositManual, setDepositManual] = useState(false)
  const imageInput = useRef(null)

  const showChinese = q.isChineseEnabled

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
          setQ(prev => ({ ...prev, ...fromDbQuote(rest) }))
          setLines(items)
          setDepositManual(true)
        }
      } catch (e) {
        if (alive) setError(e.message || String(e))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [park.id, quoteId])

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

  function toggleChinese(on) {
    setQ(p => ({
      ...p,
      isChineseEnabled: on,
      terms: on
        ? (p.terms === TERMS_EN || !p.terms.trim() ? TERMS_ZH : p.terms)
        : (p.terms === TERMS_ZH || !p.terms.trim() ? TERMS_EN : p.terms),
    }))
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
  async function save({ asTemplate = false } = {}) {
    let templateName = q.templateName
    if (asTemplate) {
      templateName = window.prompt('Name for this template:', templateName || q.clientName || '')
      if (!templateName) return
    }
    setSaving(true); setError('')
    try {
      const id = await saveQuote({
        ...q,
        depositAmount: deposit,
        monthlyPaymentAmount: monthly,
        totals,
        isTemplate: asTemplate || q.isTemplate,
        templateName,
      }, lines, advisor?.userId)
      setQ(p => ({ ...p, id, isTemplate: asTemplate || p.isTemplate, templateName }))
      onSaved?.(id)
    } catch (e) {
      setError(e.message || String(e))
    } finally {
      setSaving(false)
    }
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
          <button onClick={() => toggleChinese(!showChinese)} className="btn-secondary text-xs">
            {showChinese ? 'English' : '中文'}
          </button>
          <button onClick={() => setReview(true)} className="btn-secondary text-xs">
            {showChinese ? '預覽' : 'Review'}
          </button>
          {onCompare && (
            <button onClick={onCompare} className="btn-secondary text-xs">
              {showChinese ? '對比' : 'Compare'}
            </button>
          )}
          <button onClick={() => save({ asTemplate: true })} disabled={saving} className="btn-secondary text-xs">
            {showChinese ? '儲存為範本' : 'Save as template'}
          </button>
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

            {/* Client */}
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
