import React from 'react'
import { createRoot } from 'react-dom/client'
import ComparisonView from '../../../src/components/ComparisonView.jsx'
import '../../../src/index.css'
createRoot(document.getElementById('root')).render(
  <ComparisonView contactId="C1" currentQuoteId="q1" onClose={() => {}} />
)
