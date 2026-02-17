"use client"

import type React from "react"

import { Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search logic will be implemented here
  }

  return (
    <div className="flex gap-2 mb-4">
      <form onSubmit={handleSearch} className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher des articles..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </form>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors active:scale-95"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  )
}
