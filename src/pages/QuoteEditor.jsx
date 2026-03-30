import { useEffect, useReducer, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PackageSelector from '../components/PackageSelector.jsx'
import ItemBrowser from '../components/ItemBrowser.jsx'
import QuoteSummary from '../components/QuoteSummary.jsx'
import CustomerForm from '../components/CustomerForm.jsx'

// ─── State management ────────────────────────────────────────────────────────

function calcTotals(items, discountType, discountValue, taxRate) {
  const subtotal = items.reduce((s, i) => s + (i.price * i.quantity), 0)
  let discountAmount = 0
  if (discountValue > 0) {
    discountAmount = discountType === 'percentage'
      ? subtotal * (discountValue / 100)
      : discountValue
  }
  const taxableAmount = subtotal - discountAmount
  const taxAmount     = taxableAmount * taxRate
  const total         = taxableAmount + taxAmount
  return { subtotal, discountAmount, taxAmount, total }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload, loaded: true }

    case 'SET_HOME':
      return { ...state, funeralHomeId: action.id, taxRate: action.taxRate, packageId: null, items: [] }

    case 'SET_PACKAGE': {
      // Replace package items; keep non-package items
      const keep     = state.items.filter(i => !i.isFromPackage)
      const newItems = action.items.map(i => ({ ...i, isFromPackage: true }))
      const items    = [...newItems, ...keep]
      const totals   = calcTotals(items, state.discountType, state.discountValue, state.taxRate)
      return { ...state, packageId: action.id, items, ...totals }
    }

    case 'CLEAR_PACKAGE': {
      const items  = state.items.filter(i => !i.isFromPackage)
      const totals = calcTotals(items, state.discountType, state.discountValue, state.taxRate)
      return { ...state, packageId: null, items, ...totals }
    }

    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.serviceItemId === action.item.serviceItemId && !i.isFromPackage)
      let items
      if (existing) {
        items = state.items.map(i =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        items = [...state.items, { ...action.item, quantity: 1, isFromPackage: false }]
      }
      const totals = calcTotals(items, state.discountType, state.discountValue, state.taxRate)
      return { ...state, items, ...totals }
    }

    case 'REMOVE_ITEM': {
      const items  = state.items.filter(i => i.id !== action.id)
      const totals = calcTotals(items, state.discountType, state.discountValue, state.taxRate)
      return { ...state, items, ...totals }
    }

    case 'CHANGE_QTY': {
      const items = action.qty < 1
        ? state.items.filter(i => i.id !== action.id)
        : state.items.map(i => i.id === action.id ? { ...i, quantity: action.qty } : i)
      const totals = calcTotals(items, state.discountType, state.discountValue, state.taxRate)
      return { ...state, items, ...totals }
    }

    case 'SET_DISCOUNT': {
      const totals = calcTotals(state.items, action.discountType, action.discountValue, state.taxRate)
      return { ...state, discountType: action.discountType, discountValue: action.discountValue, ...totals }
    }

    case 'SET_CUSTOMER':
      return { ...state, ...action.payload }

    case 'SET_STATUS':
      return { ...state, status: action.status }

    case 'SET_NOTES':
      return { ...state, notes: action.notes }

    default:
      return state
  }
}

