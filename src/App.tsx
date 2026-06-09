import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'
import { Dashboard } from './pages/Dashboard'

type AuthView = 'login' | 'register'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center animate-pulse">
          <span className="text-xl font-bold text-white">V</span>
        </div>
        <svg className="w-5 h-5 text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    </div>
  )
}

function AuthBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-900/5 blur-3xl" />
    </div>
  )
}

export default function App() {
  const { authState, loading, login, register, logout, updateUser } = useAuth()
  const [view, setView] = useState<AuthView>('login')

  if (loading) return <LoadingScreen />

  if (authState.isAuthenticated && authState.user) {
    return (
      <Dashboard
        user={authState.user}
        onLogout={logout}
        onUpdateUser={updateUser}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4 relative">
      <AuthBackground />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-sm font-bold text-white">V</span>
          </div>
          <span className="text-base font-semibold text-white/70 tracking-tight">Varecvsce</span>
        </div>

        <div className="glass-card p-8">
          {view === 'login' ? (
            <LoginForm
              onLogin={login}
              onSwitchToRegister={() => setView('register')}
            />
          ) : (
            <RegisterForm
              onRegister={register}
              onSwitchToLogin={() => setView('login')}
            />
          )}
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          &copy; {new Date().getFullYear()} Varecvsce. All rights reserved.
        </p>
      </div>
    </div>
  )
}
