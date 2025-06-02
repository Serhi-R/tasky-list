"use client"

import { useEffect } from "react"
import { useRouter } from "next/router"
import Header from "../../src/components/Header/Header"
import TasksPage from "../../src/components/TasksPage/TasksPage"
import { useAuth } from "../../src/contexts/AuthContext"
import ProtectedRoute from "../../src/components/ProtectedRoute"

export default function Task() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <TasksPage />
        </main>
      </div>
    </ProtectedRoute>
  )
}
