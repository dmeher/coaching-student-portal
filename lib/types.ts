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

// Holiday Types
export interface Holiday {
  id: string;
  date: string;
  title: string;
  description?: string | null;
}

export interface FeePayment {
  id: string
  amount: number
  notes: string | null
  payment_date: string
  collected_by: string | null
  created_at: string
}

export interface FeeEntry {
  id: string
  amount: number
  due_date: string
  status: 'pending' | 'partial' | 'paid'
  fee_type?: 'monthly' | 'arrear'
  description?: string | null
  created_at: string
  payments: FeePayment[]
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
