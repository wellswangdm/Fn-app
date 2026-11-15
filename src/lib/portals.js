// Portals available after sign-in. Add new portals here — PortalSelect renders
// whatever is listed (an icon for the id must exist in PortalSelect's ICONS map).
//
// `ready: false` marks a portal as a placeholder: it still opens, but lands on a
// stub page instead of a real app.

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
    description: 'Interment rights, memorials and cemetery service quotes.',
    ready:       true,
  },
]

export const getPortal = id => PORTALS.find(p => p.id === id) || null
