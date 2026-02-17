import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentId, txid, amount, commission } = body

    const adminWallet = "GDH7MNRURD4G6J6ZL5ATTTPC4QAS6MOM3CCYPHPF3A7KYCR2Z7OWJL5F"

    // Record transaction in database with commission split
    const transaction = {
      paymentId,
      txid,
      totalAmount: amount + commission,
      sellerAmount: amount,
      commission,
      adminWallet,
      status: "completed",
      completedAt: new Date().toISOString(),
    }

    console.log("Transaction completed:", transaction)

    // In production:
    // 1. Transfer seller amount to seller wallet (in escrow)
    // 2. Transfer commission to admin wallet
    // 3. Update database with transaction details

    return NextResponse.json({
      success: true,
      transaction,
    })
  } catch (error) {
    console.error("Payment completion error:", error)
    return NextResponse.json({ success: false, error: "Payment completion failed" }, { status: 500 })
  }
}
