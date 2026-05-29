import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function SetPasswordPage({ onDone }) {
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm)  { setError('Passwords do not match'); return }
    if (password.length < 8)   { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    onDone()
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-lg font-semibold tracking-tight">Funeral Quote</h1>
          <p className="text-primary-300 text-xs mt-0.5">Service quotation manager</p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 w-full max-w-sm p-8">
          <h2 className="text-base font-bold text-stone-800 mb-1">Set your password</h2>
          <p className="text-xs text-stone-400 mb-6">Choose a password to secure your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="At least 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="Same password again"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Set password & continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
