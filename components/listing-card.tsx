"use client"

import { MapPin, ShieldCheck, BadgeCheck, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ListingCardProps {
  listing: {
    id: string
    title: string
    price: string
    location: string
    image: string
    seller: {
      name: string
      verified: boolean
      rating: number
    }
    escrow: boolean
    distance: string
    localDelivery?: boolean
  }
  onUpdate?: () => void
}

export function ListingCard({ listing, onUpdate }: ListingCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/listing/${listing.id}`} className="block">
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]">
        <div className="relative aspect-square bg-muted">
          <Image
            src={imageError ? "/placeholder.svg" : listing.image || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
          {listing.escrow && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-success/95 backdrop-blur-sm border border-success-foreground/10">
              <ShieldCheck className="w-3 h-3 text-success-foreground" />
              <span className="text-[10px] font-semibold text-success-foreground">Smart Contract</span>
            </div>
          )}
          {listing.localDelivery && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-accent/95 backdrop-blur-sm border border-accent-foreground/10">
              <Truck className="w-3 h-3 text-accent-foreground" />
              <span className="text-[10px] font-semibold text-accent-foreground">Local</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 leading-tight">{listing.title}</h3>
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{listing.location}</span>
            <span className="text-xs text-muted-foreground">• {listing.distance}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">π</span>
              <span className="text-base font-bold text-foreground">{listing.price}</span>
            </div>
            <div className="flex items-center gap-1">
              {listing.seller.verified && (
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-success/10">
                  <BadgeCheck className="w-3.5 h-3.5 text-success" />
                  <span className="text-[10px] font-medium text-success">KYC</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground ml-1">⭐ {listing.seller.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
