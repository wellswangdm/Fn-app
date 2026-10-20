// ─────────────────────────────────────────────────────────────────────────────
// Cemetery portal — PLACEHOLDER
//
// This is a stub so the portal switcher has somewhere to land. When the
// cemetery quote app is migrated in, replace the <main> below with its real
// screens (and set `ready: true` for cemetery in src/lib/portals.js).
//
// The surrounding shell — auth session, portal switching, sign out — is already
// wired up by App.jsx, so the migrated app only needs to render inside here.
// `userId` / `user` are passed through for convenience, matching QuoteList.
// ─────────────────────────────────────────────────────────────────────────────

export default function CemeteryPortal({ onSwitchPortal, onSignOut, user }) {
  const name    = user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  const email   = user?.email || ''
  const initial = (name || email).charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">

      <header className="bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Cemetery Quote</h1>
            <p className="text-primary-300 text-xs mt-0.5">Cemetery quotation manager</p>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {(name || email) && (
              <div className="hidden sm:flex items-center gap-2.5 mr-1">
                <div className="w-8 h-8 rounded-full bg-primary-600 border border-primary-500
                                flex items-center justify-center text-sm font-bold shrink-0">
                  {initial}
                </div>
                <div className="text-right">
                  {name && <p className="text-sm font-medium leading-tight">{name}</p>}
                  <p className="text-xs text-primary-300 leading-tight">{email}</p>
                </div>
              </div>
            )}
            <button onClick={onSwitchPortal}
                    className="text-xs text-primary-300 hover:text-white transition-colors px-3 py-2">
              Switch portal
            </button>
            <button onClick={onSignOut}
                    className="text-xs text-primary-300 hover:text-white transition-colors px-3 py-2">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200
                          flex items-center justify-center text-amber-700 mx-auto mb-5">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 20v-9a4 4 0 0 1 8 0v9" />
              <path d="M12 9v5M10 11h4" />
              <path d="M4 20h16" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-stone-800">Cemetery portal coming soon</h2>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed">
            This portal is a placeholder. The cemetery quote app hasn’t been
            migrated in yet — once it is, it will open right here, using the same
            sign-in and customer records as the funeral portal.
          </p>

          <button onClick={onSwitchPortal} className="btn-primary mt-6">
            Back to portals
          </button>
        </div>
      </main>
    </div>
  )
}
