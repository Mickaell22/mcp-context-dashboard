'use client'

import React, { useEffect, useState } from 'react'
import { IconSearch, IconChevronRight, IconChevronLeft } from '@/components/icons'
import ProjectBadge from '@/components/project-badge'
import { fmtCost, fmtDateTime } from '@/lib/format'

interface Query {
  id: number
  query_text: string
  in_tokens: number
  out_tokens: number
  cost: number
  created_at: string
  project_name: string | null
}

interface Data {
  queries: Query[]
  total: number
  page: number
  pages: number
  projects: string[]
}

export default function Queries() {
  const [data, setData]         = useState<Data | null>(null)
  const [error, setError]       = useState(false)
  const [page, setPage]         = useState(1)
  const [project, setProject]   = useState('all')
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    setError(false)
    const params = new URLSearchParams({
      page: String(page),
      project,
      search,
    })
    fetch(`/api/queries?${params}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setError(true))
  }, [page, project, search])

  function changeFilter(p: string) { setProject(p); setPage(1); setExpanded(null) }
  function changeSearch(s: string) { setSearch(s);  setPage(1); setExpanded(null) }

  const total = data?.total ?? 0

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Queries</h1>
          <div className="page-subtitle">
            {total.toLocaleString('en-US')} {total === 1 ? 'query' : 'queries'}
            {project !== 'all' || search ? ' · filtered' : ' · all time'}
          </div>
        </div>
        <div className="toolbar">
          <label className="search">
            <IconSearch size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search queries…"
              value={search}
              onChange={e => changeSearch(e.target.value)}
            />
          </label>
          <select
            className="select mono small"
            value={project}
            onChange={e => changeFilter(e.target.value)}
          >
            <option value="all">All projects</option>
            {data?.projects.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 32 }} />
              <th style={{ width: 170 }}>Project</th>
              <th>Query</th>
              <th style={{ width: 70, textAlign: 'right' }}>In</th>
              <th style={{ width: 70, textAlign: 'right' }}>Out</th>
              <th style={{ width: 90, textAlign: 'right' }}>Cost</th>
              <th style={{ width: 170, textAlign: 'right' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr><td colSpan={7} className="empty">No se pudo conectar a la base de datos.</td></tr>
            )}
            {!data && !error && (
              <tr><td colSpan={7} className="empty mono small">Loading…</td></tr>
            )}
            {data?.queries.length === 0 && (
              <tr><td colSpan={7} className="empty">No queries match this filter.</td></tr>
            )}
            {data?.queries.map(q => {
              const isOpen = expanded === q.id
              return (
                <React.Fragment key={q.id}>
                  <tr
                    className={'row-clickable' + (isOpen ? ' row-open' : '')}
                    onClick={() => setExpanded(isOpen ? null : q.id)}
                  >
                    <td>
                      <span className={'chev' + (isOpen ? ' chev--open' : '')}>
                        <IconChevronRight size={12} />
                      </span>
                    </td>
                    <td><ProjectBadge name={q.project_name ?? '—'} /></td>
                    <td className="cell-query">
                      <span className="query-text">{q.query_text}</span>
                    </td>
                    <td className="num mono">{Number(q.in_tokens).toLocaleString('en-US')}</td>
                    <td className="num mono">{Number(q.out_tokens).toLocaleString('en-US')}</td>
                    <td className="num mono">{fmtCost(Number(q.cost))}</td>
                    <td className="num mono muted">{fmtDateTime(q.created_at)}</td>
                  </tr>
                  {isOpen && (
                    <tr className="row-detail">
                      <td />
                      <td colSpan={6}>
                        <div className="detail-block">
                          <div className="detail-label">QUERY · #{q.id}</div>
                          <pre className="mono detail-pre">{q.query_text}</pre>
                          <div className="detail-meta">
                            <span><span className="muted">in:</span>{' '}<span className="mono">{Number(q.in_tokens).toLocaleString('en-US')} tok</span></span>
                            <span><span className="muted">out:</span>{' '}<span className="mono">{Number(q.out_tokens).toLocaleString('en-US')} tok</span></span>
                            <span><span className="muted">cost:</span>{' '}<span className="mono">{fmtCost(Number(q.cost))}</span></span>
                            <span><span className="muted">model:</span>{' '}<span className="mono">deepseek-chat</span></span>
                            <span><span className="muted">date:</span>{' '}<span className="mono">{fmtDateTime(q.created_at)}</span></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="pg-btn"
            onClick={() => { setPage(p => Math.max(1, p - 1)); setExpanded(null) }}
            disabled={!data || data.page <= 1}
          >
            <IconChevronLeft size={12} /> Prev
          </button>
          <span className="pg-info mono small">
            Page <span className="pg-num">{data?.page ?? 1}</span> of{' '}
            <span className="pg-num">{data?.pages ?? 1}</span>
          </span>
          <button
            className="pg-btn"
            onClick={() => { setPage(p => data ? Math.min(data.pages, p + 1) : p); setExpanded(null) }}
            disabled={!data || data.page >= data.pages}
          >
            Next <IconChevronRight size={12} />
          </button>
        </div>
      </section>
    </>
  )
}
