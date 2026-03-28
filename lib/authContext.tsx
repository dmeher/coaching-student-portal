'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface StudentSession {
  id: string
  name: string
  parent_name: string | null
  class_name: string
  gender: 'male' | 'female' | 'other'
  address: string | null
  status: 'active' | 'inactive'
}

interface AuthContextType {
  student: StudentSession | null
  login: (student: StudentSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  student: null,
  login: () => {},
  logout: () => {},
})

const SESSION_KEY = 'student_portal_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentSession | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) {
        setStudent(JSON.parse(stored) as StudentSession)
      }
    } catch {
      // malformed data — ignore
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
    <AuthContext.Provider value={{ student, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
