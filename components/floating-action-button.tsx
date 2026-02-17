"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function FloatingActionButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/vendre")}
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow active:scale-95"
    >
      <Plus className="w-5 h-5" />
      <span className="font-semibold text-sm">Vendre</span>
    </button>
  )
}
