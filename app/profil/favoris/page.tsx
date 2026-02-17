"use client"

import { ArrowLeft, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { getFavoriteListings, type Listing } from "@/lib/storage"
import { ListingCard } from "@/components/listing-card"

export default function FavorisPage() {
  const router = useRouter()
  const { userData, isAuthenticated } = usePiAuth()
  const [favorites, setFavorites] = useState<Listing[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }
    
    if (userData?.id) {
      const favoriteListings = getFavoriteListings(userData.id)
      setFavorites(favoriteListings)
    }
  }, [isAuthenticated, userData, router])

  const refreshFavorites = () => {
    if (userData?.id) {
      const favoriteListings = getFavoriteListings(userData.id)
      setFavorites(favoriteListings)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Favoris</h1>
            <p className="text-xs text-muted-foreground">{favorites.length} article(s)</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Aucun favori pour le moment</p>
            <p className="text-xs text-muted-foreground mt-2">
              Ajoutez des articles en favoris en cliquant sur le coeur
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={{
                  ...listing,
                  image: listing.images[0],
                  distance: "À proximité"
                }} 
                onUpdate={refreshFavorites} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
