/**
 * Temporary migration endpoint to fix bookings table schema
 * DELETE THIS FILE AFTER MIGRATION
 */
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Step 1: Try to drop the existing bookings table by deleting all rows first
    // Then we'll recreate it without UUID FK constraint on instructor_id

    // First, check if table exists by trying to query it
    const { data: existingBookings, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1)

    // Try using supabase's raw SQL via the pg-meta endpoint
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lswzvdehnzreoctrjjrv.supabase.co'
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow all access via service role" ON bookings FOR ALL USING (true);
      CREATE INDEX idx_bookings_student ON bookings(student_id);
      CREATE INDEX idx_bookings_instructor ON bookings(instructor_id);
      NOTIFY pgrst, 'reload schema';
    `

    // Try multiple endpoints that Supabase might support
    const endpoints = [
      `${SUPABASE_URL}/rest/v1/rpc/exec_sql`,
      `${SUPABASE_URL}/pg/query`,
    ]

    const results: any[] = []

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'apikey': SERVICE_KEY,
          },
          body: JSON.stringify({ query: sql }),
        })
        const text = await res.text()
        results.push({ endpoint, status: res.status, body: text.substring(0, 500) })
        if (res.ok) break
      } catch (e: any) {
        results.push({ endpoint, error: e.message })
      }
    }

    return NextResponse.json({
      message: 'Migration attempted',
      tableExists: !checkError,
      checkError: checkError?.message,
      results,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
