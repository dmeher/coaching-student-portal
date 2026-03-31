import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const monthKeyRegex = /^[0-9]{4}-(0[1-9]|1[0-2])$/

type AwardRow = {
  id: string
  student_id: string
  month_key: string
  skill_category: string
  award_title: string
  remarks: string | null
  created_at: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const monthKey = (searchParams.get('month') || '').trim()
    const studentId = (searchParams.get('student_id') || '').trim()
    const classFilter = (searchParams.get('class') || '').trim().toLowerCase()

    if (monthKey && !monthKeyRegex.test(monthKey)) {
      return NextResponse.json({ message: 'Month must be in YYYY-MM format' }, { status: 400 })
    }

    const supabase = getSupabase()
    let query = supabase
      .from('student_awards')
      .select('id, student_id, month_key, skill_category, award_title, remarks, created_at')
      .order('month_key', { ascending: false })
      .order('created_at', { ascending: false })

    if (monthKey) {
      query = query.eq('month_key', monthKey)
    }

    if (studentId) {
      query = query.eq('student_id', studentId)
    }

    const { data: awards, error } = await query

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch awards' }, { status: 500 })
    }

    const studentIds = Array.from(new Set((awards || []).map((award: AwardRow) => award.student_id)))
    if (studentIds.length === 0) {
      return NextResponse.json({ awards: [] }, { status: 200 })
    }

    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select(
        `
        id,
        name,
        status,
        class_fees:class_id (
          class_name
        )
        `
      )
      .in('id', studentIds)

    if (studentsError) {
      return NextResponse.json({ message: 'Failed to fetch award recipients' }, { status: 500 })
    }

    const studentsById = new Map(
      (students || []).map((student: any) => [
        student.id,
        {
          name: student.name,
          class_name: student.class_fees?.class_name || 'N/A',
          status: student.status,
        },
      ])
    )

    const result = (awards || [])
      .map((award: AwardRow) => {
        const student = studentsById.get(award.student_id)
        if (!student) {
          return null
        }

        return {
          ...award,
          student_name: student.name,
          class_name: student.class_name,
        }
      })
      .filter((award): award is NonNullable<typeof award> => Boolean(award))
      .filter((award) => (classFilter ? award.class_name.toLowerCase().includes(classFilter) : true))

    return NextResponse.json({ awards: result }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}