import type { NextApiRequest, NextApiResponse } from "next"
import { authenticateUser } from "../../../src/lib/db-server"
import type { ApiResponse } from "../../../src/lib/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  // Only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    console.log("Login API called with:", { email, password }) // Debug log

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)

    console.log("Authentication result:", user) // Debug log

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user },
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    })
  }
}
