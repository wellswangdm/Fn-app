import { useEffect, useState } from 'react'

const KEY = 'fn_show_chinese'
const bus = new EventTarget()

function read() {
  return localStorage.getItem(KEY) !== 'false'
}

export function useChineseMode() {
  const [on, setOn] = useState(read)

  useEffect(() => {
    const handler = () => setOn(read())
    bus.addEventListener('change', handler)
    return () => bus.removeEventListener('change', handler)
  }, [])

  function set(val) {
    localStorage.setItem(KEY, String(val))
    bus.dispatchEvent(new Event('change'))
  }

  return [on, set]
}
