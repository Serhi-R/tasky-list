// Simple auth without JWT - using localStorage
export interface AuthUser {
  id: string
  name: string
  email: string
}

// Get current user from localStorage
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem("taskyUser")
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

// Set current user to localStorage
export function setCurrentUser(user: AuthUser): void {
  if (typeof window === "undefined") return

  localStorage.setItem("taskyUser", JSON.stringify(user))
}

// Remove current user from localStorage
export function removeCurrentUser(): void {
  if (typeof window === "undefined") return

  localStorage.removeItem("taskyUser")
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

// Simple token functions (for future use)
export function getTokenFromCookies(req: any): string | null {
  // Simple implementation - in real app use proper cookie parsing
  return null
}

export function verifyToken(token: string): any | null {
  // Simple implementation - in real app use JWT verification
  return null
}

export function setTokenCookie(res: any, token: string): void {
  // Simple implementation - in real app set HTTP-only cookie
}

export function removeTokenCookie(res: any): void {
  // Simple implementation - in real app remove cookie
}
