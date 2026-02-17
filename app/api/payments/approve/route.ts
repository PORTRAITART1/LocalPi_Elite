import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentId, amount, commission, metadata } = body

    const adminWallet = "GDH7MNRURD4G6J6ZL5ATTTPC4QAS6MOM3CCYPHPF3A7KYCR2Z7OWJL5F"

    // Store payment approval in database
    console.log("Payment approval:", {
      paymentId,
      sellerAmount: amount,
      commission,
      adminWallet,
      metadata,
    })

    // In production: verify payment signature and approve on Pi blockchain

    return NextResponse.json({
      success: true,
      paymentId,
      sellerAmount: amount,
      commission,
      adminWallet,
    })
  } catch (error) {
    console.error("Payment approval error:", error)
    return NextResponse.json({ success: false, error: "Payment approval failed" }, { status: 500 })
  }
}
