"use client"

import React from "react"

import { ArrowLeft, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { getUserListings, deleteListing, type Listing } from "@/lib/storage"
import Image from "next/image"
import Link from "next/link"

export default function MesAnnoncesPage() {
  const router = useRouter()
  const { userData, isAuthenticated } = usePiAuth()
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }
    
    if (userData?.id) {
      const userListings = getUserListings(userData.id)
      setListings(userListings)
    }
  }, [isAuthenticated, userData, router])

  const handleDelete = (listingId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      deleteListing(listingId)
      setListings(listings.filter(l => l.id !== listingId))
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
            <h1 className="text-lg font-bold text-foreground">Mes annonces</h1>
            <p className="text-xs text-muted-foreground">{listings.length} annonce(s)</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Aucune annonce publiée</p>
            <Button onClick={() => router.push("/vendre")} className="bg-primary text-primary-foreground">
              Créer une annonce
            </Button>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="bg-card rounded-xl border border-border p-3 flex gap-3">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>
                <p className="text-lg font-bold text-primary mt-1">{listing.price}π</p>
                <p className="text-xs text-muted-foreground mt-1">{listing.location}</p>
                <div className="flex gap-2 mt-2">
                  <Link href={`/listing/${listing.id}`}>
                    <Button size="sm" variant="outline" className="bg-transparent h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Voir
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(listing.id)}
                    className="bg-transparent h-7 text-xs text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}
