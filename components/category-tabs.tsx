"use client"

import { useState } from "react"
import { Smartphone, Laptop, Home, Shirt, Car, Music } from "lucide-react"

const categories = [
  { id: "all", label: "Tous", icon: null },
  { id: "electronics", label: "Électronique", icon: Smartphone },
  { id: "tech", label: "Tech", icon: Laptop },
  { id: "home", label: "Maison", icon: Home },
  { id: "fashion", label: "Mode", icon: Shirt },
  { id: "auto", label: "Auto", icon: Car },
  { id: "hobby", label: "Loisirs", icon: Music },
]

interface CategoryTabsProps {
  onCategoryChange?: (category: string) => void
}

export function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [active, setActive] = useState("all")

  const handleCategoryClick = (categoryId: string) => {
    setActive(categoryId)
    onCategoryChange?.(categoryId)
  }

  return (
    <div className="mb-5">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                active === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
