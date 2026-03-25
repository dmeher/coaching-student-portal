import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/teachers — returns public teacher profiles
export async function GET() {
  try {
    const supabase = getSupabase()
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('id, display_name, subject, phone, avatar_url, primary_teacher_id')
      .order('primary_teacher_id', { ascending: true, nullsFirst: true })

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch teachers' }, { status: 500 })
    }

    // Only include teachers who have a display_name set (skip unnamed/unconfigured accounts)
    const result = (teachers || [])
      .filter((t: any) => t.display_name)
      .map((t: any) => ({
        id: t.id,
        display_name: t.display_name,
        subject: t.subject || null,
        phone: t.phone || null,
        avatar_url: t.avatar_url || null,
        is_primary: t.primary_teacher_id === null,
      }))

    return NextResponse.json({ teachers: result }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
