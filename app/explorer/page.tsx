"use client"

import { ArrowLeft, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { CategoryTabs } from "@/components/category-tabs"
import { ListingGrid } from "@/components/listing-grid"

export default function ExplorerPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-4">Explorer</h1>
        <CategoryTabs />
        <ListingGrid />
      </main>
    </div>
  )
}
