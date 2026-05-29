import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.js'
import QuoteList from './pages/QuoteList.jsx'
import QuoteEditor from './pages/QuoteEditor.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SetPasswordPage from './pages/SetPasswordPage.jsx'

// Capture invite/recovery flag before Supabase strips the URL hash
const hashParams    = new URLSearchParams(window.location.hash.replace('#', ''))
const NEEDS_PW_FLAG = ['invite', 'recovery'].includes(hashParams.get('type'))

export default function App() {
  const [session,        setSession]       = useState(undefined) // undefined = still loading
  const [needsPassword,  setNeedsPassword] = useState(NEEDS_PW_FLAG)
  const [view,           setView]          = useState('list')
  const [editingQuoteId, setEditingQuoteId] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s ?? null))
    return () => subscription.unsubscribe()
  }, [])

  function openNew()    { setEditingQuoteId(null); setView('new') }
  function openEdit(id) { setEditingQuoteId(id);   setView('edit') }
  function backToList() { setView('list'); setEditingQuoteId(null) }
  function signOut()    { supabase.auth.signOut() }

  if (session === undefined) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading…</p>
    </div>
  )

  if (!session)       return <LoginPage />
  if (needsPassword)  return <SetPasswordPage onDone={() => setNeedsPassword(false)} />

  if (view === 'list') {
    return <QuoteList onNew={openNew} onEdit={openEdit} onSignOut={signOut} userId={session.user.id} user={session.user} />
  }

  return (
    <QuoteEditor
      key={editingQuoteId ?? 'new'}
      quoteId={editingQuoteId}
      onDone={backToList}
      onEdit={openEdit}
      userId={session.user.id}
      user={session.user}
    />
  )
}
