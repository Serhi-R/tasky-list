import type { NextApiRequest, NextApiResponse } from "next"
import { removeTokenCookie } from "../../../src/lib/auth"
import type { ApiResponse } from "../../../src/lib/types"

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  // Only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" })
  }

  try {
    // Remove token cookie
    removeTokenCookie(res)

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    })
  }
}
