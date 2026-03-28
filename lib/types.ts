// Public student info — limited fields exposed to students/parents
export interface StudentPublic {
  id: string
  name: string
  parent_name?: string
  class_name: string
  gender: 'male' | 'female' | 'other'
  address?: string
  status: 'active' | 'inactive'
}

// Teacher profile — public view
export interface TeacherProfile {
  id: string
  display_name: string | null
  subject: string | null
  phone: string | null
  avatar_url: string | null
  is_primary: boolean
}

export interface StudentAttendanceSummary {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  class_name: string
  attendance: {
    present: number
    absent: number
    total: number
    percentage: number | null
  }
  daily: {
    date: string
    status: 'present' | 'absent' | 'unknown'
    session?: string
  }[]
}
