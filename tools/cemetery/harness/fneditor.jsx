import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import QuoteEditor from '../../../src/pages/QuoteEditor.jsx'
import '../../../src/index.css'
function App() {
  const [id, setId] = useState('q1')
  return (
    <>
      <QuoteEditor key={id} quoteId={id} userId="u1"
        user={{ id:'u1', email:'w@x.com', user_metadata:{ full_name:'Wells Wang' } }}
        onDone={()=>{}} onEdit={setId} />
      <div className="fixed bottom-0 inset-x-0 z-[60] bg-black text-white px-4 py-1 text-xs">
        fn-editor harness — {id}
      </div>
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
