import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type StudentRow = {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  status: 'active' | 'inactive'
  class_fees?: { class_name?: string } | null
}

type AttendanceRecord = {
  student_id: string
  date_value: string
  status_value: string | boolean | null
}

function normalizeAttendanceStatus(value: string | boolean | null): 'present' | 'absent' | 'unknown' {
  if (typeof value === 'boolean') return value ? 'present' : 'absent'
  if (typeof value !== 'string') return 'unknown'

  const v = value.toLowerCase().trim()
  if (['present', 'p', '1', 'true'].includes(v)) return 'present'
  if (['absent', 'a', '0', 'false'].includes(v)) return 'absent'
  return 'unknown'
}

async function queryAttendance(
  studentIds: string[],
  fromDate: string,
  toDate: string
): Promise<AttendanceRecord[]> {
  const supabase = getSupabase()

  const attempts = [
    {
      table: 'attendance',
      selectClause: 'student_id, attendance_date, status',
      dateColumn: 'attendance_date',
      mapper: (r: any): AttendanceRecord => ({
        student_id: r.student_id,
        date_value: r.attendance_date,
        status_value: r.status,
      }),
    },
    {
      table: 'student_attendance',
      selectClause: 'student_id, attendance_date, status',
      dateColumn: 'attendance_date',
      mapper: (r: any): AttendanceRecord => ({
        student_id: r.student_id,
        date_value: r.attendance_date,
        status_value: r.status,
      }),
    },
    {
      table: 'student_attendance',
      selectClause: 'student_id, date, status',
      dateColumn: 'date',
      mapper: (r: any): AttendanceRecord => ({
        student_id: r.student_id,
        date_value: r.date,
        status_value: r.status,
      }),
    },
  ]

  for (const attempt of attempts) {
    const { data, error } = await supabase
      .from(attempt.table)
      .select(attempt.selectClause)
      .in('student_id', studentIds)
      .gte(attempt.dateColumn, fromDate)
      .lte(attempt.dateColumn, toDate)
      .order(attempt.dateColumn, { ascending: false })

    if (!error) {
      return (data || []).map(attempt.mapper)
    }
  }

  throw new Error('Attendance table/columns not found or inaccessible with current permissions.')
}

// GET /api/attendance — monthly attendance summary for active students
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const classFilter = searchParams.get('class') || ''
    const month = searchParams.get('month') || ''

    const today = new Date()
    const monthBase = month ? new Date(`${month}-01T00:00:00`) : new Date(today.getFullYear(), today.getMonth(), 1)
    const start = new Date(monthBase.getFullYear(), monthBase.getMonth(), 1)
    const end = new Date(monthBase.getFullYear(), monthBase.getMonth() + 1, 0)
    const fromDate = start.toISOString().slice(0, 10)
    const toDate = end.toISOString().slice(0, 10)

    const supabase = getSupabase()
    let studentsQuery = supabase
      .from('students')
      .select(
        `
        id,
        name,
        gender,
        status,
        class_fees:class_id (
          class_name
        )
        `
      )
      .eq('status', 'active')
      .order('name', { ascending: true })

    if (search) {
      studentsQuery = studentsQuery.ilike('name', `%${search}%`)
    }

    const { data: studentsData, error: studentsError } = await studentsQuery
    if (studentsError) {
      return NextResponse.json({ message: 'Failed to fetch students' }, { status: 500 })
    }

    let students = (studentsData || []) as StudentRow[]
    if (classFilter) {
      students = students.filter((s) =>
        (s.class_fees?.class_name || '').toLowerCase().includes(classFilter.toLowerCase())
      )
    }

    if (students.length === 0) {
      return NextResponse.json(
        {
          month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
          fromDate,
          toDate,
          students: [],
        },
        { status: 200 }
      )
    }

    const studentIds = students.map((s) => s.id)
    const attendanceRows = await queryAttendance(studentIds, fromDate, toDate)

    const grouped = new Map<string, { present: number; absent: number; total: number }>()
    for (const id of studentIds) {
      grouped.set(id, { present: 0, absent: 0, total: 0 })
    }

    for (const row of attendanceRows) {
      const current = grouped.get(row.student_id)
      if (!current) continue

      const normalized = normalizeAttendanceStatus(row.status_value)
      if (normalized === 'present') current.present += 1
      if (normalized === 'absent') current.absent += 1
      if (normalized !== 'unknown') current.total += 1
    }

    const result = students.map((s) => {
      const agg = grouped.get(s.id) || { present: 0, absent: 0, total: 0 }
      const percentage = agg.total > 0 ? Math.round((agg.present / agg.total) * 100) : null

      const attendanceByDate = new Map<string, 'present' | 'absent' | 'unknown'>()
      for (const row of attendanceRows) {
        if (row.student_id !== s.id) continue
        const normalized = normalizeAttendanceStatus(row.status_value)
        attendanceByDate.set(row.date_value, normalized)
      }

      const daily = Array.from(attendanceByDate.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, status]) => ({ date, status }))

      return {
        id: s.id,
        name: s.name,
        gender: s.gender,
        class_name: s.class_fees?.class_name || 'N/A',
        attendance: {
          present: agg.present,
          absent: agg.absent,
          total: agg.total,
          percentage,
        },
        daily,
      }
    })

    return NextResponse.json(
      {
        month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
        fromDate,
        toDate,
        students: result,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
