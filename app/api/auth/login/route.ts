import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mobile_no = (body.mobile_no || '').trim()

    if (!mobile_no) {
      return NextResponse.json({ message: 'Mobile number is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data: students, error } = await supabase
      .from('students')
      .select(
        `
        id,
        name,
        parent_name,
        gender,
        address,
        status,
        teacher_id,
        class_fees:class_id (
          class_name
        )
        `
      )
      .eq('mobile_no', mobile_no)
      .eq('status', 'active')
      .limit(1)

    if (error) {
      return NextResponse.json({ message: 'Database error' }, { status: 500 })
    }

    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: 'No active student found with this mobile number' },
        { status: 404 }
      )
    }

    const s = students[0] as any
    // Return student info — mobile_no is intentionally excluded from the response
    return NextResponse.json(
      {
        student: {
          id: s.id,
          name: s.name,
          parent_name: s.parent_name || null,
          class_name: s.class_fees?.class_name || 'N/A',
          gender: s.gender,
          address: s.address || null,
          status: s.status,
          teacher_id: s.teacher_id || null,
        },
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
