export default function CustomerForm({ values, onChange, onNotes }) {
  function set(key, val) { onChange({ [key]: val }) }

  return (
    <div className="card p-4 space-y-3">
      {/* Advisor row — compact */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="label">Advisor Name</label>
          <input
            className="input text-sm"
            placeholder="Name"
            value={values.advisorName}
            onChange={e => set('advisorName', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Advisor Email</label>
          <input
            type="email"
            className="input text-sm"
            placeholder="advisor@example.com"
            value={values.advisorEmail}
            onChange={e => set('advisorEmail', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Advisor Phone</label>
          <input
            type="tel"
            className="input text-sm"
            placeholder="604-000-0000"
            value={values.advisorPhone}
            onChange={e => set('advisorPhone', e.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-stone-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <label className="label">Contact Email</label>
          <input
            type="email"
            className="input"
            placeholder="email@example.com"
            value={values.customerEmail}
            onChange={e => set('customerEmail', e.target.value)}
          />
        </div>
        <div>
          <label className="label">Contact Phone</label>
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
            value={values.notes}
            onChange={e => onNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
