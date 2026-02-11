'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { authApi } from '@/lib/api-client'

export interface User {
  userId: string
  email: string
  name: string
  role: 'student' | 'instructor'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    name: string
    role: string
    phone?: string
  }) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const data: any = await authApi.getSession()
      if (data && data.user) {
        setUser(data.user as User)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshSession()
    setLoading(false)
  }, [refreshSession])

  const login = useCallback(
    async (email: string, password: string, role: string) => {
      setLoading(true)
      try {
        const data: any = await authApi.login({ email, password, role })
        if (data && data.user) {
          setUser(data.user as User)
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const register = useCallback(
    async (data: {
      email: string
      password: string
      name: string
      role: string
      phone?: string
    }) => {
      setLoading(true)
      try {
        const response: any = await authApi.register(data)
        if (response && response.user) {
          setUser(response.user as User)
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authApi.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
