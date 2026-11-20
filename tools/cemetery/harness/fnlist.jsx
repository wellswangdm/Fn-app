import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import QuoteList from '../../../src/pages/QuoteList.jsx'
import '../../../src/index.css'
function App() {
  const [log, setLog] = useState('')
  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-[60] bg-black text-white px-4 py-1.5 text-xs">
        fn-list harness — {log || 'no action yet'}
      </div>
      <QuoteList
        userId="u1"
        user={{ id:'u1', email:'w@x.com', user_metadata:{ full_name:'Wells Wang' } }}
        onNew={() => setLog('new quote')}
        onEdit={id => setLog('edit ' + id)}
        onSignOut={() => setLog('sign out')}
        onSwitchPortal={() => setLog('switch portal')} />
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
