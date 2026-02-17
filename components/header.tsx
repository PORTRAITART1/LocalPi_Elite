"use client"

import { useRouter } from "next/navigation"
import { usePiAuth } from "@/contexts/pi-auth-context"
import Image from "next/image"
import { useEffect, useState } from "react"

export function Header() {
  const router = useRouter()
  const { userData, isAuthenticated } = usePiAuth()
  const [avatar, setAvatar] = useState<string | null>(null)
  
  const user = userData
    ? {
        username: userData.username,
        id: userData.id,
      }
    : null
  const isLoading = !isAuthenticated

  useEffect(() => {
    if (user?.id && typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`)
      if (savedAvatar) setAvatar(savedAvatar)
    }
  }, [user?.id])

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 backdrop-blur-lg bg-card/95 safe-area-inset-top">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden">
            <Image
              src="/placeholder-logo.png"
              alt="LocalPi Elite Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">LocalPi Elite</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Commerce local avec Pi</p>
          </div>
        </button>

        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        ) : isAuthenticated && user ? (
          <button
            onClick={() => router.push("/profil")}
            className="relative hover:opacity-80 transition-opacity active:scale-95"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-success">
              {avatar ? (
                <Image 
                  src={avatar || "/placeholder.svg"} 
                  alt={user.username}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{user.username.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <span className="text-sm font-bold text-muted-foreground">?</span>
          </div>
        )}
      </div>
    </header>
  )
}
