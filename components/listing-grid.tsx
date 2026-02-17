"use client"

import { ListingCard } from "./listing-card"
import { getAllListings, addListing, type Listing } from "@/lib/storage"
import { useEffect, useState } from "react"

interface DisplayListing {
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
  category?: string
}

const defaultListings: DisplayListing[] = [
  {
    id: "1",
    title: "iPhone 14 Pro Max 256GB",
    price: "425",
    location: "Paris 15ème",
    image: "/products/iphone-14-pro-max.jpg",
    seller: { name: "Marie L.", verified: true, rating: 4.9 },
    escrow: true,
    distance: "2.3 km",
    localDelivery: true,
    category: "electronics",
  },
  {
    id: "2",
    title: "MacBook Pro M2 16 pouces",
    price: "1050",
    location: "Lyon 6ème",
    image: "/products/macbook-pro-m2.jpg",
    seller: { name: "Thomas B.", verified: true, rating: 5.0 },
    escrow: true,
    distance: "5.1 km",
    localDelivery: true,
    category: "tech",
  },
  {
    id: "3",
    title: "Nintendo Switch OLED + jeux",
    price: "140",
    location: "Marseille 8ème",
    image: "/products/nintendo-switch-oled.jpg",
    seller: { name: "Sophie M.", verified: true, rating: 4.8 },
    escrow: true,
    distance: "1.8 km",
    localDelivery: true,
    category: "hobby",
  },
  {
    id: "4",
    title: "AirPods Pro 2ème génération",
    price: "98",
    location: "Paris 11ème",
    image: "/products/airpods-pro-2.jpg",
    seller: { name: "Lucas D.", verified: true, rating: 4.9 },
    escrow: true,
    distance: "3.5 km",
    localDelivery: false,
    category: "electronics",
  },
  {
    id: "5",
    title: "iPad Air 5 64GB Wi-Fi",
    price: "240",
    location: "Toulouse Centre",
    image: "/products/ipad-air-5.jpg",
    seller: { name: "Emma R.", verified: true, rating: 5.0 },
    escrow: true,
    distance: "4.2 km",
    localDelivery: true,
    category: "tech",
  },
  {
    id: "6",
    title: "Sony WH-1000XM5 Noir",
    price: "160",
    location: "Nice Port",
    image: "/products/sony-wh1000xm5.jpg",
    seller: { name: "Pierre K.", verified: true, rating: 4.7 },
    escrow: true,
    distance: "6.8 km",
    localDelivery: false,
    category: "electronics",
  },
  {
    id: "7",
    title: "Canapé 3 places gris",
    price: "180",
    location: "Bordeaux Centre",
    image: "/products/sofa-gray.jpg",
    seller: { name: "Julie P.", verified: true, rating: 4.9 },
    escrow: true,
    distance: "3.2 km",
    localDelivery: true,
    category: "home",
  },
  {
    id: "8",
    title: "Veste en cuir homme L",
    price: "75",
    location: "Nantes Gare",
    image: "/products/leather-jacket.jpg",
    seller: { name: "Marc T.", verified: true, rating: 4.8 },
    escrow: true,
    distance: "2.8 km",
    localDelivery: true,
    category: "fashion",
  },
  {
    id: "9",
    title: "Pneus Michelin 205/55R16",
    price: "120",
    location: "Lille Sud",
    image: "/products/michelin-tires.jpg",
    seller: { name: "Jean V.", verified: true, rating: 5.0 },
    escrow: true,
    distance: "4.5 km",
    localDelivery: false,
    category: "auto",
  },
  {
    id: "10",
    title: "Guitare électrique Fender",
    price: "320",
    location: "Montpellier",
    image: "/products/fender-guitar.jpg",
    seller: { name: "Alex M.", verified: true, rating: 4.9 },
    escrow: true,
    distance: "5.7 km",
    localDelivery: true,
    category: "hobby",
  },
]

interface ListingGridProps {
  category?: string
}

export function ListingGrid({ category = "all" }: ListingGridProps) {
  const [listings, setListings] = useState<DisplayListing[]>([])

  useEffect(() => {
    const realListings = getAllListings()
    
    // Initialize default listings in storage if not already there
    if (realListings.length === 0) {
      defaultListings.forEach(defaultListing => {
        const listing: Listing = {
          id: defaultListing.id,
          title: defaultListing.title,
          price: defaultListing.price,
          description: `Description de ${defaultListing.title}`,
          location: defaultListing.location,
          category: defaultListing.category || 'other',
          images: [defaultListing.image],
          seller: {
            id: defaultListing.seller.name,
            name: defaultListing.seller.name,
            verified: defaultListing.seller.verified,
            rating: defaultListing.seller.rating,
          },
          escrow: defaultListing.escrow,
          localDelivery: defaultListing.localDelivery || false,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
        }
        addListing(listing)
      })
    }
    
    const allListings = getAllListings()
    const convertedListings: DisplayListing[] = allListings.map(listing => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      location: listing.location,
      image: listing.images[0],
      seller: listing.seller,
      escrow: listing.escrow,
      distance: "À proximité",
      localDelivery: listing.localDelivery,
      category: listing.category,
    }))
    
    setListings(convertedListings)
  }, [])

  const filteredListings = category === "all" ? listings : listings.filter((listing) => listing.category === category)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Articles à proximité</h2>
        <span className="text-xs text-muted-foreground">{filteredListings.length} annonces</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
