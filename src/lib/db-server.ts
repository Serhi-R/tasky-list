import fs from "fs"
import path from "path"
import type { User, RegisterData } from "./types"
import { v4 as uuidv4 } from "uuid"

// Simple database simulation using file system
export interface StoredUser {
  id: string
  name: string
  email: string
  password: string
}

// Path to users file
const USERS_FILE = path.join(process.cwd(), "data", "users.json")

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get users from file
function getUsers(): StoredUser[] {
  try {
    ensureDataDir()
    if (!fs.existsSync(USERS_FILE)) {
      return []
    }
    const data = fs.readFileSync(USERS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading users file:", error)
    return []
  }
}

// Save users to file
function saveUsers(users: StoredUser[]): void {
  try {
    ensureDataDir()
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error("Error saving users file:", error)
  }
}

// Create user
export async function createUser(userData: RegisterData): Promise<Omit<User, "password">> {
  const users = getUsers()

  // Check if user with this email already exists
  if (users.some((user) => user.email === userData.email)) {
    throw new Error("User with this email already exists")
  }

  const newUser: StoredUser = {
    id: uuidv4(),
    name: userData.name,
    email: userData.email,
    password: userData.password, 
  }

  users.push(newUser)
  saveUsers(users)

  console.log("User created:", newUser) // Debug log
  console.log("All users:", getUsers()) // Debug log

  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Find user by email
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = getUsers()
  console.log("Looking for user with email:", email) // Debug log
  console.log("Available users:", users) // Debug log

  const user = users.find((user) => user.email === email)
  console.log("Found user:", user) // Debug log

  return user || null
}

// Find user by ID
export async function findUserById(id: string): Promise<Omit<User, "password"> | null> {
  const users = getUsers()
  const user = users.find((user) => user.id === id)

  if (!user) return null

  // Return user without password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<Omit<User, "password"> | null> {
  console.log("Authenticating user:", email, password) // Debug log

  const user = await findUserByEmail(email)
  console.log("User found for authentication:", user) // Debug log

  if (!user) {
    console.log("User not found") // Debug log
    return null
  }

  if (user.password !== password) {
    console.log("Password mismatch:", user.password, "vs", password) // Debug log
    return null
  }

  console.log("Authentication successful") // Debug log

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
