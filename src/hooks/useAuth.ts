import { useState, useCallback, useEffect } from 'react'
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth'
import { authService } from '../services/authService'
import { supabase } from '../lib/supabase'

function mapSupabaseUser(sbUser: {
  id: string
  email?: string
  created_at: string
  user_metadata?: Record<string, string>
}): User {
  return {
    id: sbUser.id,
    email: sbUser.email ?? '',
    username: sbUser.user_metadata?.['username'] ?? sbUser.email?.split('@')[0] ?? '',
    fullName: sbUser.user_metadata?.['full_name'] ?? '',
    createdAt: sbUser.created_at,
    role: (sbUser.user_metadata?.['role'] as 'admin' | 'user') ?? 'user',
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setAuthState({ user: mapSupabaseUser(data.session.user), isAuthenticated: true })
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState({ user: mapSupabaseUser(session.user), isAuthenticated: true })
      } else {
        setAuthState({ user: null, isAuthenticated: false })
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    return authService.login(credentials)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    return authService.register(data)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
  }, [])

  const updateUser = useCallback((user: User) => {
    setAuthState((prev) => ({ ...prev, user }))
  }, [])

  return { authState, loading, login, register, logout, updateUser }
}
