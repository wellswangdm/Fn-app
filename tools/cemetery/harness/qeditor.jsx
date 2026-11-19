import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import CemeteryQuoteEditor from '../../../src/pages/CemeteryQuoteEditor.jsx'
import '../../../src/index.css'
function App() {
  const [id, setId] = useState('q1')
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-primary-800 text-white px-6 py-2 text-xs">editing: {id}</div>
      <CemeteryQuoteEditor key={id}
        park={{ id:'6800', name:'Victory Memorial Park', gst_rate:0.05, pst_rate:0.07 }}
        advisor={{ name:'Wells Wang', email:'w@x.com', phone:'778', userId:'u1' }}
        quoteId={id} onBack={()=>{}} onSaved={()=>{}}
        onOpenQuote={setId} onCompare={()=>{}} />
    </div>
  )
}
createRoot(document.getElementById('root')).render(<App />)
