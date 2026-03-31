'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface StudentSession {
  id: string
  name: string
  parent_name: string | null
  class_name: string
  gender: 'male' | 'female' | 'other'
  address: string | null
  mobile_no: string | null
  status: 'active' | 'inactive'
  teacher_id?: string | null
  session_token: string
}

interface AuthContextType {
  student: StudentSession | null
  isInitialized: boolean
  login: (student: StudentSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  student: null,
  isInitialized: false,
  login: () => {},
  logout: () => {},
})

const SESSION_KEY = 'student_portal_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentSession | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<StudentSession>
        if (typeof parsed.session_token === 'string' && parsed.session_token.trim()) {
          setStudent(parsed as StudentSession)
        } else {
          localStorage.removeItem(SESSION_KEY)
        }
      }
    } catch {
      // malformed data — ignore
    } finally {
      setIsInitialized(true)
    }
  }, [])

  function login(s: StudentSession) {
    setStudent(s)
    localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  }

  function logout() {
    setStudent(null)
    localStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ student, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
