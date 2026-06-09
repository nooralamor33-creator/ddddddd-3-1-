export interface User {
  id: string
  username: string
  email: string
  fullName: string
  createdAt: string
  role: 'admin' | 'user'
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  needsConfirmation?: boolean
}