const INIT = {
  loaded:         false,
  funeralHomeId:  null,
  packageId:      null,
  customerName:   '',
  customerEmail:  '',
  customerPhone:  '',
  deceasedName:   '',
  items:          [],
  discountType:   'percentage',
  discountValue:  0,
  discountAmount: 0,
  taxRate:        0.05,
  taxAmount:      0,
  subtotal:       0,
  total:          0,
  status:         'draft',
  notes:          '',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuoteEditor({ quoteId, onDone }) {
  const [state, dispatch] = useReducer(reducer, INIT)
  const [homes,   setHomes]   = useState([])
  const [saving,  setSaving]  = useState(false)
  const [saveErr, setSaveErr] = useState(null)
  const [tab,     setTab]     = useState('packages') // 'packages' | 'items'

  // Load funeral homes
  useEffect(() => {
    supabase.from('funeral_homes').select('id, name, tax_rate').then(({ data }) => {
      setHomes(data || [])
      if (data?.length && !quoteId) {
        dispatch({ type: 'SET_HOME', id: data[0].id, taxRate: data[0].tax_rate })
      }
    })
  }, [])

  // Load existing quote if editing
  useEffect(() => {
    if (!quoteId) { dispatch({ type: 'LOAD', payload: { loaded: true } }); return }
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
      }))
      const totals = calcTotals(items, q.discount_type, Number(q.discount_value), Number(q.tax_rate))
      dispatch({
        type: 'LOAD',
        payload: {
          funeralHomeId:  q.funeral_home_id,
          packageId:      q.package_id,
          customerName:   q.customer_name  || '',
          customerEmail:  q.customer_email || '',
          customerPhone:  q.customer_phone || '',
          deceasedName:   q.deceased_name  || '',
          discountType:   q.discount_type  || 'percentage',
          discountValue:  Number(q.discount_value),
          taxRate:        Number(q.tax_rate),
          status:         q.status,
          notes:          q.notes || '',
          items,
          ...totals,
        },
      })
    }
    load()
  }, [quoteId])

  async function save(status) {
    setSaving(true)
    setSaveErr(null)
    try {
      const quoteData = {
        funeral_home_id: state.funeralHomeId,
        package_id:      state.packageId || null,
        customer_name:   state.customerName,
        customer_email:  state.customerEmail,
        customer_phone:  state.customerPhone,
        deceased_name:   state.deceasedName,
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

      // Replace all quote_items
      await supabase.from('quote_items').delete().eq('quote_id', qid)
      if (state.items.length) {
        await supabase.from('quote_items').insert(
          state.items.map(i => ({
            quote_id:       qid,
            service_item_id: i.serviceItemId || null,
            name:           i.name,
            price:          i.price,
            quantity:       i.quantity,
            is_from_package: i.isFromPackage,
            notes:          i.notes || null,
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

  if (!state.loaded) return <div className="p-8 text-gray-400">Loading…</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary-800 text-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={onDone} className="text-primary-200 hover:text-white text-sm">
            ← Back
          </button>
          <div className="flex-1">
            <h1 className="font-bold">{quoteId ? 'Edit Quote' : 'New Quote'}</h1>
            {state.deceasedName && (
              <p className="text-primary-200 text-xs">For: {state.deceasedName}</p>
            )}
          </div>

          {/* Funeral Home Selector */}
          <select
            className="text-sm bg-primary-700 border border-primary-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            value={state.funeralHomeId || ''}
            onChange={e => {
              const home = homes.find(h => h.id === e.target.value)
              if (home) dispatch({ type: 'SET_HOME', id: home.id, taxRate: Number(home.tax_rate) })
            }}
          >
            {homes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => save('draft')}
              disabled={saving}
              className="btn-secondary text-sm py-1.5"
            >
              {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              onClick={() => save('finalized')}
              disabled={saving}
              className="btn-primary text-sm py-1.5"
            >
              Finalize
            </button>
          </div>
        </div>
        {saveErr && (
          <div className="bg-red-600 text-white text-sm px-4 py-2">Error: {saveErr}</div>
        )}
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left column: Customer + Packages/Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Customer Info */}
          <CustomerForm
            values={{
              deceasedName:  state.deceasedName,
              customerName:  state.customerName,
              customerEmail: state.customerEmail,
              customerPhone: state.customerPhone,
              notes:         state.notes,
            }}
            onChange={payload => dispatch({ type: 'SET_CUSTOMER', payload })}
            onNotes={notes => dispatch({ type: 'SET_NOTES', notes })}
          />

          {/* Tabs: Packages / Items */}
          {state.funeralHomeId && (
            <div className="card overflow-hidden">
              <div className="flex border-b border-gray-200">
                {['packages', 'items'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                      tab === t
                        ? 'bg-white text-primary-700 border-b-2 border-primary-700'
                        : 'text-gray-500 hover:text-gray-700 bg-gray-50'
                    }`}
                  >
                    {t === 'packages' ? 'Service Packages' : 'Individual Items'}
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

        {/* Right column: Quote Summary */}
        <div className="lg:col-span-1">
          <QuoteSummary
            items={state.items}
            subtotal={state.subtotal}
            discountType={state.discountType}
            discountValue={state.discountValue}
            discountAmount={state.discountAmount}
            taxRate={state.taxRate}
            taxAmount={state.taxAmount}
            total={state.total}
            status={state.status}
            onRemove={id => dispatch({ type: 'REMOVE_ITEM', id })}
            onChangeQty={(id, qty) => dispatch({ type: 'CHANGE_QTY', id, qty })}
            onDiscount={(discountType, discountValue) =>
              dispatch({ type: 'SET_DISCOUNT', discountType, discountValue })
            }
          />
        </div>
      </div>
    </div>
  )
}
