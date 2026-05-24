import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query(`
      SELECT
        p.id,
        p.name,
        p.repo_url,
        p.last_indexed_at,
        COUNT(DISTINCT f.id)::int                                              AS file_count,
        COUNT(DISTINCT q.id)::int                                              AS query_count,
        COALESCE(SUM(q.deepseek_cost_usd), 0)::float                          AS total_cost,
        COALESCE(SUM(q.deepseek_input_tokens + q.deepseek_output_tokens), 0)  AS total_tokens
      FROM projects p
      LEFT JOIN indexed_files f ON p.id = f.project_id
      LEFT JOIN sessions      s ON p.id = s.project_id
      LEFT JOIN queries       q ON s.id = q.session_id
      GROUP BY p.id
      ORDER BY p.name
    `)
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[/api/projects]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
