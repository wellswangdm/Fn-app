import { useEffect, useReducer, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import PackageSelector from '../components/PackageSelector.jsx'
import ItemBrowser from '../components/ItemBrowser.jsx'
import QuoteSummary from '../components/QuoteSummary.jsx'
import CustomerForm from '../components/CustomerForm.jsx'
import PrintView from '../components/PrintView.jsx'
import CasketPicker from '../components/CasketPicker.jsx'
import ComparisonView from '../components/ComparisonView.jsx'

const GST_RATE = 0.05
const PST_RATE = 0.07

function generateQuoteNumber() {
  const d = new Date()
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const rand = String(Math.floor(Math.random() * 900) + 100)
  return `Q-${date}-${rand}`
}

// ─── Auto-add items (added whenever any package is selected) ──────────────────

const AUTO_ADD = [
  { serviceItemId: 'si000110', name: 'Consumer Protection BC Fee', price: 48.00, gst: false, pst: false, noDisc: true },
  { serviceItemId: 'si000112', name: 'Death Certificate (each)',   price: 27.00, gst: false, pst: false, noDisc: true },
]

const CREMATORY_FEE = { serviceItemId: 'si000076', name: 'Crematory Fee', price: 995.00 }

const STATIONERY_CATEGORY_ID = 'c1000000-0000-0000-0000-000000000006'
const URN_ITEM_IDS = new Set(['si000213', 'si000214', 'si000215'])

// Items that are opt-in within a package (excluded from auto-add, user picks them in casket picker)
const OPTIONAL_ITEM_IDS = new Set(['si000042', 'si000088', 'si000207', 'si000208', 'si000209', 'si000213', 'si000214', 'si000215'])

const INIT_SECTIONS = [
  { id: 'sec-main',        name: 'Guaranteed Items' },
  { id: 'sec-third-party', name: 'Third Party Items' },
  { id: 'sec-extra',       name: 'Additional Items'  },
]

// ─── Totals ───────────────────────────────────────────────────────────────────

function calcTotals(items, packageDiscount, discountType, discountValue) {
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discBase  = items.filter(i => !i.noDisc).reduce((s, i) => s + i.price * i.quantity, 0)

  const pkgDiscAmount = Math.min(Number(packageDiscount) || 0, discBase)
  const afterPkg      = discBase - pkgDiscAmount

  let userDiscAmount = 0
  if (Number(discountValue) > 0) {
    userDiscAmount = discountType === 'percentage'
      ? afterPkg * (Number(discountValue) / 100)
      : Math.min(Number(discountValue), afterPkg)
  }

  const discountAmount = pkgDiscAmount + userDiscAmount
  const afterAll       = subtotal - discountAmount
  const discFactor     = discBase > 0 ? (discBase - discountAmount) / discBase : 1

  const gstBase = items.filter(i => i.gst !== false)
                       .reduce((s, i) => s + i.price * i.quantity * (i.noDisc ? 1 : discFactor), 0)
  const pstBase = items.filter(i => i.pst === true)
                       .reduce((s, i) => s + i.price * i.quantity * (i.noDisc ? 1 : discFactor), 0)
  const r2 = n => Math.round(n * 100) / 100
  const gstAmount = r2(gstBase * GST_RATE)
  const pstAmount = r2(pstBase * PST_RATE)
  const taxAmount = r2(gstAmount + pstAmount)
  const total     = r2(afterAll + taxAmount)

  return { subtotal: r2(subtotal), pkgDiscAmount: r2(pkgDiscAmount), userDiscAmount: r2(userDiscAmount), discountAmount: r2(discountAmount), gstAmount, pstAmount, taxAmount, total }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function defaultPst(item, arrangementType) {
  if (item.isCasketItem) return arrangementType === 'burial'
  if (URN_ITEM_IDS.has(item.serviceItemId)) return true
  if (item.categoryId === STATIONERY_CATEGORY_ID) return true
  const name = (item.name || '').toLowerCase()
  if (name.includes('flower')) return true
  return false
}

function freshItem(item, sectionId = 'sec-extra') {
  return { id: crypto.randomUUID(), gst: true, pst: false, ...item, sectionId }
}

function reducer(state, action) {
  switch (action.type) {

    case 'LOAD':
      return { ...state, ...action.payload, loaded: true }

    case 'SET_HOME':
      return { ...state, funeralHomeId: action.id, taxRate: action.taxRate,
               packageId: null, packageDiscount: 0, items: [],
               sections: INIT_SECTIONS, selectedCasket: null }

    case 'SET_ARRANGEMENT': {
      const newType = action.value
      // Update casket PST based on new arrangement type
      let items = state.items.map(i =>
        i.isCasketItem ? { ...i, pst: newType === 'burial' } : i
      )
      if (newType === 'cremation') {
        const hasCremFee = items.some(i => i.serviceItemId === CREMATORY_FEE.serviceItemId)
        if (!hasCremFee) {
          items = [...items, freshItem({ ...CREMATORY_FEE, quantity: 1, isFromPackage: false }, 'sec-main')]
        }
      }
      return { ...state, arrangementType: newType, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'SET_PACKAGE': {
      const pkgDisc = action.packageDiscount || 0
      const pkgName = action.packageName || 'Package Services'
      const keep    = state.items.filter(i => !i.isFromPackage)
      const hasCremFee = action.items.some(i => i.serviceItemId === CREMATORY_FEE.serviceItemId)
      // If package has crematory fee, remove any standalone crematory fee from keep to prevent duplicate
      const cleanKeep = hasCremFee
        ? keep.filter(k => k.serviceItemId !== CREMATORY_FEE.serviceItemId)
        : keep
      const autoToAdd = AUTO_ADD
        .filter(ai => !cleanKeep.some(k => k.serviceItemId === ai.serviceItemId))
        .map(ai => freshItem({ ...ai, quantity: 1, isFromPackage: false }, 'sec-third-party'))
      const pkgItems = action.items.map(i => freshItem({
        ...i, isFromPackage: true,
        pst: i.pst !== undefined ? i.pst : defaultPst(i, state.arrangementType),
      }, 'sec-main'))
      const cremItem = (action.addCrematoryFee && !hasCremFee && !cleanKeep.some(k => k.serviceItemId === CREMATORY_FEE.serviceItemId))
        ? freshItem({ ...CREMATORY_FEE, quantity: 1, isFromPackage: false }, 'sec-main')
        : null
      const casketItem = action.defaultCasket ? freshItem({
        serviceItemId: action.defaultCasket.id,
        name:          action.defaultCasket.name,
        price:         action.defaultCasket.price,
        quantity:      1,
        pst:           state.arrangementType === 'burial',
        isCasketItem:  true,
        isFromPackage: true,
      }, 'sec-main') : null
      const items = [
        ...pkgItems,
        ...(casketItem ? [casketItem] : []),
        ...cleanKeep.map(i => ({ ...i, sectionId: i.sectionId || 'sec-extra' })),
        ...autoToAdd,
        ...(cremItem ? [cremItem] : []),
      ]
      const selectedCasket = state.packageId === action.id
        ? state.selectedCasket
        : (action.defaultCasket || null)
      return { ...state, packageId: action.id, packageDiscount: pkgDisc, packageName: pkgName,
               items, sections: state.sections, selectedCasket,
               ...calcTotals(items, pkgDisc, state.discountType, state.discountValue) }
    }

    case 'CLEAR_PACKAGE': {
      const items = state.items.filter(i => !i.isFromPackage)
      return { ...state, packageId: null, packageDiscount: 0, packageName: '', items,
               selectedCasket: null, ...calcTotals(items, 0, state.discountType, state.discountValue) }
    }

    case 'ADD_ITEM': {
      const existing = action.item.isCustom
        ? null
        : state.items.find(i => !i.isCustom && i.serviceItemId === action.item.serviceItemId && !i.isFromPackage)
      const items = existing
        ? state.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, freshItem({ ...action.item, quantity: 1, isFromPackage: false, pst: defaultPst(action.item, state.arrangementType) }, 'sec-extra')]
      return { ...state, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.id !== action.id)
      return { ...state, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'CHANGE_QTY': {
      const items = action.qty < 1
        ? state.items.filter(i => i.id !== action.id)
        : state.items.map(i => i.id === action.id ? { ...i, quantity: action.qty } : i)
      return { ...state, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'TOGGLE_TAX': {
      const items = state.items.map(i => i.id === action.id ? { ...i, ...action.taxes } : i)
      return { ...state, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'SET_DISCOUNT': {
      const totals = calcTotals(state.items, state.packageDiscount, action.discountType, action.discountValue)
      return { ...state, discountType: action.discountType, discountValue: action.discountValue, ...totals }
    }

    case 'EDIT_ITEM': {
      const items = state.items.map(i => i.id === action.id ? { ...i, ...action.changes } : i)
      return { ...state, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'REORDER_ITEMS': {
      const items = [...state.items]
      const from  = items.findIndex(i => i.id === action.fromId)
      const to    = items.findIndex(i => i.id === action.toId)
      if (from === -1 || to === -1 || from === to) return state
      const [moved] = items.splice(from, 1)
      items.splice(to, 0, moved)
      return { ...state, items }
    }

    case 'RENAME_SECTION': {
      const sections = state.sections.map(s => s.id === action.id ? { ...s, name: action.name } : s)
      return { ...state, sections }
    }

    case 'ADD_SECTION': {
      const id = `sec-${crypto.randomUUID().slice(0, 8)}`
      return { ...state, sections: [...state.sections, { id, name: 'New Section' }] }
    }

    case 'REMOVE_SECTION': {
      if (['sec-main', 'sec-third-party', 'sec-extra'].includes(action.id)) return state
      const items    = state.items.map(i => i.sectionId === action.id ? { ...i, sectionId: 'sec-extra' } : i)
      const sections = state.sections.filter(s => s.id !== action.id)
      return { ...state, sections, items }
    }

    case 'MOVE_ITEM_SECTION': {
      const items = state.items.map(i => i.id === action.itemId ? { ...i, sectionId: action.sectionId } : i)
      return { ...state, items }
    }

    case 'PICK_CASKET': {
      const { casket } = action
      const hasCasketItem = state.items.some(i => i.isCasketItem)
      const items = hasCasketItem
        ? state.items.map(i =>
            i.isCasketItem
              ? { ...i, serviceItemId: casket.id, name: casket.name, price: casket.price, pst: state.arrangementType === 'burial' }
              : i
          )
        : [...state.items, freshItem({
            serviceItemId: casket.id,
            name:          casket.name,
            price:         casket.price,
            quantity:      1,
            pst:           state.arrangementType === 'burial',
            isCasketItem:  true,
            isFromPackage: false,
          }, 'sec-main')]
      return { ...state, items, selectedCasket: casket,
               ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'REFRESH_PRICES': {
      const items = state.items.map(i =>
        action.priceMap[i.serviceItemId] != null
          ? { ...i, price: action.priceMap[i.serviceItemId] }
          : i
      )
      return { ...state, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'SET_CUSTOMER': return { ...state, ...action.payload }
    case 'SET_STATUS':   return { ...state, status: action.status }
    case 'SET_NOTES':    return { ...state, notes: action.notes }

    default: return state
  }
}

const INIT = {
  loaded:              false,
  funeralHomeId:       null,
  packageId:           null,
  contactId:           null,
  quoteNumber:         '',
  beneficiaryName:     '',
  beneficiaryPhone:    '',
  beneficiaryEmail:    '',
  beneficiaryBirthdate: '',
  beneficiaryAddress:  '',
  purchaserDifferent:  false,
  purchaserName:       '',
  purchaserPhone:      '',
  purchaserEmail:      '',
  purchaserBirthdate:  '',
  purchaserAddress:    '',
  advisorName:     '',
  advisorEmail:    '',
  advisorPhone:    '',
  items:           [],
  sections:        INIT_SECTIONS,
  selectedCasket:  null,
  packageName:     '',
  packageDiscount: 0,
  pkgDiscAmount:   0,
  userDiscAmount:  0,
  discountType:    'percentage',
  discountValue:   0,
  discountAmount:  0,
  taxRate:         0.05,
  gstAmount:       0,
  pstAmount:       0,
  taxAmount:       0,
  subtotal:        0,
  total:           0,
  arrangementType: 'burial',
  status:          'draft',
  notes:           'Prices are subject to change without further notice.',
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuoteEditor({ quoteId, onDone, onEdit, userId, user }) {
  const [state, dispatch] = useReducer(reducer, INIT)
  const [homes,          setHomes]          = useState([])
  const [saving,         setSaving]         = useState(false)
  const [saveErr,        setSaveErr]        = useState(null)
  const [tab,            setTab]            = useState('packages')
  const [showPrint,      setShowPrint]      = useState(false)
  const [attachedImage,  setAttachedImage]  = useState(null)
  const [casketPickerOpen, setCasketPickerOpen] = useState(false)
  const [pendingOptionals, setPendingOptionals] = useState([])
  const [priceMap,        setPriceMap]        = useState(null) // { itemId -> newPrice } when stale
  const [versions,        setVersions]        = useState([])
  const [showCompare,     setShowCompare]     = useState(false)
  const [addVersionOpen,  setAddVersionOpen]  = useState(false)
  const [editingLabel,    setEditingLabel]    = useState(null) // { id, value }
  const [dragV,           setDragV]           = useState(null) // id being dragged
  const [dragOverV,       setDragOverV]       = useState(null) // id being hovered
  const [savedFlash,      setSavedFlash]      = useState(false)

  useEffect(() => {
    supabase
      .from('funeral_homes')
      .select('id, name, tax_rate, address, phone, website')
      .then(({ data, error }) => {
        if (error) console.error('funeral_homes load error:', error)
        setHomes(data || [])
        if (data?.length && !quoteId)
          dispatch({ type: 'SET_HOME', id: data[0].id, taxRate: Number(data[0].tax_rate) })
        else if (!quoteId)
          dispatch({ type: 'LOAD', payload: { loaded: true, quoteNumber: generateQuoteNumber(), contactId: crypto.randomUUID() } })
      })
  }, [])

  useEffect(() => {
    if (!quoteId) {
      // Mark loaded immediately so the form renders
      dispatch({ type: 'LOAD', payload: { loaded: true, quoteNumber: generateQuoteNumber(), contactId: crypto.randomUUID() } })
      // Then fetch profile and fill advisor fields asynchronously
      async function initAdvisor() {
        let advisorName  = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
        let advisorEmail = ''
        let advisorPhone = ''
        if (userId) {
          try {
            const timeout = new Promise((_, rej) => setTimeout(() => rej(), 4000))
            const fetch   = supabase.from('profiles').select('full_name, phone, advisor_email').eq('id', userId).single()
            const { data: profile } = await Promise.race([fetch, timeout])
            if (profile?.full_name)    advisorName  = profile.full_name
            if (profile?.phone)        advisorPhone = profile.phone
            if (profile?.advisor_email) advisorEmail = profile.advisor_email
          } catch {}
        }
        dispatch({ type: 'SET_CUSTOMER', payload: { advisorName, advisorEmail, advisorPhone } })
      }
      initAdvisor()
      return
    }
    async function load() {
      const [{ data: q }, { data: qi }] = await Promise.all([
        supabase.from('quotes').select('*').eq('id', quoteId).single(),
        supabase.from('quote_items').select('*').eq('quote_id', quoteId).order('created_at'),
      ])
      const packageName = q?.package_id
        ? (await supabase.from('packages').select('name').eq('id', q.package_id).single()).data?.name || ''
        : ''
      if (!q) return
      const items = (qi || []).map(i => ({
        id:            i.id,
        serviceItemId: i.casket_id || i.service_item_id,
        name:          i.name,
        price:         Number(i.price),
        quantity:      i.quantity,
        isFromPackage: i.is_from_package,
        isCasketItem:  i.is_casket_item || false,
        notes:         i.notes,
        gst:           i.is_gst  ?? true,
        pst:           i.is_pst  ?? false,
        noDisc:        i.no_disc ?? false,
        sectionId:     i.section_id || (i.is_from_package ? 'sec-main' : 'sec-extra'),
      }))
      // Check for stale prices
      const serviceIds = items.filter(i => i.serviceItemId && !i.isCasketItem).map(i => i.serviceItemId)
      const casketIds  = items.filter(i => i.isCasketItem).map(i => i.serviceItemId)
      const [{ data: siPrices }, { data: cskPrices }] = await Promise.all([
        serviceIds.length
          ? supabase.from('service_items').select('id, price').in('id', serviceIds)
          : Promise.resolve({ data: [] }),
        casketIds.length
          ? supabase.from('caskets').select('id, name, price, description, image_url').in('id', casketIds)
          : Promise.resolve({ data: [] }),
      ])
      const currentPrices = Object.fromEntries(
        [...(siPrices || []), ...(cskPrices || [])].map(r => [r.id, Number(r.price)])
      )
      const stale = {}
      items.forEach(i => {
        if (i.serviceItemId && currentPrices[i.serviceItemId] != null &&
            currentPrices[i.serviceItemId] !== i.price) {
          stale[i.serviceItemId] = currentPrices[i.serviceItemId]
        }
      })
      if (Object.keys(stale).length > 0) setPriceMap(stale)

      const casketItem = items.find(i => i.isCasketItem)
      const casketData = (cskPrices || []).find(c => c.id === casketItem?.serviceItemId)
      const selectedCasket = casketData ? {
        id:          casketData.id,
        name:        casketData.name,
        price:       Number(casketData.price),
        description: casketData.description || null,
        imageUrl:    casketData.image_url || null,
      } : null

      dispatch({
        type: 'LOAD',
        payload: {
          funeralHomeId:       q.funeral_home_id,
          packageId:           q.package_id,
          contactId:           q.contact_id || crypto.randomUUID(),
          quoteNumber:         q.quote_number || generateQuoteNumber(),
          beneficiaryName:     q.deceased_name        || '',
          beneficiaryPhone:    q.beneficiary_phone     || '',
          beneficiaryEmail:    q.beneficiary_email     || '',
          beneficiaryBirthdate: q.beneficiary_birthdate || '',
          beneficiaryAddress:  q.beneficiary_address   || '',
          purchaserDifferent:  q.purchaser_different   || false,
          purchaserName:       q.purchaser_name        || q.customer_name  || '',
          purchaserPhone:      q.purchaser_phone       || q.customer_phone || '',
          purchaserEmail:      q.purchaser_email       || q.customer_email || '',
          purchaserBirthdate:  q.purchaser_birthdate   || '',
          purchaserAddress:    q.purchaser_address     || '',
          advisorName:         q.advisor_name  || '',
          advisorEmail:        q.advisor_email || '',
          advisorPhone:        q.advisor_phone || '',
          packageName,
          packageDiscount:  Number(q.package_discount) || 0,
          arrangementType:  q.arrangement_type || 'burial',
          discountType:     q.discount_type  || 'percentage',
          discountValue:    Number(q.discount_value),
          taxRate:          Number(q.tax_rate),
          status:           q.status,
          notes:            q.notes || '',
          items,
          selectedCasket,
          ...calcTotals(items, Number(q.package_discount) || 0, q.discount_type || 'percentage', Number(q.discount_value)),
        },
      })
    }
    load()
  }, [quoteId])

  useEffect(() => {
    if (state.contactId && quoteId) loadVersions(state.contactId)
  }, [state.contactId, quoteId])

  function handlePackageSelect(id, allItems, pkgDisc, pkgName, defaultCasket) {
    const optionals      = allItems.filter(i => OPTIONAL_ITEM_IDS.has(i.serviceItemId))
    const regularItems   = allItems.filter(i => !OPTIONAL_ITEM_IDS.has(i.serviceItemId))
    const hasCremFee     = regularItems.some(i => i.serviceItemId === CREMATORY_FEE.serviceItemId)
    const addCrematoryFee = state.arrangementType === 'cremation' && !hasCremFee
    dispatch({ type: 'SET_PACKAGE', id, items: regularItems, packageDiscount: pkgDisc,
               packageName: pkgName, defaultCasket, addCrematoryFee })
    setPendingOptionals(optionals)
    if (defaultCasket || optionals.length > 0) setCasketPickerOpen(true)
  }

  function buildItemRows(items, qid) {
    return items.map(i => ({
      quote_id:        qid,
      service_item_id: i.isCasketItem ? null : (i.isCustom ? null : (i.serviceItemId || null)),
      casket_id:       i.isCasketItem ? (i.serviceItemId || null) : null,
      name:            i.name,
      price:           i.price,
      quantity:        i.quantity,
      is_from_package: i.isFromPackage,
      is_gst:          i.gst !== false,
      is_pst:          i.pst === true,
      no_disc:         i.noDisc || false,
      is_casket_item:  i.isCasketItem || false,
      section_id:      i.sectionId || null,
      notes:           i.notes || null,
    }))
  }

  function buildQuoteData() {
    return {
      funeral_home_id:      state.funeralHomeId,
      package_id:           state.packageId || null,
      deceased_name:        state.beneficiaryName,
      customer_name:        state.purchaserDifferent ? state.purchaserName  : state.beneficiaryName,
      customer_email:       state.purchaserDifferent ? state.purchaserEmail : state.beneficiaryEmail,
      customer_phone:       state.purchaserDifferent ? state.purchaserPhone : state.beneficiaryPhone,
      beneficiary_phone:    state.beneficiaryPhone,
      beneficiary_email:    state.beneficiaryEmail,
      beneficiary_birthdate: state.beneficiaryBirthdate || null,
      beneficiary_address:  state.beneficiaryAddress,
      purchaser_different:  state.purchaserDifferent || false,
      purchaser_name:       state.purchaserName,
      purchaser_phone:      state.purchaserPhone,
      purchaser_email:      state.purchaserEmail,
      purchaser_birthdate:  state.purchaserBirthdate || null,
      purchaser_address:    state.purchaserAddress,
      advisor_name:         state.advisorName,
      advisor_email:        state.advisorEmail,
      advisor_phone:        state.advisorPhone,
      package_discount:     state.packageDiscount,
      subtotal:             state.subtotal,
      arrangement_type:     state.arrangementType,
      discount_type:        state.discountType,
      discount_value:       state.discountValue,
      discount_amount:      state.discountAmount,
      tax_rate:             state.taxRate,
      tax_amount:           state.taxAmount,
      total:                state.total,
      notes:                state.notes,
      contact_id:           state.contactId,
      user_id:              userId,
    }
  }

  async function save(status) {
    setSaving(true); setSaveErr(null)
    try {
      const quoteData = {
        ...buildQuoteData(),
        quote_number: state.quoteNumber || generateQuoteNumber(),
        status:       status || state.status,
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
        await supabase.from('quote_items').insert(buildItemRows(state.items, qid))
      }
      if (status) dispatch({ type: 'SET_STATUS', status })
      if (!quoteId && onEdit) {
        onEdit(qid) // first-time save: navigate to the newly created quote
      } else {
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 2500)
      }
    } catch (e) {
      setSaveErr(e.message)
    }
    setSaving(false)
  }

  async function loadVersions(contactId) {
    if (!contactId || !quoteId) return
    const { data } = await supabase
      .from('quotes')
      .select('id, quote_number, status, total, created_at, version_label, sort_order')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: true })
    if (!data) return
    setVersions(data.slice().sort((a, b) => {
      const ao = a.sort_order ?? 999999
      const bo = b.sort_order ?? 999999
      return ao !== bo ? ao - bo : new Date(a.created_at) - new Date(b.created_at)
    }))
  }

  async function handleVersionDrop(toId) {
    if (!dragV || dragV === toId) return
    const from = versions.findIndex(v => v.id === dragV)
    const to   = versions.findIndex(v => v.id === toId)
    if (from === -1 || to === -1) return
    const reordered = [...versions]
    const [moved]   = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    setVersions(reordered)
    setDragV(null)
    setDragOverV(null)
    await Promise.all(reordered.map((v, i) => supabase.from('quotes').update({ sort_order: i }).eq('id', v.id)))
  }

  async function saveVersionLabel(id, label) {
    const trimmed = label.trim() || null
    await supabase.from('quotes').update({ version_label: trimmed }).eq('id', id)
    setVersions(vs => vs.map(v => v.id === id ? { ...v, version_label: trimmed } : v))
    setEditingLabel(null)
  }

  async function duplicateQuote() {
    setSaving(true); setSaveErr(null)
    try {
      const { data: newQ } = await supabase.from('quotes').insert({
        ...buildQuoteData(),
        quote_number: generateQuoteNumber(),
        status: 'draft',
        contact_id: state.contactId,
      }).select('id').single()
      if (state.items.length) {
        await supabase.from('quote_items').insert(buildItemRows(state.items, newQ.id))
      }
      if (onEdit) onEdit(newQ.id)
    } catch (e) { setSaveErr(e.message) }
    setSaving(false)
  }

  async function newVersion() {
    setSaving(true); setSaveErr(null)
    try {
      const { data: newQ } = await supabase.from('quotes').insert({
        funeral_home_id:      state.funeralHomeId,
        quote_number:         generateQuoteNumber(),
        contact_id:           state.contactId,
        deceased_name:        state.beneficiaryName,
        beneficiary_phone:    state.beneficiaryPhone,
        beneficiary_email:    state.beneficiaryEmail,
        beneficiary_birthdate: state.beneficiaryBirthdate || null,
        beneficiary_address:  state.beneficiaryAddress,
        purchaser_different:  state.purchaserDifferent,
        purchaser_name:       state.purchaserName,
        purchaser_phone:      state.purchaserPhone,
        purchaser_email:      state.purchaserEmail,
        purchaser_birthdate:  state.purchaserBirthdate || null,
        purchaser_address:    state.purchaserAddress,
        advisor_name:         state.advisorName,
        advisor_email:        state.advisorEmail,
        advisor_phone:        state.advisorPhone,
        tax_rate:             state.taxRate,
        status:               'draft',
        notes:                state.notes,
        arrangement_type:     'burial',
        user_id:              userId,
      }).select('id').single()
      if (onEdit) onEdit(newQ.id)
    } catch (e) { setSaveErr(e.message) }
    setSaving(false)
  }

  async function deleteVersion(versionId) {
    if (!window.confirm('Delete this version? This cannot be undone.')) return
    await supabase.from('quote_items').delete().eq('quote_id', versionId)
    await supabase.from('quotes').delete().eq('id', versionId)
    const remaining = versions.filter(v => v.id !== versionId)
    if (versionId === quoteId && remaining.length > 0 && onEdit) {
      onEdit(remaining[0].id)
    } else {
      setVersions(remaining)
    }
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
            {state.beneficiaryName && (
              <p className="text-primary-300 text-xs truncate leading-tight">{state.beneficiaryName}</p>
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
            <label className="text-primary-200 hover:text-white text-xs px-3 py-1.5
                              border border-white/20 rounded-lg transition-colors cursor-pointer"
                   title={attachedImage ? 'Replace attached image' : 'Attach image to print'}>
              {attachedImage ? 'Image ✓' : 'Attach image'}
              <input
                type="file" accept="image/*" className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = ev => setAttachedImage(ev.target.result)
                  reader.readAsDataURL(file)
                  e.target.value = ''
                }}
              />
            </label>
            {attachedImage && (
              <button
                onClick={() => setAttachedImage(null)}
                className="text-primary-300 hover:text-white text-xs transition-colors"
                title="Remove attached image"
              >✕</button>
            )}
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
        {savedFlash && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-1.5 text-center font-medium transition-all">
            Saved ✓
          </div>
        )}
        {priceMap && (
          <div className="bg-amber-500 text-white text-xs px-4 py-2 flex items-center justify-between">
            <span>{Object.keys(priceMap).length} item{Object.keys(priceMap).length > 1 ? 's have' : ' has'} updated prices in the database.</span>
            <button
              onClick={() => { dispatch({ type: 'REFRESH_PRICES', priceMap }); setPriceMap(null) }}
              className="ml-4 font-semibold underline hover:no-underline shrink-0"
            >
              Refresh Prices
            </button>
          </div>
        )}
      </header>

      {/* ── Version Bar ─────────────────────────────────────────────────────── */}
      {quoteId && (
        <div className="bg-primary-900 border-b border-primary-700 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
            <span className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest shrink-0">Versions</span>

            {/* Version pills — draggable to reorder */}
            {versions.map((v, i) => {
              const isCurrent    = v.id === quoteId
              const isEditing    = editingLabel?.id === v.id
              const isDragging   = dragV    === v.id
              const isDragTarget = dragOverV === v.id && dragV !== v.id
              const displayLabel = v.version_label || `V${i + 1}`
              const statusMark   = v.status === 'finalized' ? ' ✓' : v.status === 'accepted' ? ' ★' : ''
              return (
                <div
                  key={v.id}
                  draggable={!isEditing}
                  onDragStart={() => setDragV(v.id)}
                  onDragEnd={() => { setDragV(null); setDragOverV(null) }}
                  onDragOver={e => { e.preventDefault(); setDragOverV(v.id) }}
                  onDrop={e => { e.preventDefault(); handleVersionDrop(v.id) }}
                  className={`flex items-center gap-0.5 group cursor-grab active:cursor-grabbing transition-opacity
                    ${isDragging ? 'opacity-30' : ''}
                    ${isDragTarget ? 'ring-2 ring-white/60 rounded-full' : ''}`}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      value={editingLabel.value}
                      onChange={e => setEditingLabel(l => ({ ...l, value: e.target.value }))}
                      onBlur={() => saveVersionLabel(v.id, editingLabel.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveVersionLabel(v.id, editingLabel.value)
                        if (e.key === 'Escape') setEditingLabel(null)
                      }}
                      className="text-xs px-2 py-0.5 rounded-full bg-white text-primary-800
                                 border-2 border-primary-400 outline-none w-24 font-medium"
                      maxLength={24}
                    />
                  ) : (
                    <button
                      onClick={() => !isCurrent && onEdit && onEdit(v.id)}
                      onDoubleClick={e => { e.stopPropagation(); setEditingLabel({ id: v.id, value: v.version_label || '' }) }}
                      title="Drag to reorder · Double-click to rename"
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        isCurrent
                          ? 'bg-white text-primary-800 cursor-grab'
                          : 'text-primary-300 hover:text-white border border-primary-600 hover:border-primary-400'
                      }`}
                    >
                      {displayLabel}
                      <span className={`text-[10px] ${isCurrent ? 'text-primary-500' : 'text-primary-600'}`}>
                        {statusMark}
                      </span>
                    </button>
                  )}
                  {!isCurrent && !isEditing && (
                    <button
                      onClick={() => deleteVersion(v.id)}
                      className="opacity-0 group-hover:opacity-100 text-primary-600 hover:text-red-400
                                 text-[11px] leading-none transition-all px-0.5"
                      title={`Delete ${displayLabel}`}
                    >×</button>
                  )}
                </div>
              )
            })}

            {/* Add Version dropdown */}
            <div className="relative">
              <button
                onClick={() => setAddVersionOpen(v => !v)}
                disabled={saving}
                className="text-[11px] text-primary-400 hover:text-white border border-primary-700
                           hover:border-primary-500 px-2.5 py-1 rounded-full transition-colors disabled:opacity-40"
              >
                + Add Version
              </button>
              {addVersionOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAddVersionOpen(false)} />
                  <div className="absolute left-0 top-full mt-1.5 z-20 bg-white rounded-xl shadow-xl
                                  border border-stone-100 py-1 w-48">
                    <button
                      onClick={() => { setAddVersionOpen(false); duplicateQuote() }}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <p className="font-medium">Duplicate</p>
                      <p className="text-xs text-stone-400 mt-0.5">Copy all items & package</p>
                    </button>
                    <div className="border-t border-stone-100 mx-2" />
                    <button
                      onClick={() => { setAddVersionOpen(false); newVersion() }}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <p className="font-medium">Start fresh</p>
                      <p className="text-xs text-stone-400 mt-0.5">Same contact, blank quote</p>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Compare — only with 2+ versions */}
            {versions.length >= 2 && (
              <button
                onClick={() => setShowCompare(true)}
                className="text-[11px] text-primary-400 hover:text-white transition-colors ml-1"
              >
                Compare
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-5 grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 flex flex-col gap-4">
          <CustomerForm
            values={{
              beneficiaryName:      state.beneficiaryName,
              beneficiaryPhone:     state.beneficiaryPhone,
              beneficiaryEmail:     state.beneficiaryEmail,
              beneficiaryBirthdate: state.beneficiaryBirthdate,
              beneficiaryAddress:   state.beneficiaryAddress,
              purchaserDifferent:   state.purchaserDifferent,
              purchaserName:        state.purchaserName,
              purchaserPhone:       state.purchaserPhone,
              purchaserEmail:       state.purchaserEmail,
              purchaserBirthdate:   state.purchaserBirthdate,
              purchaserAddress:     state.purchaserAddress,
              advisorName:          state.advisorName,
              advisorEmail:         state.advisorEmail,
              advisorPhone:         state.advisorPhone,
              notes:                state.notes,
            }}
            onChange={payload => dispatch({ type: 'SET_CUSTOMER', payload })}
            onNotes={notes => dispatch({ type: 'SET_NOTES', notes })}
          />

          {/* ── Arrangement Type ─────────────────────────────────────────── */}
          <div className="card px-4 py-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-500 shrink-0">Arrangement Type</span>
            <div className="flex gap-1">
              {['burial', 'cremation', 'other'].map(type => (
                <button
                  key={type}
                  onClick={() => dispatch({ type: 'SET_ARRANGEMENT', value: type })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    state.arrangementType === type
                      ? 'bg-primary-700 text-white'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

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
                    onSelect={handlePackageSelect}
                    onClear={() => dispatch({ type: 'CLEAR_PACKAGE' })}
                  />
                )}
                {tab === 'items' && (
                  <>
                    <div className="mb-3">
                      <button
                        onClick={() => setCasketPickerOpen(true)}
                        className="text-xs font-medium text-primary-700 hover:text-primary-800 flex items-center gap-1"
                      >
                        <span className="text-base leading-none">⬜</span>
                        {state.selectedCasket ? `Casket: ${state.selectedCasket.name}` : 'Select Casket…'}
                      </button>
                    </div>
                    <ItemBrowser
                      funeralHomeId={state.funeralHomeId}
                      onAdd={item => dispatch({ type: 'ADD_ITEM', item })}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <QuoteSummary
            items={state.items}
            sections={state.sections}
            packageName={state.packageName}
            arrangementType={state.arrangementType}
            selectedCasket={state.selectedCasket}
            subtotal={state.subtotal}
            packageDiscount={state.packageDiscount}
            pkgDiscAmount={state.pkgDiscAmount}
            userDiscAmount={state.userDiscAmount}
            discountType={state.discountType}
            discountValue={state.discountValue}
            discountAmount={state.discountAmount}
            gstAmount={state.gstAmount}
            pstAmount={state.pstAmount}
            total={state.total}
            status={state.status}
            beneficiaryBirthdate={state.beneficiaryBirthdate}
            onRemove={id => dispatch({ type: 'REMOVE_ITEM', id })}
            onChangeQty={(id, qty) => dispatch({ type: 'CHANGE_QTY', id, qty })}
            onDiscount={(t, v) => dispatch({ type: 'SET_DISCOUNT', discountType: t, discountValue: v })}
            onToggleTax={(id, taxes) => dispatch({ type: 'TOGGLE_TAX', id, taxes })}
            onEdit={(id, changes) => dispatch({ type: 'EDIT_ITEM', id, changes })}
            onReorder={(fromId, toId) => dispatch({ type: 'REORDER_ITEMS', fromId, toId })}
            onRenameSection={(id, name) => dispatch({ type: 'RENAME_SECTION', id, name })}
            onAddSection={() => dispatch({ type: 'ADD_SECTION' })}
            onRemoveSection={id => dispatch({ type: 'REMOVE_SECTION', id })}
            onMoveItem={(itemId, sectionId) => dispatch({ type: 'MOVE_ITEM_SECTION', itemId, sectionId })}
            onChangeCasket={() => setCasketPickerOpen(true)}
            onPrint={() => setShowPrint(true)}
          />
        </div>
      </div>

      {showPrint && (
        <PrintView home={currentHome} state={state} attachedImage={attachedImage} onClose={() => setShowPrint(false)} />
      )}

      {showCompare && state.contactId && (
        <ComparisonView
          contactId={state.contactId}
          currentQuoteId={quoteId}
          versionOrder={versions.map(v => v.id)}
          onClose={() => setShowCompare(false)}
        />
      )}

      {casketPickerOpen && (
        <CasketPicker
          funeralHomeId={state.funeralHomeId}
          currentCasketId={state.selectedCasket?.id}
          optionalItems={pendingOptionals}
          onSelect={(casket, selectedOptionals) => {
            dispatch({ type: 'PICK_CASKET', casket })
            selectedOptionals.forEach(item => dispatch({ type: 'ADD_ITEM', item }))
          }}
          onClose={() => { setCasketPickerOpen(false); setPendingOptionals([]) }}
        />
      )}
    </div>
  )
}
