import { useState } from 'react'

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2.5">
      {children}
    </p>
  )
}

function Field({ label, children, action }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="label">{label}</label>
        {action}
      </div>
      {children}
    </div>
  )
}

function CopyBtn({ onClick }) {
  const [done, setDone] = useState(false)
  function handle() {
    onClick()
    setDone(true)
    setTimeout(() => setDone(false), 1500)
  }
  return (
    <button
      type="button"
      onClick={handle}
      className="text-[10px] font-semibold text-primary-600 hover:text-primary-800
                 border border-primary-200 hover:border-primary-400 rounded px-1.5 py-0.5
                 transition-colors shrink-0"
    >
      {done ? '✓ Copied' : 'Copy from beneficiary'}
    </button>
  )
}

export default function CustomerForm({ values, onChange, onNotes }) {
  const [collapsed, setCollapsed] = useState(false)

  function set(key, val) { onChange({ [key]: val }) }

  return (
    <div className="card overflow-hidden">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3
                   hover:bg-stone-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-700">Client Information</span>
          {(values.beneficiaryName || values.purchaserName) && (
            <span className="text-xs text-stone-400">
              {[values.beneficiaryName, values.purchaserDifferent && values.purchaserName]
                .filter(Boolean).join(' · ')}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium text-stone-400 shrink-0">
          {collapsed ? '▼ Expand' : '▲ Collapse'}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-stone-100 px-4 pt-4 pb-5 space-y-5">

          {/* ── Beneficiary ─────────────────────────────────────────────── */}
          <div>
            <SectionLabel>Beneficiary</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name">
                <input
                  className="input text-sm"
                  placeholder="Full name"
                  value={values.beneficiaryName}
                  onChange={e => set('beneficiaryName', e.target.value)}
                />
              </Field>
              <Field label="Birthdate">
                <input
                  type="date"
                  className="input text-sm"
                  value={values.beneficiaryBirthdate}
                  onChange={e => set('beneficiaryBirthdate', e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  className="input text-sm"
                  placeholder="604-000-0000"
                  value={values.beneficiaryPhone}
                  onChange={e => set('beneficiaryPhone', e.target.value)}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className="input text-sm"
                  placeholder="email@example.com"
                  value={values.beneficiaryEmail}
                  onChange={e => set('beneficiaryEmail', e.target.value)}
                />
              </Field>
              <div className="col-span-2">
                <Field label="Address">
                  <input
                    className="input text-sm"
                    placeholder="Street, City, Province, Postal Code"
                    value={values.beneficiaryAddress}
                    onChange={e => set('beneficiaryAddress', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Purchaser toggle ─────────────────────────────────────────── */}
          <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
            <input
              type="checkbox"
              checked={values.purchaserDifferent || false}
              onChange={e => set('purchaserDifferent', e.target.checked)}
              className="w-4 h-4 accent-primary-700 cursor-pointer"
            />
            <span className="text-xs font-medium text-stone-600 group-hover:text-stone-800">
              Purchaser is different from beneficiary
            </span>
          </label>

          {/* ── Purchaser ────────────────────────────────────────────────── */}
          {values.purchaserDifferent && (
            <div>
              <SectionLabel>Purchaser</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name">
                  <input
                    className="input text-sm"
                    placeholder="Full name"
                    value={values.purchaserName}
                    onChange={e => set('purchaserName', e.target.value)}
                  />
                </Field>
                <Field label="Birthdate">
                  <input
                    type="date"
                    className="input text-sm"
                    value={values.purchaserBirthdate}
                    onChange={e => set('purchaserBirthdate', e.target.value)}
                  />
                </Field>
                <Field
                  label="Phone"
                  action={<CopyBtn onClick={() => set('purchaserPhone', values.beneficiaryPhone)} />}
                >
                  <input
                    type="tel"
                    className="input text-sm"
                    placeholder="604-000-0000"
                    value={values.purchaserPhone}
                    onChange={e => set('purchaserPhone', e.target.value)}
                  />
                </Field>
                <Field
                  label="Email"
                  action={<CopyBtn onClick={() => set('purchaserEmail', values.beneficiaryEmail)} />}
                >
                  <input
                    type="email"
                    className="input text-sm"
                    placeholder="email@example.com"
                    value={values.purchaserEmail}
                    onChange={e => set('purchaserEmail', e.target.value)}
                  />
                </Field>
                <div className="col-span-2">
                  <Field
                    label="Address"
                    action={<CopyBtn onClick={() => set('purchaserAddress', values.beneficiaryAddress)} />}
                  >
                    <input
                      className="input text-sm"
                      placeholder="Street, City, Province, Postal Code"
                      value={values.purchaserAddress}
                      onChange={e => set('purchaserAddress', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Advisor ──────────────────────────────────────────────────── */}
          <div>
            <SectionLabel>Advisor</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Name">
                <input
                  className="input text-sm"
                  value={values.advisorName}
                  onChange={e => set('advisorName', e.target.value)}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className="input text-sm"
                  value={values.advisorEmail}
                  onChange={e => set('advisorEmail', e.target.value)}
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  className="input text-sm"
                  value={values.advisorPhone}
                  onChange={e => set('advisorPhone', e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* ── Notes ───────────────────────────────────────────────────── */}
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input text-sm resize-none"
              rows={2}
              value={values.notes}
              onChange={e => onNotes(e.target.value)}
            />
          </div>

        </div>
      )}
    </div>
  )
}
