import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// GET /api/holidays?teacher_id=<uuid>&year=2026&month=3
// Public — no auth required (student portal read-only access)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const teacherId = searchParams.get('teacher_id')
  const year = searchParams.get('year') || new Date().getFullYear().toString()
  const month = searchParams.get('month')

  if (!teacherId) {
    return NextResponse.json({ message: 'teacher_id is required' }, { status: 400 })
  }

  const supabase = getSupabase()

  let query = supabase
    .from('holidays')
    .select('id, date, title, description')
    .eq('teacher_id', teacherId)
    .order('date', { ascending: true })

  if (month) {
    const paddedMonth = month.padStart(2, '0')
    const start = `${year}-${paddedMonth}-01`
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const end = `${year}-${paddedMonth}-${String(lastDay).padStart(2, '0')}`
    query = query.gte('date', start).lte('date', end)
  } else {
    query = query.gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })

  return NextResponse.json({ holidays: data || [] })
}
