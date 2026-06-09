import { supabase } from '../lib/supabase'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth'

function mapUser(sbUser: {
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

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  if (msg.includes('Email not confirmed')) return 'يرجى تأكيد بريدك الإلكتروني أولاً ثم حاول تسجيل الدخول'
  if (msg.includes('User already registered')) return 'هذا البريد الإلكتروني مسجّل مسبقاً'
  if (msg.includes('Password should be at least')) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
  if (msg.includes('Unable to validate email')) return 'صيغة البريد الإلكتروني غير صحيحة'
  if (msg.includes('Email rate limit exceeded')) return 'تم إرسال طلبات كثيرة، انتظر قليلاً ثم حاول مجدداً'
  if (msg.includes('signup_disabled')) return 'إنشاء الحسابات مغلق حالياً'
  if (msg.includes('Network')) return 'تعذّر الاتصال بالإنترنت، تحقق من اتصالك'
  return msg
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    })

    if (error) {
      return { success: false, message: translateError(error.message) }
    }

    if (!data.user) {
      return { success: false, message: 'حدث خطأ غير متوقع، حاول مجدداً' }
    }

    return { success: true, message: 'تم تسجيل الدخول بنجاح', user: mapUser(data.user) }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: {
          full_name: data.fullName.trim(),
          username: data.username.trim().toLowerCase(),
          role: 'user',
        },
      },
    })

    if (error) {
      return { success: false, message: translateError(error.message) }
    }

    if (!authData.user) {
      return { success: false, message: 'حدث خطأ غير متوقع، حاول مجدداً' }
    }

    const confirmed = authData.user.email_confirmed_at !== null
    if (!confirmed) {
      return {
        success: true,
        needsConfirmation: true,
        message: 'تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتفعيل الحساب.',
        user: mapUser(authData.user),
      }
    }

    return { success: true, message: 'تم إنشاء الحساب بنجاح', user: mapUser(authData.user) }
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut()
  },

  async updateProfile(
    updates: Partial<{ fullName: string; username: string }>
  ): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...(updates.fullName !== undefined && { full_name: updates.fullName.trim() }),
        ...(updates.username !== undefined && { username: updates.username.trim().toLowerCase() }),
      },
    })

    if (error) {
      return { success: false, message: translateError(error.message) }
    }

    if (!data.user) {
      return { success: false, message: 'حدث خطأ غير متوقع' }
    }

    return { success: true, message: 'تم تحديث الملف الشخصي بنجاح', user: mapUser(data.user) }
  },
}
