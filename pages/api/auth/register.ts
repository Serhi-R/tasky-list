import type { NextApiRequest, NextApiResponse } from "next"
import { createUser } from "../../../src/lib/db-server"
import type { ApiResponse } from "../../../src/lib/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  // Only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    const { name, email, password } = req.body

    console.log("Registration API called with:", { name, email, password }) // Debug log

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      })
    }

    // Create user
    const user = await createUser({ name, email, password })

    console.log("User created successfully:", user) // Debug log

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user },
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Handle email duplication error
    if (error instanceof Error && error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      })
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    })
  }
}
