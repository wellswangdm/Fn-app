import React from 'react'
import { createRoot } from 'react-dom/client'
import CemeteryPortal from '../../../src/pages/CemeteryPortal.jsx'
import '../../../src/index.css'
createRoot(document.getElementById('root')).render(
  <CemeteryPortal user={{ id:'u1', email:'w@x.com', user_metadata:{ full_name:'Wells Wang' } }}
                  onSwitchPortal={()=>{}} onSignOut={()=>{}} />
)
