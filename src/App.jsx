import { useState } from 'react'
import QuoteList from './pages/QuoteList.jsx'
import QuoteEditor from './pages/QuoteEditor.jsx'

export default function App() {
  // view: 'list' | 'new' | 'edit'
  const [view, setView]           = useState('list')
  const [editingQuoteId, setEditingQuoteId] = useState(null)

  function openNew() {
    setEditingQuoteId(null)
    setView('new')
  }

  function openEdit(id) {
    setEditingQuoteId(id)
    setView('edit')
  }

  function backToList() {
    setView('list')
    setEditingQuoteId(null)
  }

  if (view === 'list') {
    return <QuoteList onNew={openNew} onEdit={openEdit} />
  }

  return (
    <QuoteEditor
      quoteId={editingQuoteId}
      onDone={backToList}
    />
  )
}
