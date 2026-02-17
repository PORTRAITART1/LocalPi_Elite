"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { TrustBanner } from "@/components/trust-banner"
import { CategoryTabs } from "@/components/category-tabs"
import { ListingGrid } from "@/components/listing-grid"
import { FloatingActionButton } from "@/components/floating-action-button"
import { BottomNav } from "@/components/bottom-nav"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 py-4">
        <SearchBar />
        <TrustBanner />
        <CategoryTabs onCategoryChange={setSelectedCategory} />
        <ListingGrid category={selectedCategory} />
      </main>
      <FloatingActionButton />
      <BottomNav />
    </div>
  )
}
