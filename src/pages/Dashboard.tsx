import { useState } from 'react'
import type { User } from '../types/auth'
import { authService } from '../services/authService'

interface DashboardProps {
  user: User
  onLogout: () => void
  onUpdateUser: (user: User) => void
}

export function Dashboard({ user, onLogout, onUpdateUser }: DashboardProps) {
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ fullName: user?.fullName ?? '', username: user?.username ?? '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const result = await authService.updateProfile({ fullName: form.fullName, username: form.username })
    if (result.success && result.user) {
      onUpdateUser(result.user)
      setMessage({ type: 'success', text: result.message })
      setEditMode(false)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setLoading(false)
  }

  const initials = user?.fullName
    ?.split(' ')
    ?.slice(0, 2)
    ?.map((n) => n?.[0] ?? '')
    ?.join('')
    ?.toUpperCase() ?? '?'

  const joinDate = new Date(user?.createdAt ?? Date.now()).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#0f0f13] animate-fade-in">
      <nav className="border-b border-white/5 bg-white/5 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">V</span>
            </div>
            <span className="text-sm font-semibold text-white/80 tracking-tight">Varecvsce</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {user?.username ?? ''}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              خروج
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <h2 className="text-lg font-semibold text-white">{user?.fullName ?? ''}</h2>
            <p className="text-sm text-gray-500 mb-1">@{user?.username ?? ''}</p>
            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium mt-2 ${
              user?.role === 'admin'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              {user?.role === 'admin' ? (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  مدير
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  مستخدم
                </>
              )}
            </span>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white">معلومات الحساب</h3>
                {!editMode && (
                  <button
                    onClick={() => { setEditMode(true); setMessage(null) }}
                    className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    تعديل
                  </button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="label">الاسم الكامل</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">اسم المستخدم</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                      dir="ltr"
                    />
                  </div>
                  {message && (
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs ${
                      message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setEditMode(false)
                        setForm({ fullName: user?.fullName ?? '', username: user?.username ?? '' })
                        setMessage(null)
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="space-y-4">
                  {[
                    { label: 'الاسم الكامل', value: user?.fullName ?? '' },
                    { label: 'اسم المستخدم', value: `@${user?.username ?? ''}`, dir: 'ltr' as const },
                    { label: 'البريد الإلكتروني', value: user?.email ?? '', dir: 'ltr' as const },
                    { label: 'تاريخ الانضمام', value: joinDate },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                      <dt className="text-xs text-gray-500">{item.label}</dt>
                      <dd className="text-sm text-white/80 font-medium" dir={item.dir}>{item.value}</dd>
                    </div>
                  ))}
                  {message?.type === 'success' && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400">
                      {message.text}
                    </div>
                  )}
                </dl>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'الحالة', value: 'نشط', color: 'text-green-400', dot: 'bg-green-400' },
                { label: 'الصلاحية', value: user?.role === 'admin' ? 'مدير' : 'مستخدم', color: 'text-violet-400', dot: 'bg-violet-400' },
                { label: 'النوع', value: 'عضو', color: 'text-indigo-400', dot: 'bg-indigo-400' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <div className={`flex items-center justify-center gap-1.5 mb-1 ${stat.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${stat.dot} animate-pulse-slow`} />
                    <span className="text-sm font-semibold">{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
