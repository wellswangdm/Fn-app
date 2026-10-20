import { PORTALS } from '../lib/portals.js'

// ─── Icons ────────────────────────────────────────────────────────────────────

function FuneralIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  )
}

function CemeteryIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 20v-9a4 4 0 0 1 8 0v9" />
      <path d="M12 9v5M10 11h4" />
      <path d="M4 20h16" />
    </svg>
  )
}

const ICONS = { funeral: FuneralIcon, cemetery: CemeteryIcon }

// ─── Portal card ──────────────────────────────────────────────────────────────

function PortalCard({ portal, onSelect }) {
  const Icon = ICONS[portal.id]
  return (
    <button
      type="button"
      onClick={() => onSelect(portal.id)}
      className="card group relative text-left p-6 sm:p-7 flex flex-col gap-4
                 hover:border-primary-300 hover:shadow-md
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40
                 transition-all duration-150"
    >
      {!portal.ready && (
        <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider
                         text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
          Coming soon
        </span>
      )}

      <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100
                      flex items-center justify-center text-primary-700
                      group-hover:bg-primary-100 transition-colors shrink-0">
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <h3 className="text-base font-bold text-stone-800">{portal.name}</h3>
        <p className="text-sm text-stone-500 mt-1 leading-relaxed">{portal.description}</p>
      </div>

      <span className="text-sm font-medium text-primary-700 inline-flex items-center gap-1.5">
        {portal.ready ? 'Open' : 'Preview'}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalSelect({ user, onSelect, onSignOut }) {
  const name    = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  const email   = user?.email || ''
  const initial = (name || email).charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">

      <header className="bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Quote Manager</h1>
            <p className="text-primary-300 text-xs mt-0.5">Select a portal to continue</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(name || email) && (
              <div className="flex items-center gap-2.5 mr-1">
                <div className="w-8 h-8 rounded-full bg-primary-600 border border-primary-500
                                flex items-center justify-center text-sm font-bold shrink-0">
                  {initial}
                </div>
                <div className="hidden sm:block text-right">
                  {name && <p className="text-sm font-medium leading-tight">{name}</p>}
                  <p className="text-xs text-primary-300 leading-tight">{email}</p>
                </div>
              </div>
            )}
            <button onClick={onSignOut}
                    className="text-xs text-primary-300 hover:text-white transition-colors px-3 py-2">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="mb-7 text-center sm:text-left">
            <h2 className="text-xl font-bold text-stone-800">Where would you like to work?</h2>
            <p className="text-sm text-stone-500 mt-1">
              Choose a portal. You can switch at any time from the header.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {PORTALS.map(p => (
              <PortalCard key={p.id} portal={p} onSelect={onSelect} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
