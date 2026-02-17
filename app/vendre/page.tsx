"use client"

import type React from "react"

import { ArrowLeft, Camera, MapPin, Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { usePiBrowser } from "@/hooks/use-pi-browser"
import { usePiAuth } from "@/contexts/pi-auth-context"
import Image from "next/image"
import { addListing, type Listing } from "@/lib/storage"

const categories = ["Électronique", "Vêtements", "Maison", "Sports", "Livres", "Véhicules", "Autre"]

export default function VendrePage() {
  const router = useRouter()
  const { isPiBrowser, sdkReady, piUser, isAuthenticated, authenticate } = usePiBrowser()
  const { recordTransaction, userData } = usePiAuth()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    detectLocation()
  }, [])

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPhotos: string[] = []
    const maxPhotos = 5

    Array.from(files).forEach((file, index) => {
      if (photos.length + newPhotos.length < maxPhotos && file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newPhotos.push(event.target.result as string)
            if (newPhotos.length === Math.min(files.length, maxPhotos - photos.length)) {
              setPhotos([...photos, ...newPhotos])
            }
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

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
          
          localStorage.setItem('lastKnownLocation', JSON.stringify({ latitude, longitude }))
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

  const openGoogleMaps = () => {
    const savedLocation = localStorage.getItem('lastKnownLocation')
    if (savedLocation) {
      const { latitude, longitude } = JSON.parse(savedLocation)
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank')
    } else {
      detectLocation()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !userData) {
      const shouldAuth = confirm("Vous devez être connecté pour vendre un article. Se connecter maintenant?")
      if (shouldAuth) {
        await authenticate()
      }
      return
    }

    if (photos.length === 0) {
      alert("Veuillez ajouter au moins une photo")
      return
    }

    const newListing: Listing = {
      id: `listing_${Date.now()}`,
      title,
      price,
      description,
      location,
      category: selectedCategory,
      images: photos,
      seller: {
        id: userData.id,
        name: userData.username,
        verified: true,
        rating: 4.9,
      },
      escrow: true,
      localDelivery: true,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    }

    addListing(newListing)

    const piAmount = Number.parseFloat(price)
    if (piAmount > 0) {
      recordTransaction('sale', piAmount)
    }

    alert("Article publié avec succès!")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Vendre un article</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Photos ({photos.length}/5)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
                  <Image src={photo || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-destructive-foreground" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-muted-foreground" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Ajoutez jusqu'à 5 photos de votre article
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Titre*</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: iPhone 13 Pro en excellent état"
              className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Catégorie*</label>
            <select
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Prix (π)*</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-2">Le paiement sera sécurisé par Smart Contract</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description*</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre article en détail..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              Localisation*
              {isLoadingLocation && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isLoadingLocation ? "Détection en cours..." : "Ex: Paris, France"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isLoadingLocation}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  const choice = confirm("Voulez-vous ouvrir Google Maps pour sélectionner votre position?\n\nOK = Google Maps\nAnnuler = Détecter automatiquement")
                  if (choice) {
                    openGoogleMaps()
                  } else {
                    detectLocation()
                  }
                }}
                disabled={isLoadingLocation}
                className="shrink-0 w-12 h-12 bg-transparent"
              >
                <MapPin className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isLoadingLocation ? "Détection automatique de votre position..." : "Remise en main propre recommandée"}
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full py-6 text-base font-semibold">
            Publier l'annonce
          </Button>
        </form>
      </main>
    </div>
  )
}
