import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const [projects, queriesToday, totals, recent] = await Promise.all([
      query('SELECT COUNT(*)::int AS count FROM projects'),
      query("SELECT COUNT(*)::int AS count FROM queries WHERE created_at >= CURRENT_DATE"),
      query(`
        SELECT
          COALESCE(SUM(deepseek_input_tokens + deepseek_output_tokens), 0)::bigint AS tokens,
          COALESCE(SUM(deepseek_cost_usd), 0)::float AS cost
        FROM queries
      `),
      query(`
        SELECT q.id,
               q.query_text,
               q.deepseek_input_tokens  AS in_tokens,
               q.deepseek_output_tokens AS out_tokens,
               q.deepseek_cost_usd      AS cost,
               q.created_at,
               p.name                   AS project_name
        FROM queries q
        LEFT JOIN sessions s ON q.session_id = s.id
        LEFT JOIN projects p ON s.project_id = p.id
        ORDER BY q.created_at DESC
        LIMIT 8
      `),
    ])

    return NextResponse.json({
      projects:      projects[0]?.count ?? 0,
      queriesToday:  queriesToday[0]?.count ?? 0,
      totalTokens:   Number(totals[0]?.tokens ?? 0),
      totalCost:     Number(totals[0]?.cost ?? 0),
      recentQueries: recent,
    })
  } catch (err) {
    console.error('[/api/stats]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
