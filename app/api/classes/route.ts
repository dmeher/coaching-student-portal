import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/classes — returns distinct class names for filter dropdown
export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('class_fees')
      .select('class_name')
      .order('class_name', { ascending: true })

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch classes' }, { status: 500 })
    }

    const classes = (data || []).map((c: any) => c.class_name)
    // Deduplicate
    const unique = Array.from(new Set(classes))

    return NextResponse.json({ classes: unique }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
