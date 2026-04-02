import { useEffect, useReducer, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PackageSelector from '../components/PackageSelector.jsx'
import ItemBrowser from '../components/ItemBrowser.jsx'
import QuoteSummary from '../components/QuoteSummary.jsx'
import CustomerForm from '../components/CustomerForm.jsx'
import PrintView from '../components/PrintView.jsx'

const GST_RATE = 0.05
const PST_RATE = 0.07

function generateQuoteNumber() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const rand = String(Math.floor(Math.random() * 900) + 100)
  return `Q-${date}-${rand}`
}

// ─── Totals ───────────────────────────────────────────────────────────────────

function calcTotals(items, discountType, discountValue) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  let discountAmount = 0
  if (Number(discountValue) > 0) {
    discountAmount = discountType === 'percentage'
      ? subtotal * (Number(discountValue) / 100)
      : Math.min(Number(discountValue), subtotal)
  }

  const factor    = subtotal > 0 ? (subtotal - discountAmount) / subtotal : 1
  const gstBase   = items.filter(i => i.gst !== false).reduce((s, i) => s + i.price * i.quantity, 0)
  const pstBase   = items.filter(i => i.pst === true).reduce((s, i) => s + i.price * i.quantity, 0)
  const gstAmount = gstBase * factor * GST_RATE
  const pstAmount = pstBase * factor * PST_RATE
  const taxAmount = gstAmount + pstAmount
  const total     = subtotal - discountAmount + taxAmount

  return { subtotal, discountAmount, gstAmount, pstAmount, taxAmount, total }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function freshItem(item) {
  return { ...item, id: crypto.randomUUID(), gst: true, pst: false }
}

function reducer(state, action) {
  switch (action.type) {

    case 'LOAD':
      return { ...state, ...action.payload, loaded: true }

    case 'SET_HOME':
      return { ...state, funeralHomeId: action.id, taxRate: action.taxRate, packageId: null, items: [] }

    case 'SET_PACKAGE': {
      const keep  = state.items.filter(i => !i.isFromPackage)
      const items = [
        ...action.items.map(i => freshItem({ ...i, isFromPackage: true })),
        ...keep,
      ]
      return { ...state, packageId: action.id, items, ...calcTotals(items, state.discountType, state.discountValue) }
    }

    case 'CLEAR_PACKAGE': {
      const items = state.items.filter(i => !i.isFromPackage)
      return { ...state, packageId: null, items, ...calcTotals(items, state.discountType, state.discountValue) }
    }

    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.serviceItemId === action.item.serviceItemId && !i.isFromPackage)
      const items = existing
        ? state.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, freshItem({ ...action.item, quantity: 1, isFromPackage: false })]
      return { ...state, items, ...calcTotals(items, state.discountType, state.discountValue) }
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.id !== action.id)
      return { ...state, items, ...calcTotals(items, state.discountType, state.discountValue) }
    }

    case 'CHANGE_QTY': {
      const items = action.qty < 1
        ? state.items.filter(i => i.id !== action.id)
        : state.items.map(i => i.id === action.id ? { ...i, quantity: action.qty } : i)
      return { ...state, items, ...calcTotals(items, state.discountType, state.discountValue) }
    }

    case 'TOGGLE_TAX': {
      const items = state.items.map(i => i.id === action.id ? { ...i, ...action.taxes } : i)
      return { ...state, items, ...calcTotals(items, state.discountType, state.discountValue) }
    }

    case 'SET_DISCOUNT': {
      const totals = calcTotals(state.items, action.discountType, action.discountValue)
      return { ...state, discountType: action.discountType, discountValue: action.discountValue, ...totals }
    }

    case 'SET_CUSTOMER': return { ...state, ...action.payload }
    case 'SET_STATUS':   return { ...state, status: action.status }
    case 'SET_NOTES':    return { ...state, notes: action.notes }

    default: return state
  }
}

