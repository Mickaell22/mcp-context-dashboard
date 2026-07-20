import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const PER_PAGE = 20

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page    = Math.max(1, parseInt(searchParams.get('page')    ?? '1'))
  const project = searchParams.get('project') ?? 'all'
  const search  = searchParams.get('search')  ?? ''
  const type    = searchParams.get('type')    ?? 'all'

  try {
    const whereParams: unknown[] = []
    const conditions: string[]   = []

    if (project !== 'all') {
      whereParams.push(project)
      conditions.push(`p.name = $${whereParams.length}`)
    }
    if (search.trim()) {
      whereParams.push(`%${search.trim()}%`)
      conditions.push(`q.query_text ILIKE $${whereParams.length}`)
    }
    // Las auditorias se distinguen por el prefijo "[audit:" del server; SQL fijo, sin input del usuario.
    if (type === 'audit') conditions.push(`q.query_text LIKE '[audit:%'`)
    if (type === 'query') conditions.push(`q.query_text NOT LIKE '[audit:%'`)

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const mainParams = [...whereParams, PER_PAGE, (page - 1) * PER_PAGE]
    const limitN  = whereParams.length + 1
    const offsetN = whereParams.length + 2

    const joinClause = `
      FROM queries q
      LEFT JOIN sessions s ON q.session_id = s.id
      LEFT JOIN projects p ON s.project_id = p.id
    `

    const [countRows, rows, projectRows] = await Promise.all([
      query(`SELECT COUNT(*)::int AS count ${joinClause} ${where}`, whereParams),
      query(`
        SELECT q.id,
               q.query_text,
               q.response_text,
               q.deepseek_input_tokens  AS in_tokens,
               q.deepseek_output_tokens AS out_tokens,
               q.deepseek_cost_usd      AS cost,
               q.created_at,
               p.name                   AS project_name
        ${joinClause}
        ${where}
        ORDER BY q.created_at DESC
        LIMIT $${limitN} OFFSET $${offsetN}
      `, mainParams),
      query('SELECT name FROM projects ORDER BY name'),
    ])

    const total = Number(countRows[0]?.count ?? 0)
    return NextResponse.json({
      queries:  rows,
      total,
      page,
      pages:    Math.max(1, Math.ceil(total / PER_PAGE)),
      projects: projectRows.map(r => r.name as string),
    })
  } catch (err) {
    console.error('[/api/queries]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
