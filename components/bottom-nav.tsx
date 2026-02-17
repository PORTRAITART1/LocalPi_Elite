"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, Search, MessageSquare, User } from "lucide-react"

const navItems = [
  { id: "home", label: "Accueil", icon: Home, path: "/" },
  { id: "search", label: "Explorer", icon: Search, path: "/explorer" },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3, path: "/messages" },
  { id: "profile", label: "Profil", icon: User, path: "/profil" },
]

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState("home")

  useEffect(() => {
    const currentItem = navItems.find((item) => item.path === pathname)
    if (currentItem) {
      setActive(currentItem.id)
    }
  }, [pathname])

  const handleNavigation = (item: (typeof navItems)[0]) => {
    setActive(item.id)
    router.push(item.path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-2 py-2 safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors relative active:scale-95"
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.badge && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
                    <span className="text-[9px] font-bold text-destructive-foreground">{item.badge}</span>
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
