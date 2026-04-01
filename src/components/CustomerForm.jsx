export default function CustomerForm({ values, onChange, onNotes }) {
  function set(key, val) { onChange({ [key]: val }) }

  return (
    <div className="card p-4">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Quote Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Deceased Name</label>
          <input
            className="input"
            placeholder="Full name"
            value={values.deceasedName}
            onChange={e => set('deceasedName', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Family Contact</label>
          <input
            className="input"
            placeholder="Contact name"
            value={values.customerName}
            onChange={e => set('customerName', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="email@example.com"
            value={values.customerEmail}
            onChange={e => set('customerEmail', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            type="tel"
            className="input"
            placeholder="604-000-0000"
            value={values.customerPhone}
            onChange={e => set('customerPhone', e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Notes</label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="Internal notes…"
            value={values.notes}
            onChange={e => onNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
