// Portals available after sign-in. Add new portals here — PortalSelect renders
// whatever is listed (an icon for the id must exist in PortalSelect's ICONS map).
//
// `ready: false` marks a portal as a placeholder: it still opens, but lands on a
// stub page instead of a real app. Flip Cemetery to `ready: true` once the
// cemetery quote app has been migrated in.

export const PORTALS = [
  {
    id:          'funeral',
    name:        'Funeral Services',
    description: 'Create and manage funeral service quotes, packages and caskets.',
    ready:       true,
  },
  {
    id:          'cemetery',
    name:        'Cemetery Services',
    description: 'Plots, interment rights and cemetery product quotes.',
    ready:       false,
  },
]

export const getPortal = id => PORTALS.find(p => p.id === id) || null
