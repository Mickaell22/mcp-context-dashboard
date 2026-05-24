'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconFolder, IconBolt, IconChip, IconDollar, IconChevronRight } from '@/components/icons'
import ProjectBadge from '@/components/project-badge'
import { fmtNumber, fmtCost, timeAgo } from '@/lib/format'

interface RecentQuery {
  id: number
  query_text: string
  in_tokens: number
  out_tokens: number
  cost: number
  created_at: string
  project_name: string | null
}

interface Stats {
  projects: number
  queriesToday: number
  totalTokens: number
  totalCost: number
  recentQueries: RecentQuery[]
}

function StatCard({
  label, value, sub, Icon,
}: {
  label: string
  value: string | number
  sub: string
  Icon: React.ComponentType<{ size?: number }>
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-main">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-sub">{sub}</div>
      </div>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => setError(true))
  }, [])

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <div className="page-subtitle">Local MCP server · running on :3284</div>
        </div>
        <div className="server-status">
          <span className="status-dot status-dot--ok" />
          <span className="mono small muted">online</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Projects"      value={stats?.projects     ?? '—'} sub="indexed"  Icon={IconFolder} />
        <StatCard label="Queries Today" value={stats?.queriesToday ?? '—'} sub="last 24h" Icon={IconBolt} />
        <StatCard
          label="Total Tokens"
          value={stats ? fmtNumber(stats.totalTokens) : '—'}
          sub="in + out"
          Icon={IconChip}
        />
        <StatCard
          label="Total Cost"
          value={stats ? fmtCost(stats.totalCost) : '—'}
          sub="all time"
          Icon={IconDollar}
        />
      </div>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Recent Queries</h2>
          <Link href="/queries" className="panel-link">
            View all <IconChevronRight size={12} />
          </Link>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Project</th>
              <th>Query</th>
              <th style={{ width: 100, textAlign: 'right' }}>Tokens</th>
              <th style={{ width: 90, textAlign: 'right' }}>Cost</th>
              <th style={{ width: 110, textAlign: 'right' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr><td colSpan={5} className="empty">No se pudo conectar a la base de datos. Verifica DATABASE_URL en .env.local</td></tr>
            )}
            {!stats && !error && (
              <tr><td colSpan={5} className="empty mono small">Loading…</td></tr>
            )}
            {stats?.recentQueries.map(q => (
              <tr key={q.id}>
                <td><ProjectBadge name={q.project_name ?? '—'} /></td>
                <td className="cell-query">
                  <span className="query-text" title={q.query_text}>{q.query_text}</span>
                </td>
                <td className="num mono">{fmtNumber(Number(q.in_tokens) + Number(q.out_tokens))}</td>
                <td className="num mono">{fmtCost(Number(q.cost))}</td>
                <td className="num mono muted">{timeAgo(q.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
