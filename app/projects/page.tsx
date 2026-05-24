'use client'

import { useEffect, useState, useMemo } from 'react'
import { fmtNumber, fmtCost, timeAgo, getProjectColor } from '@/lib/format'

interface Project {
  id: number
  name: string
  repo_url: string | null
  last_indexed_at: string | null
  file_count: number
  query_count: number
  total_cost: number
  total_tokens: number
}

type SortDir = 'asc' | 'desc'

function SortTh({
  k, active, dir, onSort, align, children,
}: {
  k: string
  active: boolean
  dir: SortDir
  onSort: (k: string) => void
  align?: string
  children: React.ReactNode
}) {
  return (
    <th
      onClick={() => onSort(k)}
      className={'sortable' + (active ? ' sortable--active' : '')}
      style={align ? { textAlign: align as 'right' | 'left' } : undefined}
    >
      <span className="sort-label">
        {children}
        <span className={'sort-arrow' + (active ? ' sort-arrow--active' : '')}>
          {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError]       = useState(false)
  const [sortKey, setSortKey]   = useState('query_count')
  const [sortDir, setSortDir]   = useState<SortDir>('desc')

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(setProjects)
      .catch(() => setError(true))
  }, [])

  const sorted = useMemo(() => {
    return [...projects].sort((a, b) => {
      const av = a[sortKey as keyof Project]
      const bv = b[sortKey as keyof Project]
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av)
    })
  }, [projects, sortKey, sortDir])

  function setSort(key: string) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir(key === 'name' ? 'asc' : 'desc') }
  }

  const totalFiles = projects.reduce((s, p) => s + p.file_count, 0)

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <div className="page-subtitle">
            {projects.length} indexed · {fmtNumber(totalFiles)} files total
          </div>
        </div>
      </div>

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <SortTh k="name"          active={sortKey === 'name'}          dir={sortDir} onSort={setSort}>Name</SortTh>
              <SortTh k="file_count"    active={sortKey === 'file_count'}    dir={sortDir} onSort={setSort} align="right">Files</SortTh>
              <SortTh k="last_indexed_at" active={sortKey === 'last_indexed_at'} dir={sortDir} onSort={setSort} align="right">Last Indexed</SortTh>
              <SortTh k="query_count"   active={sortKey === 'query_count'}   dir={sortDir} onSort={setSort} align="right">Queries</SortTh>
              <SortTh k="total_tokens"  active={sortKey === 'total_tokens'}  dir={sortDir} onSort={setSort} align="right">Tokens</SortTh>
              <SortTh k="total_cost"    active={sortKey === 'total_cost'}    dir={sortDir} onSort={setSort} align="right">Cost</SortTh>
            </tr>
          </thead>
          <tbody>
            {error && <tr><td colSpan={6} className="empty">No se pudo conectar a la base de datos.</td></tr>}
            {!projects.length && !error && <tr><td colSpan={6} className="empty mono small">Loading…</td></tr>}
            {sorted.map(p => {
              const color = getProjectColor(p.name)
              return (
                <tr key={p.id}>
                  <td>
                    <div className="project-name">
                      <span className="project-dot" style={{ background: color.dot }} />
                      <span className="mono bold">{p.name}</span>
                    </div>
                  </td>
                  <td className="num mono">{p.file_count.toLocaleString('en-US')}</td>
                  <td className="num mono muted">
                    {p.last_indexed_at ? timeAgo(p.last_indexed_at) : '—'}
                  </td>
                  <td className="num mono">{p.query_count}</td>
                  <td className="num mono">{fmtNumber(Number(p.total_tokens))}</td>
                  <td className="num mono">{fmtCost(p.total_cost)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </>
  )
}
