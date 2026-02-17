"use client"

import React from "react"

import { ArrowLeft, Settings, Shield, Package, Heart, Star, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import Image from "next/image"

export default function ProfilPage() {
  const router = useRouter()
  const { userData, isAuthenticated, logout } = usePiAuth()
  const [avatar, setAvatar] = useState<string | null>(null)
  const [stats, setStats] = useState({ sales: 0, purchases: 0, piExchanged: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const user = userData
    ? {
        username: userData.username,
        id: userData.id,
      }
    : null

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (user?.id) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`)
      if (savedAvatar) setAvatar(savedAvatar)

      const savedStats = localStorage.getItem(`stats_${user.id}`)
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      }
    }
  }, [user?.id])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setAvatar(result)
      if (user?.id) {
        localStorage.setItem(`avatar_${user.id}`, result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    logout()
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Mon Profil</h1>
          <Link href="/parametres" className="p-2 -mr-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-foreground" />
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="px-4 py-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-20 h-20 rounded-full border-4 border-card overflow-hidden hover:opacity-90 transition-opacity"
              >
                {avatar ? (
                  <Image 
                    src={avatar || "/placeholder.svg"} 
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-foreground">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full border-3 border-card flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.username}</h2>
              <p className="text-sm text-muted-foreground">Pioneer vérifié KYC</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-foreground">4.9</span>
                <span className="text-sm text-muted-foreground">(47 avis)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-card rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.sales}</div>
              <div className="text-xs text-muted-foreground mt-1">Ventes</div>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.purchases}</div>
              <div className="text-xs text-muted-foreground mt-1">Achats</div>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{stats.piExchanged}π</div>
              <div className="text-xs text-muted-foreground mt-1">Échangés</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-2">
          <Link
            href="/profil/informations"
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors"
          >
            <Package className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left font-medium text-foreground">Informations personnelles</span>
          </Link>

          <Link
            href="/kyc"
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors"
          >
            <Shield className="w-5 h-5 text-success" />
            <span className="flex-1 text-left font-medium text-foreground">Vérification KYC</span>
          </Link>

          <Link
            href="/profil/mes-annonces"
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors"
          >
            <Package className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left font-medium text-foreground">Mes annonces</span>
          </Link>

          <Link
            href="/profil/favoris"
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors"
          >
            <Heart className="w-5 h-5 text-destructive" />
            <span className="flex-1 text-left font-medium text-foreground">Favoris</span>
          </Link>

          <Link
            href="/profil/escrow"
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors"
          >
            <Shield className="w-5 h-5 text-success" />
            <span className="flex-1 text-left font-medium text-foreground">Transactions Escrow</span>
          </Link>
        </div>

        <div className="px-4 py-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
          >
            Se déconnecter
          </Button>
        </div>
      </main>
    </div>
  )
}
