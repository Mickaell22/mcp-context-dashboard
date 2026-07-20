'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IconFolder, IconBolt, IconChip, IconDollar, IconShield, IconChevronRight } from '@/components/icons'
import ProjectBadge from '@/components/project-badge'
import SkeletonRows from '@/components/skeleton'
import { fmtNumber, fmtCost, timeAgo, parseQuery } from '@/lib/format'

interface RecentQuery {
  id: number
  query_text: string
  in_tokens: number
  out_tokens: number
  cost: number
  created_at: string
  project_name: string | null
}

interface BlockedAttempt {
  id: number
  attempted_path: string
  reason: string | null
  created_at: string
}

interface Stats {
  projects: number
  queriesToday: number
  totalTokens: number
  totalCost: number
  recentQueries: RecentQuery[]
  blockedAttempts: number
  recentBlocked: BlockedAttempt[]
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
      .then(r => { if (!r.ok) throw new Error('DB error'); return r.json() })
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
        <StatCard
          label="Blocked"
          value={stats?.blockedAttempts ?? '—'}
          sub="whitelist denials"
          Icon={IconShield}
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
            {!stats && !error && <SkeletonRows cols={5} rows={4} />}
            {stats?.recentQueries.map(q => {
              const parsed = parseQuery(q.query_text)
              return (
                <tr key={q.id}>
                  <td><ProjectBadge name={q.project_name ?? '—'} /></td>
                  <td className="cell-query">
                    {parsed.type === 'audit' && (
                      <span className="tag-audit mono">audit:{parsed.category}</span>
                    )}
                    <span className="query-text" title={parsed.text}>{parsed.text}</span>
                  </td>
                  <td className="num mono">{fmtNumber(Number(q.in_tokens) + Number(q.out_tokens))}</td>
                  <td className="num mono">{fmtCost(Number(q.cost))}</td>
                  <td className="num mono muted">{timeAgo(q.created_at)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Blocked Attempts</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Path</th>
              <th style={{ width: 260 }}>Reason</th>
              <th style={{ width: 110, textAlign: 'right' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr><td colSpan={3} className="empty">No se pudo conectar a la base de datos.</td></tr>
            )}
            {!stats && !error && <SkeletonRows cols={3} rows={2} />}
            {stats && stats.recentBlocked.length === 0 && (
              <tr><td colSpan={3} className="empty">No blocked attempts. All whitelist checks passing.</td></tr>
            )}
            {stats?.recentBlocked.map(b => (
              <tr key={b.id}>
                <td className="mono small">{b.attempted_path}</td>
                <td className="small muted">{b.reason ?? '—'}</td>
                <td className="num mono muted">{timeAgo(b.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
