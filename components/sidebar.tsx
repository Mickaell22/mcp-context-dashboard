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
  const [db, setDb] = useState<'loading' | 'online' | 'offline'>('loading')

  useEffect(() => {
    setMounted(true)
    fetch('/api/health')
      .then(r => setDb(r.ok ? 'online' : 'offline'))
      .catch(() => setDb('offline'))
  }, [])

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
          <div className="brand-sub mono">dashboard</div>
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
            <span className={'status-dot' + (db === 'online' ? ' status-dot--ok' : db === 'offline' ? ' status-dot--err' : '')} />
            <span className="mono small">PostgreSQL</span>
          </div>
          <div className="conn-meta mono small muted">
            <span>database</span>
            <span>·</span>
            <span>{db === 'loading' ? '...' : db}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
