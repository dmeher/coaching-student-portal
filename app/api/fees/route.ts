import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('student_id')

  if (!studentId) {
    return NextResponse.json({ message: 'student_id is required' }, { status: 400 })
  }

  const supabase = getSupabase()

  // Try with fee_type / description (migration 007+)
  const { data: fees, error } = await supabase
    .from('fees_added')
    .select(`
      id,
      amount,
      due_date,
      status,
      fee_type,
      description,
      created_at,
      payments (
        id,
        amount,
        notes,
        payment_date,
        collected_by,
        created_at
      )
    `)
    .eq('student_id', studentId)
    .order('due_date', { ascending: false })

  if (error) {
    // Fallback: without arrear columns
    const { data: fallbackFees, error: fallbackError } = await supabase
      .from('fees_added')
      .select(`
        id,
        amount,
        due_date,
        status,
        created_at,
        payments (
          id,
          amount,
          notes,
          payment_date,
          collected_by,
          created_at
        )
      `)
      .eq('student_id', studentId)
      .order('due_date', { ascending: false })

    if (fallbackError) {
      return NextResponse.json({ message: 'Failed to fetch fees' }, { status: 500 })
    }

    return NextResponse.json({ fees: fallbackFees || [] }, { status: 200 })
  }

  return NextResponse.json({ fees: fees || [] }, { status: 200 })
}
