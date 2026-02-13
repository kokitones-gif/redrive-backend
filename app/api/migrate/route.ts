/**
 * Temporary migration endpoint to fix bookings table schema
 * Visit https://redrive-backend.vercel.app/api/migrate to run
 * DELETE THIS FILE AFTER MIGRATION
 */
import { NextResponse } from 'next/server'

async function runMigration() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
  // Extract project ref from URL
  const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')

  const sql = `
    DROP TABLE IF EXISTS bookings CASCADE;
    CREATE TABLE bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES users(id),
      instructor_id TEXT NOT NULL,
      date DATE NOT NULL,
      time_slot TEXT NOT NULL,
      location TEXT NOT NULL,
      course_name TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
      use_instructor_vehicle BOOLEAN DEFAULT FALSE,
      total_price INTEGER,
      notes TEXT,
      instructor_name TEXT,
      instructor_avatar TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow all access via service role" ON bookings FOR ALL USING (true);
    CREATE INDEX idx_bookings_student ON bookings(student_id);
    CREATE INDEX idx_bookings_instructor ON bookings(instructor_id);
    NOTIFY pgrst, 'reload schema';
  `

  const results: any[] = []
  let success = false

  // Approach 1: Try postgres.js with Supavisor JWT mode
  try {
    const postgres = (await import('postgres')).default
    // Try multiple connection formats
    const regions = ['us-east-1', 'us-west-1', 'ap-northeast-1', 'eu-west-1']

    for (const region of regions) {
      if (success) break
      try {
        const connectionString = `postgresql://postgres.${projectRef}:${SERVICE_KEY}@aws-0-${region}.pooler.supabase.com:5432/postgres`
        const sqlClient = postgres(connectionString, {
          connect_timeout: 10,
          idle_timeout: 5,
          max: 1,
          ssl: 'require',
        })

        await sqlClient.unsafe(sql)
        await sqlClient.end()
        results.push({ method: `postgres.js (${region})`, status: 'success' })
        success = true
        break
      } catch (e: any) {
        results.push({ method: `postgres.js (${region})`, error: e.message?.substring(0, 200) })
      }
    }
  } catch (e: any) {
    results.push({ method: 'postgres.js import', error: e.message })
  }

  // Approach 2: Try Supabase pg-meta API
  if (!success) {
    const pgMetaEndpoints = [
      `${SUPABASE_URL}/pg-meta/default/query`,
      `${SUPABASE_URL}/pg/query`,
    ]

    for (const url of pgMetaEndpoints) {
      if (success) break
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'apikey': SERVICE_KEY,
          },
          body: JSON.stringify({ query: sql }),
        })
        const text = await res.text()
        results.push({ method: url, status: res.status, body: text.substring(0, 300) })
        if (res.ok) success = true
      } catch (e: any) {
        results.push({ method: url, error: e.message })
      }
    }
  }

  return { success, projectRef, results }
}

export async function GET() {
  try {
    const result = await runMigration()
    const html = `<!DOCTYPE html>
<html><head><title>Migration</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px}pre{background:#f5f5f5;padding:16px;border-radius:8px;overflow:auto}</style></head>
<body>
<h1>${result.success ? '✅ Migration SUCCESS' : '❌ Migration FAILED'}</h1>
<pre>${JSON.stringify(result, null, 2)}</pre>
<p><a href="/mypage">→ マイページへ</a> | <a href="/instructor/3">→ 講師ページへ</a></p>
</body></html>`
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
  } catch (error: any) {
    return new NextResponse(`<h1>Error</h1><pre>${error.message}</pre>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}

export async function POST() {
  try {
    const result = await runMigration()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
