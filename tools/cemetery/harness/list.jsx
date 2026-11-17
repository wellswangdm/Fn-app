import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import CemeteryQuoteList from '../../../src/pages/CemeteryQuoteList.jsx'
import '../../../src/index.css'
function App() {
  const [log, setLog] = useState('')
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-primary-800 text-white px-6 py-3 text-sm">List harness — {log || 'no action yet'}</div>
      <CemeteryQuoteList
        park={{ id:'6800', name:'Victory Memorial Park' }}
        advisor={{ userId:'u1' }}
        onOpen={id => setLog('open ' + id)}
        onNew={() => setLog('new quote')}
        onCompare={cid => setLog('compare family ' + cid)} />
    </div>
  )
}
createRoot(document.getElementById('root')).render(<App />)
