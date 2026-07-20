import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Subqueries en vez de JOINs planos: el producto files x queries inflaba los SUM.
    const rows = await query(`
      SELECT
        p.id,
        p.name,
        p.repo_url,
        p.last_indexed_at,
        COALESCE(f.file_count, 0)     AS file_count,
        COALESCE(s.session_count, 0)  AS session_count,
        COALESCE(q.query_count, 0)    AS query_count,
        COALESCE(q.total_cost, 0)     AS total_cost,
        COALESCE(q.total_tokens, 0)   AS total_tokens,
        q.last_activity
      FROM projects p
      LEFT JOIN (
        SELECT project_id, COUNT(*)::int AS file_count
        FROM indexed_files GROUP BY project_id
      ) f ON f.project_id = p.id
      LEFT JOIN (
        SELECT project_id, COUNT(*)::int AS session_count
        FROM sessions GROUP BY project_id
      ) s ON s.project_id = p.id
      LEFT JOIN (
        SELECT s.project_id,
               COUNT(*)::int                                                   AS query_count,
               COALESCE(SUM(q.deepseek_cost_usd), 0)::float                    AS total_cost,
               COALESCE(SUM(q.deepseek_input_tokens + q.deepseek_output_tokens), 0)::bigint AS total_tokens,
               MAX(q.created_at)                                               AS last_activity
        FROM queries q
        JOIN sessions s ON q.session_id = s.id
        GROUP BY s.project_id
      ) q ON q.project_id = p.id
      ORDER BY p.name
    `)
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[/api/projects]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
