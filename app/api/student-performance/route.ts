import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { verifyStudentSessionToken } from '@/lib/studentAuth'

export const dynamic = 'force-dynamic'

const monthKeyRegex = /^[0-9]{4}-(0[1-9]|1[0-2])$/

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('x-student-session')
    const session = verifyStudentSessionToken(token)

    if (!session) {
      return NextResponse.json({ message: 'Please log in again to view performance.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const monthKey = (searchParams.get('month') || '').trim()

    if (monthKey && !monthKeyRegex.test(monthKey)) {
      return NextResponse.json({ message: 'Month must be in YYYY-MM format' }, { status: 400 })
    }

    const supabase = getSupabase()
    let query = supabase
      .from('student_performance')
      .select('id, student_id, month_key, exam_name, max_marks, marks_obtained, percentage, rating, remarks, created_at, updated_at')
      .eq('student_id', session.studentId)
      .order('month_key', { ascending: false })
      .order('created_at', { ascending: false })

    if (session.teacherId) {
      query = query.eq('owner_id', session.teacherId)
    }

    if (monthKey) {
      query = query.eq('month_key', monthKey)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch performance records' }, { status: 500 })
    }

    return NextResponse.json({ performance: data || [] }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}