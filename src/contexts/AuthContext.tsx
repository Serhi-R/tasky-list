"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { useRouter } from "next/router"
import { getCurrentUser, setCurrentUser, removeCurrentUser, type AuthUser } from "../lib/auth"
import type { LoginData, RegisterData } from "../lib/types"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication on load
  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (data: LoginData) => {
    setLoading(true)
    setError(null)
    try {
      console.log("Attempting login with:", data) // Debug log

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      console.log("Login response:", result) // Debug log

      if (!res.ok) {
        throw new Error(result.message || "Login error")
      }

      const authUser: AuthUser = result.data.user
      setCurrentUser(authUser)
      setUser(authUser)

      // Redirect to dashboard
      await router.push("/dashboard")
    } catch (e) {
      console.error("Login error:", e) // Debug log
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    setError(null)
    try {
      console.log("Attempting registration with:", data) // Debug log

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      console.log("Registration response:", result) // Debug log

      if (!res.ok) {
        throw new Error(result.message || "Registration error")
      }

      // After successful registration, redirect to login page
      await router.push("/login")
    } catch (e) {
      console.error("Registration error:", e) // Debug log
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    removeCurrentUser()
    setUser(null)
    router.push("/")
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
