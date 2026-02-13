/**
 * Temporary migration endpoint to fix bookings table schema
 * DELETE THIS FILE AFTER MIGRATION
 */
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

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

    // Try Supabase pg-meta endpoint (used by SQL Editor)
    const endpoints = [
      { url: `${SUPABASE_URL}/pg-meta/default/query`, body: { query: sql } },
      { url: `${SUPABASE_URL}/rest/v1/rpc/exec_sql`, body: { query: sql } },
    ]

    const results: any[] = []
    let success = false

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'apikey': SERVICE_KEY,
            'X-Connection-Encrypted': '1',
          },
          body: JSON.stringify(ep.body),
        })
        const text = await res.text()
        results.push({ endpoint: ep.url, status: res.status, body: text.substring(0, 500) })
        if (res.ok) {
          success = true
          break
        }
      } catch (e: any) {
        results.push({ endpoint: ep.url, error: e.message })
      }
    }

    return NextResponse.json({ success, results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST to run migration' })
}
