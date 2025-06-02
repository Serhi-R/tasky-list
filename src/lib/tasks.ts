export interface Task {
  id: string // уникальный ID (скрытый)
  displayId: number // простой номер для показа пользователю
  title: string
  description: string
  status: "todo" | "in-progress" | "done" // убрал backlog и canceled
  priority: "low" | "medium" | "high"
  type: "feature" | "bug" | "documentation"
  createdAt: string
  updatedAt: string
  userId: string
}

// Migrate old tasks to add displayId and fix status
function migrateTasks(userId: string, tasks: any[]): Task[] {
  let needsSave = false
  const migratedTasks = tasks.map((task, index) => {
    if (typeof task.displayId === "undefined") {
      task.displayId = index + 1
      needsSave = true
    }

    // Migrate old statuses to valid ones
    if (task.status === "backlog" || task.status === "canceled") {
      task.status = "todo" // convert old statuses to todo
      needsSave = true
    }

    return task as Task
  })

  if (needsSave) {
    saveTasks(userId, migratedTasks)
  }

  return migratedTasks
}

// Get tasks from localStorage for specific user
export function getTasks(userId: string): Task[] {
  if (typeof window === "undefined") return []

  try {
    const tasksStr = localStorage.getItem(`tasks_${userId}`)
    if (!tasksStr) return []

    const rawTasks = JSON.parse(tasksStr)
    return migrateTasks(userId, rawTasks)
  } catch {
    return []
  }
}

// Save tasks to localStorage for specific user
export function saveTasks(userId: string, tasks: Task[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks))
}

// Get next display ID
function getNextDisplayId(userId: string): number {
  const tasks = getTasks(userId)
  if (tasks.length === 0) return 1

  const maxDisplayId = Math.max(...tasks.map((task) => task.displayId || 0))
  return maxDisplayId + 1
}

// Add new task
export function addTask(
  userId: string,
  taskData: Omit<Task, "id" | "displayId" | "createdAt" | "updatedAt" | "userId">,
): Task {
  const tasks = getTasks(userId)

  const newTask: Task = {
    id: `TASK-${Date.now()}`, // уникальный ID для внутреннего использования
    displayId: getNextDisplayId(userId), // простой номер для пользователя
    ...taskData,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updatedTasks = [newTask, ...tasks]
  saveTasks(userId, updatedTasks)

  return newTask
}

// Update task
export function updateTask(
  userId: string,
  taskId: string,
  updates: Partial<Omit<Task, "id" | "displayId" | "userId" | "createdAt">>,
): Task | null {
  const tasks = getTasks(userId)
  const taskIndex = tasks.findIndex((task) => task.id === taskId)

  if (taskIndex === -1) return null

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  tasks[taskIndex] = updatedTask
  saveTasks(userId, tasks)

  return updatedTask
}

// Delete task
export function deleteTask(userId: string, taskId: string): boolean {
  const tasks = getTasks(userId)
  const filteredTasks = tasks.filter((task) => task.id !== taskId)

  if (filteredTasks.length === tasks.length) return false

  saveTasks(userId, filteredTasks)
  return true
}

// Find task by display ID
export function findTaskByDisplayId(userId: string, displayId: number): Task | null {
  const tasks = getTasks(userId)
  return tasks.find((task) => task.displayId === displayId) || null
}

// Get task statistics (убрал backlog и canceled)
export function getTaskStats(userId: string) {
  const tasks = getTasks(userId)

  return {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "todo").length,
    inProgress: tasks.filter((task) => task.status === "in-progress").length,
    done: tasks.filter((task) => task.status === "done").length,
    highPriority: tasks.filter((task) => task.priority === "high").length,
  }
}
