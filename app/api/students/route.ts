import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/students — returns public student info (name, class, gender, address only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const classFilter = searchParams.get('class') || ''
    const genderFilter = searchParams.get('gender') || ''

    const supabase = getSupabase()
    let query = supabase
      .from('students')
      .select(
        `
        id,
        name,
        parent_name,
        gender,
        address,
        status,
        class_fees:class_id (
          class_name
        )
        `
      )
      .eq('status', 'active')
      .order('name', { ascending: true })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: students, error } = await query

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch students' }, { status: 500 })
    }

    // Shape the response — only expose permitted fields
    let result = (students || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      parent_name: s.parent_name || null,
      class_name: s.class_fees?.class_name || 'N/A',
      gender: s.gender,
      address: s.address || null,
      status: s.status,
    }))

    // Apply class filter after join
    if (classFilter) {
      result = result.filter((s) =>
        s.class_name.toLowerCase().includes(classFilter.toLowerCase())
      )
    }

    // Apply gender filter
    if (genderFilter) {
      result = result.filter((s) => s.gender === genderFilter)
    }

    return NextResponse.json({ students: result }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
