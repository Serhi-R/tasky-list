"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown, Calendar, CheckCircle2 } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { getTasks, addTask, updateTask, deleteTask, getTaskStats, type Task } from "../../lib/tasks"

export default function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    highPriority: 0,
  })
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"],
    type: "feature" as Task["type"],
  })

  // Load tasks when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      const userTasks = getTasks(user.id)
      setTasks(userTasks)
      setStats(getTaskStats(user.id))
    }
  }, [user?.id])

  const filteredTasks = tasks.filter((task) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      (task.displayId && task.displayId.toString().includes(searchTerm)) ||
      searchTerm === task.displayId?.toString()

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: Task["status"]) => {
    const statusClasses: Record<Task["status"], string> = {
      todo: "status-badge--todo",
      "in-progress": "status-badge--progress",
      done: "status-badge--done",
    }

    const statusLabels: Record<Task["status"], string> = {
      todo: "Todo",
      "in-progress": "In Progress",
      done: "Done",
    }

    return (
      <Badge variant="outline" className={`status-badge ${statusClasses[status]}`}>
        {statusLabels[status]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    return <span className={`priority priority--${priority}`}>{priority}</span>
  }

  const getTypeBadge = (type: Task["type"]) => {
    return (
      <Badge variant="outline" className={`type-badge type-badge--${type}`}>
        {type}
      </Badge>
    )
  }

  const handleAddTask = () => {
    if (!user?.id || !newTask.title.trim()) return

    addTask(user.id, newTask)
    const updatedTasks = getTasks(user.id)
    setTasks(updatedTasks)
    setStats(getTaskStats(user.id))

    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      type: "feature",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    if (!user?.id) return

    const success = deleteTask(user.id, taskId)
    if (success) {
      const updatedTasks = getTasks(user.id)
      setTasks(updatedTasks)
      setStats(getTaskStats(user.id))
    }
  }

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    if (!user?.id) return

    const updatedTask = updateTask(user.id, taskId, { status: newStatus })
    if (updatedTask) {
      const updatedTasks = getTasks(user.id)
      setTasks(updatedTasks)
      setStats(getTaskStats(user.id))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!user) {
    return <div>Please log in to view your tasks.</div>
  }

  const renderTaskActions = (taskId: string, displayId?: number) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`#${displayId || "N/A"}`)}>
          Copy task number
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleStatusChange(taskId, "in-progress")}>
          Mark as In Progress
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange(taskId, "done")}>Mark as Done</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeleteTask(taskId)} className="text-red-600">
          Delete task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const renderEmptyState = () => (
    <div className="task-page__empty">
      <Calendar />
      <div className="task-page__empty-text">
        <p>No tasks found.</p>
        <p>Create your first task to get started!</p>
      </div>
    </div>
  )

  return (
    <div className="task-page">
      <div className="task-page__header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's a list of your tasks for this month.</p>
      </div>

      {/* Stats Cards */}
      <div className="task-page__stats">
        <div className="task-page__stats-card">
          <div className="task-page__stats-card-header">
            <div className="task-page__stats-card-header-icon task-page__stats-card-header-icon--gray"></div>
            <span className="task-page__stats-card-header-label">Total</span>
          </div>
          <p className="task-page__stats-card-value task-page__stats-card-value--default">{stats.total}</p>
        </div>

        <div className="task-page__stats-card">
          <div className="task-page__stats-card-header">
            <div className="task-page__stats-card-header-icon task-page__stats-card-header-icon--todo"></div>
            <span className="task-page__stats-card-header-label">Todo</span>
          </div>
          <p className="task-page__stats-card-value task-page__stats-card-value--default">{stats.todo}</p>
        </div>

        <div className="task-page__stats-card">
          <div className="task-page__stats-card-header">
            <div className="task-page__stats-card-header-icon task-page__stats-card-header-icon--progress"></div>
            <span className="task-page__stats-card-header-label">In Progress</span>
          </div>
          <p className="task-page__stats-card-value task-page__stats-card-value--orange">{stats.inProgress}</p>
        </div>

        <div className="task-page__stats-card">
          <div className="task-page__stats-card-header">
            <CheckCircle2 className="task-page__stats-card-header-icon task-page__stats-card-header-icon--done" />
            <span className="task-page__stats-card-header-label">Done</span>
          </div>
          <p className="task-page__stats-card-value task-page__stats-card-value--green">{stats.done}</p>
        </div>

        <div className="task-page__stats-card">
          <div className="task-page__stats-card-header">
            <div className="task-page__stats-card-header-icon task-page__stats-card-header-icon--high"></div>
            <span className="task-page__stats-card-header-label">High Priority</span>
          </div>
          <p className="task-page__stats-card-value task-page__stats-card-value--red">{stats.highPriority}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="task-page__filters">
        <div className="task-page__filters-search">
          <div className="task-page__filters-search-input">
            <Search />
            <Input
              placeholder="Search by task number, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="task-page__filters-search-buttons">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("todo")}>Todo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("done")}>Done</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Priority
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPriorityFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="task-page__filters-add">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle className="text-black">Add New Task</DialogTitle>
              <DialogDescription className="text-gray-600">Create a new task to add to your list.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: Task["status"]) => setNewTask({ ...newTask, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newTask.type}
                  onValueChange={(value: Task["type"]) => setNewTask({ ...newTask, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddTask}
                disabled={!newTask.title.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Add Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Table View */}
      <div className="task-page__table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Task #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {renderEmptyState()}
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">#{task.displayId || "N/A"}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>{getTypeBadge(task.type)}</TableCell>
                  <TableCell className="text-sm text-gray-500">{formatDate(task.createdAt)}</TableCell>
                  <TableCell>{renderTaskActions(task.id, task.displayId)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
