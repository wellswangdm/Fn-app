import { useEffect, useReducer, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { calcTotals, GST_RATE, PST_RATE } from '../lib/calcTotals.js'
import PackageSelector from '../components/PackageSelector.jsx'
import ItemBrowser from '../components/ItemBrowser.jsx'
import QuoteSummary from '../components/QuoteSummary.jsx'
import CustomerForm from '../components/CustomerForm.jsx'
import PrintView from '../components/PrintView.jsx'
import CasketPicker from '../components/CasketPicker.jsx'
import ComparisonView from '../components/ComparisonView.jsx'
import { versionNameOf } from '../lib/versionLabel.js'

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

// Each funeral home has its own Crematory Fee service_item with a different
// id, so dedup must match by name rather than CREMATORY_FEE.serviceItemId
// (which only matches the item added by the cremation-arrangement auto-add).
function isCremFee(item) {
  return (item.name || '').trim().toLowerCase() === 'crematory fee'
}

const STATIONERY_CATEGORY_ID = 'c1000000-0000-0000-0000-000000000006'
const URN_ITEM_IDS = new Set(['si000213', 'si000214', 'si000215'])

// Rental caskets are always charged PST — even for cremation — because they are
// a rented good rather than part of the disposition. cont001 (Brockton Oak
// Ceremonial) and cont002 (Brockton Oak, 1 Hour Rental) are the only
// rental-category caskets in the shared casket_catalog, so PST defaults on for
// them regardless of arrangement type. Add ids here if more rentals are added.
const RENTAL_CASKET_IDS = new Set(['cont001', 'cont002'])
const isRentalCasketId = id => RENTAL_CASKET_IDS.has(id)
// PST default for a casket: rentals are always true; otherwise burial-only.
const casketPst = (casketId, arrangementType) =>
  isRentalCasketId(casketId) ? true : arrangementType === 'burial'

// Optional item detection is driven by package_items.is_optional (set per funeral home in the DB)

const INIT_SECTIONS = [
  { id: 'sec-main',        name: 'Guaranteed Items' },
  { id: 'sec-third-party', name: 'Third Party Items' },
  { id: 'sec-extra',       name: 'Additional Items'  },
]

// ─── Reducer ──────────────────────────────────────────────────────────────────

function defaultPst(item, arrangementType) {
  if (item.isCasketItem) return casketPst(item.serviceItemId, arrangementType)
  if (URN_ITEM_IDS.has(item.serviceItemId)) return true
  if (item.categoryId === STATIONERY_CATEGORY_ID) return true
  const name = (item.name || '').toLowerCase()
  if (name.includes('flower')) return true
  return false
}

function freshItem(item, sectionId = 'sec-extra') {
  return { id: crypto.randomUUID(), gst: true, pst: false, ...item, sectionId }
}

// Which half of the contract a line belongs to. A cash advance is money the
// funeral home lays out to someone else (crematorium, registry, clergy), so it
// is not a guaranteed good or service and must not be presented as one.
export function sectionForItem(item) {
  return item?.isCashAdvance ? 'sec-third-party' : 'sec-main'
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
        i.isCasketItem ? { ...i, pst: casketPst(i.serviceItemId, newType) } : i
      )
      if (newType === 'cremation') {
        const hasCremFee = items.some(isCremFee)
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
      const hasCremFee = action.items.some(isCremFee)
      // If package has crematory fee, remove any standalone crematory fee from keep to prevent duplicate
      const cleanKeep = hasCremFee
        ? keep.filter(k => !isCremFee(k))
        : keep
      const autoToAdd = AUTO_ADD
        .filter(ai => !cleanKeep.some(k => k.serviceItemId === ai.serviceItemId))
        .map(ai => freshItem({ ...ai, quantity: 1, isFromPackage: false }, 'sec-third-party'))
      const pkgItems = action.items.map(i => freshItem({
        ...i, isFromPackage: true,
        pst: i.pst !== undefined ? i.pst : defaultPst(i, state.arrangementType),
      }, 'sec-main'))
      const cremItem = (action.addCrematoryFee && !hasCremFee && !cleanKeep.some(isCremFee))
        ? freshItem({ ...CREMATORY_FEE, quantity: 1, isFromPackage: false }, 'sec-main')
        : null
      const casketItem = action.defaultCasket ? freshItem({
        serviceItemId: action.defaultCasket.id,
        name:          action.defaultCasket.name,
        price:         action.defaultCasket.price,
        quantity:      1,
        pst:           casketPst(action.defaultCasket.id, state.arrangementType),
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
               allPackageItems: action.allPackageItems || [],
               items, sections: state.sections, selectedCasket,
               ...calcTotals(items, pkgDisc, state.discountType, state.discountValue) }
    }

    case 'CLEAR_PACKAGE': {
      const items = state.items.filter(i => !i.isFromPackage)
      return { ...state, packageId: null, packageDiscount: 0, packageName: '', items,
               allPackageItems: [], selectedCasket: null,
               ...calcTotals(items, 0, state.discountType, state.discountValue) }
    }

    case 'ADD_ITEM': {
      const existing = action.item.isCustom
        ? null
        : state.items.find(i => !i.isCustom && i.serviceItemId === action.item.serviceItemId && !i.isFromPackage)
      const items = existing
        ? state.items.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, freshItem({ ...action.item, quantity: 1, isFromPackage: false, pst: defaultPst(action.item, state.arrangementType) },
                                     sectionForItem(action.item))]
      return { ...state, items, ...calcTotals(items, state.packageDiscount, state.discountType, state.discountValue) }
    }

    case 'CONFIRM_OPTIONALS': {
      // Rebuild sec-main package items in original package order,
      // inserting selected optionals at their correct positions.
      const selectedSet = new Set(action.selectedOptionals.map(i => i.serviceItemId))
      const usedIds = new Set()
      const orderedPkgItems = []

      for (const item of state.allPackageItems) {
        if (!item.isOptional) {
          const existing = state.items.find(si =>
            si.serviceItemId === item.serviceItemId &&
            si.isFromPackage &&
            !si.isCasketItem &&
            !usedIds.has(si.id)
          )
          if (existing) {
            usedIds.add(existing.id)
            orderedPkgItems.push(existing)
          }
        } else if (selectedSet.has(item.serviceItemId)) {
          const optData = action.selectedOptionals.find(o => o.serviceItemId === item.serviceItemId)
          if (optData) {
            orderedPkgItems.push(freshItem({
              ...optData, isFromPackage: true,
              pst: defaultPst(optData, state.arrangementType),
            }, 'sec-main'))
          }
        }
      }

      // Non-package items (casket, auto-adds, individual items) keep their positions
      const otherItems = state.items.filter(i => !i.isFromPackage || i.isCasketItem)
      const items = [...orderedPkgItems, ...otherItems]
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
              ? { ...i, serviceItemId: casket.id, name: casket.name, price: casket.price, pst: casketPst(casket.id, state.arrangementType) }
              : i
          )
        : [...state.items, freshItem({
            serviceItemId: casket.id,
            name:          casket.name,
            price:         casket.price,
            quantity:      1,
            pst:           casketPst(casket.id, state.arrangementType),
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
    case 'SET_NOTES':    return { ...state, notes: action.notes }

    default: return state
  }
}

const INIT = {
  loaded:              false,
  funeralHomeId:       null,
  packageId:           null,
  allPackageItems:     [],
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
  const [casketPickerOpen,  setCasketPickerOpen]  = useState(false)
  const [paymentTerms,     setPaymentTerms]      = useState(null) // null = all selected
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
      // quote_items has no is_cash_advance column, so the flag is read back
      // from service_items — the query below already fetches that table for
      // the stale-price check.
      const caIds = [...new Set((qi || []).filter(i => i.service_item_id && !i.is_casket_item)
                                          .map(i => i.service_item_id))]
      const { data: caRows } = caIds.length
        ? await supabase.from('service_items').select('id, is_cash_advance').in('id', caIds)
        : { data: [] }
      const isCA = Object.fromEntries((caRows || []).map(r => [r.id, !!r.is_cash_advance]))

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
        isCashAdvance: isCA[i.service_item_id] || false,
        // A quote saved before sections existed has section_id null. It used
        // to fall into "Additional Items" whatever it was; now a cash advance
        // goes where it belongs and everything else is guaranteed.
        sectionId:     i.section_id
                       || (i.is_from_package ? 'sec-main'
                                             : sectionForItem({ isCashAdvance: isCA[i.service_item_id] })),
      }))
      // Check for stale prices
      const serviceIds = items.filter(i => i.serviceItemId && !i.isCasketItem).map(i => i.serviceItemId)
      const casketIds  = items.filter(i => i.isCasketItem).map(i => i.serviceItemId)
      const [{ data: siPrices }, { data: cskPrices }] = await Promise.all([
        serviceIds.length
          ? supabase.from('service_items').select('id, price').in('id', serviceIds)
          : Promise.resolve({ data: [] }),
        casketIds.length
          ? supabase.from('funeral_home_caskets')
              .select('catalog_id, price, casket_catalog(id, name, description, image_url)')
              .eq('funeral_home_id', q.funeral_home_id)
              .in('catalog_id', casketIds)
          : Promise.resolve({ data: [] }),
      ])
      const currentPrices = Object.fromEntries([
        ...(siPrices  || []).map(r => [r.id,          Number(r.price)]),
        ...(cskPrices || []).map(r => [r.catalog_id,  Number(r.price)]),
      ])
      const stale = {}
      items.forEach(i => {
        if (i.serviceItemId && currentPrices[i.serviceItemId] != null &&
            currentPrices[i.serviceItemId] !== i.price) {
          stale[i.serviceItemId] = currentPrices[i.serviceItemId]
        }
      })
      if (Object.keys(stale).length > 0) setPriceMap(stale)

      const casketItem = items.find(i => i.isCasketItem)
      const casketData = (cskPrices || []).find(c => c.catalog_id === casketItem?.serviceItemId)
      const selectedCasket = casketData ? {
        id:          casketData.casket_catalog.id,
        name:        casketData.casket_catalog.name,
        price:       Number(casketData.price),
        description: casketData.casket_catalog.description || null,
        imageUrl:    casketData.casket_catalog.image_url || null,
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
    const optionals    = allItems.filter(i => i.isOptional)
    const regularItems = allItems.filter(i => !i.isOptional)
    const hasCremFee      = regularItems.some(isCremFee)
    const addCrematoryFee = state.arrangementType === 'cremation' && !hasCremFee
    dispatch({ type: 'SET_PACKAGE', id, items: regularItems, packageDiscount: pkgDisc,
               packageName: pkgName, defaultCasket, addCrematoryFee, allPackageItems: allItems })
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

  async function save() {
    setSaving(true); setSaveErr(null)
    try {
      const quoteData = {
        ...buildQuoteData(),
        quote_number: state.quoteNumber || generateQuoteNumber(),
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
      .select('id, quote_number, total, created_at, version_label, sort_order, packages(name)')
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

  // Review takes over the screen, the way the cemetery editor hands off to
  // its review sheet. It is a different view of the quote, not a window
  // hovering over the one you were in.
  if (showPrint) return (
    <PrintView home={currentHome} state={state} attachedImage={attachedImage}
               onClose={() => setShowPrint(false)} paymentTerms={paymentTerms} />
  )

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

      {/* Toolbar — the same shape as the cemetery editor: Back on the left,
          everything else on the right, on the page rather than in a dark bar
          bolted to the top of it. */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={onDone} className="btn-ghost">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select
            className="input text-xs py-1.5 max-w-[190px] truncate"
            value={state.funeralHomeId || ''}
            onChange={e => {
              const home = homes.find(h => h.id === e.target.value)
              if (home) dispatch({ type: 'SET_HOME', id: home.id, taxRate: Number(home.tax_rate) })
            }}
            aria-label="Funeral home"
          >
            {homes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>

          <label className="btn-secondary text-xs cursor-pointer"
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
            <button onClick={() => setAttachedImage(null)}
                    className="text-stone-400 hover:text-red-500 text-sm px-1"
                    title="Remove attached image">✕</button>
          )}

          <button onClick={() => setShowPrint(true)} disabled={!state.items.length}
                  className="btn-secondary text-xs disabled:opacity-40">
            Review
          </button>

          {quoteId && versions.length >= 2 && (
            <button onClick={() => setShowCompare(true)} className="btn-secondary text-xs">
              Compare
            </button>
          )}

          {quoteId && (
            <div className="relative">
              <button
                onClick={() => setAddVersionOpen(v => !v)}
                disabled={saving}
                className="btn-secondary text-xs disabled:opacity-40"
              >
                Add version
              </button>
              {addVersionOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAddVersionOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-20 bg-white rounded-xl shadow-xl
                                  border border-stone-100 py-1 w-56">
                    <button
                      onClick={() => { setAddVersionOpen(false); duplicateQuote() }}
                      className="w-full text-left px-4 py-2.5 hover:bg-stone-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-stone-700">Copy this version</p>
                      <p className="text-xs text-stone-400 mt-0.5">Start from what is here now</p>
                    </button>
                    <button
                      onClick={() => { setAddVersionOpen(false); newVersion() }}
                      className="w-full text-left px-4 py-2.5 hover:bg-stone-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-stone-700">Start blank</p>
                      <p className="text-xs text-stone-400 mt-0.5">Keep the client, drop the items</p>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button onClick={() => save()} disabled={saving} className="btn-primary text-xs">
            {saving ? 'Saving…' : 'Save quote'}
          </button>
        </div>
      </div>

      {saveErr && (
        <div className="card p-3 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{saveErr}</p>
        </div>
      )}
      {savedFlash && (
        <div className="card p-3 border-emerald-200 bg-emerald-50">
          <p className="text-sm text-emerald-800">Saved</p>
        </div>
      )}
      {priceMap && (
        <div className="card p-3 border-amber-200 bg-amber-50 flex items-center gap-3">
          <p className="text-sm text-amber-800 flex-1">
            {Object.keys(priceMap).length} item{Object.keys(priceMap).length > 1 ? 's have' : ' has'} updated prices in the database.
          </p>
          <button
            onClick={() => { dispatch({ type: 'REFRESH_PRICES', priceMap }); setPriceMap(null) }}
            className="btn-secondary text-xs shrink-0"
          >
            Refresh prices
          </button>
        </div>
      )}

      {/* Versions in this quote. Click one to switch; click the one you are
          on to rename it, the way you would rename a tab. Drag to reorder —
          that order is the order the comparison puts its columns in. */}
      {quoteId && versions.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Versions
          </span>
          {versions.map((v, i) => {
            const isCurrent    = v.id === quoteId
            const isEditing    = editingLabel?.id === v.id
            const isDragging   = dragV    === v.id
            const isDragTarget = dragOverV === v.id && dragV !== v.id
            // One naming rule across the list, this switcher and the
            // comparison — see src/lib/versionLabel.js.
            const displayLabel = versionNameOf(v, i, versions.length)

            if (isEditing) {
              return (
                <input key={v.id} autoFocus
                       className="input text-xs py-1.5 w-56"
                       defaultValue={v.version_label || ''}
                       placeholder={displayLabel}
                       onBlur={e => saveVersionLabel(v.id, e.target.value)}
                       onKeyDown={e => {
                         if (e.key === 'Enter') e.currentTarget.blur()
                         if (e.key === 'Escape') setEditingLabel(null)
                       }} />
              )
            }
            return (
              <span key={v.id}
                draggable
                onDragStart={() => setDragV(v.id)}
                onDragEnd={() => { setDragV(null); setDragOverV(null) }}
                onDragOver={e => { e.preventDefault(); setDragOverV(v.id) }}
                onDrop={e => { e.preventDefault(); handleVersionDrop(v.id) }}
                className={`inline-flex items-center rounded-xl border text-xs font-medium transition-colors
                  ${isCurrent ? 'border-primary-300 bg-primary-50 text-primary-700'
                              : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'}
                  ${isDragging ? 'opacity-40' : ''}
                  ${isDragTarget ? 'ring-2 ring-primary-300' : ''}`}>
                <button
                  onClick={() => isCurrent
                    ? setEditingLabel({ id: v.id, value: v.version_label || '' })
                    : (onEdit && onEdit(v.id))}
                  title={isCurrent ? 'Click to rename' : 'Switch to this version'}
                  className="px-3 py-1.5"
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle ${
                    isCurrent ? 'bg-primary-500' : 'bg-stone-300'}`} />
                  {displayLabel}
                </button>
                {isCurrent && versions.length > 1 && (
                  <button onClick={() => deleteVersion(v.id)}
                          title={`Delete ${displayLabel}`}
                          className="pr-2.5 pl-0.5 text-primary-400 hover:text-red-600">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </span>
            )
          })}
        </div>
      )}

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

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
            beneficiaryName={state.beneficiaryName}
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
            paymentTerms={paymentTerms}
            onChangePaymentTerms={setPaymentTerms}
          />
        </div>
      </div>
      </div>

      {showCompare && state.contactId && (
        <ComparisonView
          contactId={state.contactId}
          currentQuoteId={quoteId}
          versionOrder={versions.map(v => v.id)}
          onClose={() => setShowCompare(false)}
          paymentTerms={paymentTerms}
        />
      )}

      {casketPickerOpen && (
        <CasketPicker
          funeralHomeId={state.funeralHomeId}
          currentCasketId={state.selectedCasket?.id}
          optionalItems={pendingOptionals}
          onSelect={(casket, selectedOptionals) => {
            if (casket) dispatch({ type: 'PICK_CASKET', casket })
            if (pendingOptionals.length > 0) {
              // Package selection flow: insert optionals at their correct package positions
              dispatch({ type: 'CONFIRM_OPTIONALS', selectedOptionals })
            }
          }}
          onClose={() => { setCasketPickerOpen(false); setPendingOptionals([]) }}
        />
      )}
    </div>
  )
}
