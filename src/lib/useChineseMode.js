import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Whether to show Chinese alongside English.
//
// A VIEWING preference shared by both portals, not a property of any quote —
// so the same quote can be shown in either language without editing it, and
// two quotes can never be stuck in different languages.
//
// English is the default; Chinese appears once someone asks for it. It used
// to be the other way round: anything other than the string 'false' counted
// as on, so a browser that had never touched the toggle opened in Chinese.
// Anyone who has already chosen keeps their choice either way.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'fn_show_chinese'
const bus = new EventTarget()

function read() {
  try {
    return localStorage.getItem(KEY) === 'true'
  } catch {
    // private windows and locked-down browsers can throw on access
    return false
  }
}

export function useChineseMode() {
  const [on, setOn] = useState(read)

  useEffect(() => {
    const handler = () => setOn(read())
    bus.addEventListener('change', handler)
    return () => bus.removeEventListener('change', handler)
  }, [])

  function set(val) {
    try { localStorage.setItem(KEY, String(!!val)) } catch { /* not persisted */ }
    bus.dispatchEvent(new Event('change'))
  }

  return [on, set]
}
