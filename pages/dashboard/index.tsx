"use client"

import { useEffect, useState } from "react"
import Header from "../../src/components/Header/Header"
import { useAuth } from "../../src/contexts/AuthContext"
import ProtectedRoute from "../../src/components/ProtectedRoute"
import { getTaskStats } from "../../src/lib/tasks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Button } from "../../src/components/ui/button"
import { CheckCircle2, Clock, AlertCircle, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    highPriority: 0,
  })

  useEffect(() => {
    if (user?.id) {
      setStats(getTaskStats(user.id))
    }
  }, [user?.id])

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
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black">Welcome back, {user?.name}!</h1>
              <p className="text-black">Here's an overview of your tasks and productivity.</p>
            </div>

            {/* Quick Stats - убрал backlog и canceled */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Total Tasks</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{stats.total}</div>
                  <p className="text-xs text-gray-600">All your tasks</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                  <p className="text-xs text-gray-600">Currently working on</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.done}</div>
                  <p className="text-xs text-gray-600">Tasks completed</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">High Priority</CardTitle>
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
                  <p className="text-xs text-gray-600">Urgent tasks</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-600">Get started with your task management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/task">
                    <Button
                      className="w-full justify-start bg-white text-black border border-gray-300 hover:bg-gray-50"
                      variant="outline"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Task
                    </Button>
                  </Link>
                  <Link href="/task">
                    <Button
                      className="w-full justify-start bg-white text-black border border-gray-300 hover:bg-gray-50"
                      variant="outline"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      View All Tasks
                    </Button>
                  </Link>
                  <Link href="/task">
                    <Button
                      className="w-full justify-start bg-white text-black border border-gray-300 hover:bg-gray-50"
                      variant="outline"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      In Progress Tasks
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Task Overview</CardTitle>
                  <CardDescription className="text-gray-600">Your current task distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-black">Todo</span>
                      </div>
                      <span className="text-sm font-medium text-black">{stats.todo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-black">In Progress</span>
                      </div>
                      <span className="text-sm font-medium text-black">{stats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-black">Done</span>
                      </div>
                      <span className="text-sm font-medium text-black">{stats.done}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Getting Started */}
            {stats.total === 0 && (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">Get Started with Tasky</CardTitle>
                  <CardDescription className="text-gray-600">
                    You don't have any tasks yet. Create your first task to get started!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/task">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Task
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
