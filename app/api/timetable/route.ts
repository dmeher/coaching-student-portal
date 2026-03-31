import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const VALID_CLASSES = ['8th', '9th', '10th']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SESSIONS = ['morning', 'evening']

function defaultClassTimetable(): Record<string, Record<string, string>> {
  return {
    Monday:    { morning: 'Math',    evening: 'English' },
    Tuesday:   { morning: 'Math',    evening: 'Science' },
    Wednesday: { morning: 'Math',    evening: 'S.Sc'    },
    Thursday:  { morning: 'Math',    evening: 'Odia'    },
    Friday:    { morning: 'Math',    evening: 'Science' },
    Saturday:  { morning: 'English', evening: 'S.Sc'   },
    Sunday:    { morning: 'Hindi',   evening: 'Holiday' },
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teacher_id = searchParams.get('teacher_id')
    const class_name = searchParams.get('class_name')

    if (!teacher_id || !class_name) {
      return NextResponse.json({ message: 'Missing teacher_id or class_name' }, { status: 400 })
    }

    if (!VALID_CLASSES.includes(class_name)) {
      return NextResponse.json({ message: 'Invalid class_name' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('timetable')
      .select('timetable_data')
      .eq('teacher_id', teacher_id)
      .single()

    if (error || !data || !data.timetable_data) {
      return NextResponse.json({ timetable: defaultClassTimetable() }, { status: 200 })
    }

    const classData = data.timetable_data[class_name]
    if (!classData) {
      return NextResponse.json({ timetable: defaultClassTimetable() }, { status: 200 })
    }

    return NextResponse.json({ timetable: classData }, { status: 200 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
