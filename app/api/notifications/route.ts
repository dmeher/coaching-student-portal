import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/notifications?teacher_id=<uuid>
// Returns up to 50 notifications sent by the given teacher that target the student portal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacher_id = searchParams.get('teacher_id')

    if (!teacher_id) {
      return NextResponse.json({ message: 'teacher_id query param is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notifications')
      .select('id, title, message, sender_name, created_at')
      .eq('owner_id', teacher_id)
      .contains('target_apps', ['student_portal'])
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 })
    }

    return NextResponse.json({ notifications: data || [] }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
