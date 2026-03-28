import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST — subscribe (upsert) a push subscription for this student's teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, p256dh, auth, teacher_id, user_agent } = body

    if (!endpoint || !p256dh || !auth || !teacher_id) {
      return NextResponse.json(
        { message: 'endpoint, p256dh, auth, and teacher_id are required' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Upsert by endpoint — update keys if the subscription rotated
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        owner_id: teacher_id,
        teacher_id,
        endpoint,
        p256dh,
        auth,
        target_app: 'student_portal',
        user_agent: user_agent || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    )

    if (error) {
      return NextResponse.json({ message: 'Failed to save subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE — unsubscribe by endpoint
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint } = body

    if (!endpoint) {
      return NextResponse.json({ message: 'endpoint is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)
      .eq('target_app', 'student_portal')

    if (error) {
      return NextResponse.json({ message: 'Failed to delete subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
