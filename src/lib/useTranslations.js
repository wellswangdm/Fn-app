import { useEffect, useState } from 'react'
import { supabase } from './supabase.js'

let _cache   = null
let _promise = null

function load() {
  if (_promise) return _promise
  _promise = supabase
    .from('item_name_translations')
    .select('item_name, name_zh')
    .then(({ data }) => {
      _cache = Object.fromEntries((data || []).map(r => [r.item_name, r.name_zh]))
      return _cache
    })
  return _promise
}

// React hook — returns {} on first render, fills in once loaded (one network request total)
export function useTranslations() {
  const [t, setT] = useState(_cache || {})
  useEffect(() => {
    if (_cache) { setT(_cache); return }
    load().then(setT)
  }, [])
  return t
}

// Imperative version for use inside async functions (e.g. handleShare, handleOpenHTML)
export function getTranslations() {
  return _cache ? Promise.resolve(_cache) : load()
}
