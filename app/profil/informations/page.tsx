"use client"

import React from "react"

import { ArrowLeft, User, MapPin, Calendar, Loader2, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState, useRef } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import Image from "next/image"

export default function InformationsPage() {
  const router = useRouter()
  const { userData, isAuthenticated } = usePiAuth()
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [memberSince, setMemberSince] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const user = userData
    ? {
        username: userData.username,
        id: userData.id,
      }
    : null

  useEffect(() => {
    if (user?.id && typeof window !== 'undefined') {
      const memberSinceKey = `member_since_${user.id}`
      const savedDate = localStorage.getItem(memberSinceKey)
      if (savedDate) {
        const date = new Date(savedDate)
        setMemberSince(date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }))
      }
      
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`)
      if (savedAvatar) setAvatar(savedAvatar)
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && !location) {
      detectLocation()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      return
    }

    setIsLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`,
          )
          const data = await response.json()

          const city = data.address.city || data.address.town || data.address.village || data.address.municipality
          const country = data.address.country

          const locationString = city && country ? `${city}, ${country}` : data.display_name
          setLocation(locationString)
        } catch (error) {
          console.error("Geocoding error:", error)
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsLoadingLocation(false)
      },
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleSave = async () => {
    try {
      await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.id,
          phone,
          location,
        }),
      })
      alert("Informations mises à jour avec succès")
    } catch (error) {
      console.error("Update error:", error)
      alert("Erreur lors de la mise à jour")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Informations personnelles</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-24 h-24 rounded-full border-4 border-card overflow-hidden hover:opacity-90 transition-opacity"
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
                  <span className="text-4xl font-bold text-primary-foreground">
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Pseudonyme Pi Network
            </Label>
            <Input
              id="username"
              value={user.username}
              disabled
              className="bg-card border-border opacity-70 font-semibold"
            />
            <p className="text-xs text-muted-foreground">Votre identifiant unique sur Pi Network</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uid" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Pi UID
            </Label>
            <Input id="uid" value={user.id} disabled className="bg-card border-border opacity-70 font-mono text-xs" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Localisation
              {isLoadingLocation && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
            </Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Détection automatique..."
                className="bg-card border-border flex-1"
                disabled={isLoadingLocation}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={detectLocation}
                disabled={isLoadingLocation}
                className="shrink-0 bg-transparent"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoadingLocation ? "Détection en cours..." : "Localisation détectée automatiquement"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-since" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Membre depuis
            </Label>
            <Input
              id="member-since"
              value={memberSince || "Calcul en cours..."}
              disabled
              className="bg-card border-border opacity-70"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </main>
    </div>
  )
}
