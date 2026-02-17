import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { uid, phone, location } = body

    // Store user preferences in database
    console.log("Updating user preferences:", { uid, phone, location })

    // In production: update user record in database

    return NextResponse.json({
      success: true,
      message: "User preferences updated successfully",
    })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 })
  }
}
