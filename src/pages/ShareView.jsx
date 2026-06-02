import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function ShareView({ id }) {
  const [html,    setHtml]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('comparison_shares').select('html').eq('id', id).single()
      .then(({ data, error }) => {
        setHtml(error ? null : (data?.html ?? null))
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#86868b', fontSize: 14 }}>Loading…</p>
    </div>
  )

  if (!html) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#86868b', fontSize: 14 }}>Comparison not found.</p>
    </div>
  )

  return (
    <iframe
      srcdoc={html}
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Quote Comparison"
    />
  )
}