const INIT = {
  loaded:         false,
  funeralHomeId:  null,
  packageId:      null,
  quoteNumber:    '',
  customerName:   '',
  customerEmail:  '',
  customerPhone:  '',
  deceasedName:   '',
  advisorName:    '',
  advisorEmail:   '',
  items:          [],
  discountType:   'percentage',
  discountValue:  0,
  discountAmount: 0,
  taxRate:        0.05,
  gstAmount:      0,
  pstAmount:      0,
  taxAmount:      0,
  subtotal:       0,
  total:          0,
  status:         'draft',
  notes:          '',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuoteEditor({ quoteId, onDone }) {
  const [state, dispatch] = useReducer(reducer, INIT)
  const [homes,     setHomes]     = useState([])
  const [saving,    setSaving]    = useState(false)
  const [saveErr,   setSaveErr]   = useState(null)
  const [tab,       setTab]       = useState('packages')
  const [showPrint, setShowPrint] = useState(false)

  useEffect(() => {
    supabase
      .from('funeral_homes')
      .select('id, name, tax_rate, address, phone, website')
      .then(({ data }) => {
        setHomes(data || [])
        if (data?.length && !quoteId)
          dispatch({ type: 'SET_HOME', id: data[0].id, taxRate: Number(data[0].tax_rate) })
      })
  }, [])

  useEffect(() => {
    if (!quoteId) { dispatch({ type: 'LOAD', payload: { loaded: true, quoteNumber: generateQuoteNumber() } }); return }
    async function load() {
      const [{ data: q }, { data: qi }] = await Promise.all([
        supabase.from('quotes').select('*').eq('id', quoteId).single(),
        supabase.from('quote_items').select('*').eq('quote_id', quoteId).order('created_at'),
      ])
      if (!q) return
      const items = (qi || []).map(i => ({
        id:            i.id,
        serviceItemId: i.service_item_id,
        name:          i.name,
        price:         Number(i.price),
        quantity:      i.quantity,
        isFromPackage: i.is_from_package,
        notes:         i.notes,
        gst:           i.is_gst  ?? true,
        pst:           i.is_pst  ?? false,
      }))
      dispatch({
        type: 'LOAD',
        payload: {
          funeralHomeId:  q.funeral_home_id,
          packageId:      q.package_id,
          quoteNumber:    q.quote_number   || generateQuoteNumber(),
          customerName:   q.customer_name  || '',
          customerEmail:  q.customer_email || '',
          customerPhone:  q.customer_phone || '',
          deceasedName:   q.deceased_name  || '',
          advisorName:    q.advisor_name   || '',
          advisorEmail:   q.advisor_email  || '',
          discountType:   q.discount_type  || 'percentage',
          discountValue:  Number(q.discount_value),
          taxRate:        Number(q.tax_rate),
          status:         q.status,
          notes:          q.notes || '',
          items,
          ...calcTotals(items, q.discount_type, Number(q.discount_value)),
        },
      })
    }
    load()
  }, [quoteId])

  async function save(status) {
    setSaving(true); setSaveErr(null)
    try {
      const quoteData = {
        funeral_home_id: state.funeralHomeId,
        package_id:      state.packageId || null,
        quote_number:    state.quoteNumber || generateQuoteNumber(),
        customer_name:   state.customerName,
        customer_email:  state.customerEmail,
        customer_phone:  state.customerPhone,
        deceased_name:   state.deceasedName,
        advisor_name:    state.advisorName,
        advisor_email:   state.advisorEmail,
        subtotal:        state.subtotal,
        discount_type:   state.discountType,
        discount_value:  state.discountValue,
        discount_amount: state.discountAmount,
        tax_rate:        state.taxRate,
        tax_amount:      state.taxAmount,
        total:           state.total,
        status:          status || state.status,
        notes:           state.notes,
      }
      let qid = quoteId
      if (quoteId) {
        await supabase.from('quotes').update(quoteData).eq('id', quoteId)
      } else {
        const { data } = await supabase.from('quotes').insert(quoteData).select('id').single()
        qid = data.id
      }
      await supabase.from('quote_items').delete().eq('quote_id', qid)
      if (state.items.length) {
        await supabase.from('quote_items').insert(
          state.items.map(i => ({
            quote_id:        qid,
            service_item_id: i.serviceItemId || null,
            name:            i.name,
            price:           i.price,
            quantity:        i.quantity,
            is_from_package: i.isFromPackage,
            is_gst:          i.gst !== false,
            is_pst:          i.pst === true,
            notes:           i.notes || null,
          }))
        )
      }
      if (status) dispatch({ type: 'SET_STATUS', status })
      onDone()
    } catch (e) {
      setSaveErr(e.message)
    }
    setSaving(false)
  }

  const currentHome = homes.find(h => h.id === state.funeralHomeId) || null

  if (!state.loaded) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading…</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-primary-800 text-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={onDone}
            className="text-primary-300 hover:text-white text-sm transition-colors shrink-0"
          >
            ← Back
          </button>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">
              {quoteId ? 'Edit Quote' : 'New Quote'}
            </p>
            {state.deceasedName && (
              <p className="text-primary-300 text-xs truncate leading-tight">{state.deceasedName}</p>
            )}
          </div>

          <select
            className="text-xs bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white
                       focus:outline-none focus:ring-2 focus:ring-white/30 max-w-[200px] truncate"
            value={state.funeralHomeId || ''}
            onChange={e => {
              const home = homes.find(h => h.id === e.target.value)
              if (home) dispatch({ type: 'SET_HOME', id: home.id, taxRate: Number(home.tax_rate) })
            }}
          >
            {homes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowPrint(true)}
              disabled={!state.items.length}
              className="text-primary-200 hover:text-white disabled:opacity-30 text-xs px-3 py-1.5
                         border border-white/20 rounded-lg transition-colors"
            >
              Print
            </button>
            <button
              onClick={() => save('draft')}
              disabled={saving}
              className="btn-secondary text-xs py-1.5"
            >
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              onClick={() => save('finalized')}
              disabled={saving}
              className="btn-primary text-xs py-1.5 bg-white text-primary-800 hover:bg-stone-100"
            >
              Finalize
            </button>
          </div>
        </div>
        {saveErr && (
          <div className="bg-red-600 text-white text-xs px-4 py-2">Error: {saveErr}</div>
        )}
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-5 grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 flex flex-col gap-4">
          <CustomerForm
            values={{
              deceasedName:  state.deceasedName,
              customerName:  state.customerName,
              customerEmail: state.customerEmail,
              customerPhone: state.customerPhone,
              advisorName:   state.advisorName,
              advisorEmail:  state.advisorEmail,
              notes:         state.notes,
            }}
            onChange={payload => dispatch({ type: 'SET_CUSTOMER', payload })}
            onNotes={notes => dispatch({ type: 'SET_NOTES', notes })}
          />

          {state.funeralHomeId && (
            <div className="card overflow-hidden">
              <div className="flex border-b border-stone-100 bg-stone-50/80">
                {[
                  { key: 'packages', label: 'Service Packages' },
                  { key: 'items',    label: 'Individual Items'  },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      tab === key
                        ? 'bg-white text-primary-700 border-b-2 border-primary-600 -mb-px'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {tab === 'packages' && (
                  <PackageSelector
                    funeralHomeId={state.funeralHomeId}
                    selectedId={state.packageId}
                    onSelect={(id, items) => dispatch({ type: 'SET_PACKAGE', id, items })}
                    onClear={() => dispatch({ type: 'CLEAR_PACKAGE' })}
                  />
                )}
                {tab === 'items' && (
                  <ItemBrowser
                    funeralHomeId={state.funeralHomeId}
                    onAdd={item => dispatch({ type: 'ADD_ITEM', item })}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <QuoteSummary
            items={state.items}
            subtotal={state.subtotal}
            discountType={state.discountType}
            discountValue={state.discountValue}
            discountAmount={state.discountAmount}
            gstAmount={state.gstAmount}
            pstAmount={state.pstAmount}
            total={state.total}
            status={state.status}
            onRemove={id => dispatch({ type: 'REMOVE_ITEM', id })}
            onChangeQty={(id, qty) => dispatch({ type: 'CHANGE_QTY', id, qty })}
            onDiscount={(t, v) => dispatch({ type: 'SET_DISCOUNT', discountType: t, discountValue: v })}
            onToggleTax={(id, taxes) => dispatch({ type: 'TOGGLE_TAX', id, taxes })}
            onPrint={() => setShowPrint(true)}
          />
        </div>
      </div>

      {showPrint && (
        <PrintView home={currentHome} state={state} onClose={() => setShowPrint(false)} />
      )}
    </div>
  )
}
