import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uid, username, walletAddress, registeredAt } = body

    // Verify Pi signature to prevent fake accounts
    // In production, verify the Pi authentication signature here

    // Generate JWT token with 24h expiration + refresh token
    const accessToken = sign(
      { uid, username, walletAddress },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      { expiresIn: "24h" },
    )

    const refreshToken = sign(
      { uid },
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production",
      { expiresIn: "7d" },
    )

    // Store user in database (simulated here)
    console.log("Registering user:", { uid, username, walletAddress, registeredAt })

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: { uid, username, walletAddress },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 })
  }
}
