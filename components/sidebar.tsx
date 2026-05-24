'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { IconDashboard, IconBox, IconTerminal } from './icons'

const NAV = [
  { label: 'Dashboard', path: '/',         Icon: IconDashboard },
  { label: 'Projects',  path: '/projects', Icon: IconBox },
  { label: 'Queries',   path: '/queries',  Icon: IconTerminal },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18V8l4 4 4-4 4 4 4-4v10"/>
          </svg>
        </div>
        <div>
          <div className="brand-title">MCP Context</div>
          <div className="brand-sub mono">Server · v0.4.2</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">NAVIGATION</div>
        {NAV.map(item => {
          const active = mounted && pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={'nav-item' + (active ? ' nav-item--active' : '')}
            >
              <item.Icon size={15} className="nav-icon" />
              <span>{item.label}</span>
              {active && <span className="nav-active-bar" />}
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-foot">
        <div className="conn-card">
          <div className="conn-row">
            <span className="status-dot status-dot--ok" />
            <span className="mono small">localhost:3284</span>
          </div>
          <div className="conn-meta mono small muted">
            <span>MCP Server</span>
            <span>·</span>
            <span>online</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
