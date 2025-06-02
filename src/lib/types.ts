export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  error?: string
}
