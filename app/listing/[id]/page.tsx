"use client"

import { ArrowLeft, MapPin, ShieldCheck, BadgeCheck, Truck, MessageCircle, Heart, Share2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { usePiBrowser } from "@/hooks/use-pi-browser"
import { toggleLike, isLiked, addConversation, addMessage, getAllListings, addEscrowTransaction, type Conversation, type Message, type Listing, type EscrowTransaction } from "@/lib/storage"
import { PaymentModal } from "@/components/payment-modal"

const mockListings = {
  "1": {
    id: "1",
    title: "iPhone 14 Pro Max 256GB",
    price: "425",
    location: "Paris 15ème",
    image: "/products/iphone-14-pro-max.jpg",
    seller: { name: "Marie L.", verified: true, rating: 4.9, sales: 32 },
    escrow: true,
    distance: "2.3 km",
    localDelivery: true,
    category: "electronics",
    description:
      "iPhone 14 Pro Max en excellent état, couleur violet sidéral. Aucune rayure, toujours protégé avec coque et film. Batterie à 94% de capacité. Vendu avec chargeur MagSafe et boîte d'origine.",
    condition: "Excellent",
    photos: [
      "/products/iphone-14-pro-max.jpg",
      "/products/iphone-14-pro-max.jpg",
      "/products/iphone-14-pro-max.jpg",
    ],
  },
  "2": {
    id: "2",
    title: "MacBook Pro M2 16 pouces",
    price: "1050",
    location: "Lyon 6ème",
    image: "/products/macbook-pro-m2.jpg",
    seller: { name: "Thomas B.", verified: true, rating: 5.0, sales: 45 },
    escrow: true,
    distance: "5.1 km",
    localDelivery: true,
    category: "tech",
    description:
      "MacBook Pro M2 16 pouces, 16GB RAM, 512GB SSD. Couleur gris sidéral. Utilisé 6 mois pour développement. Comme neuf, aucune marque d'usure. Garantie Apple jusqu'à décembre 2024.",
    condition: "Comme neuf",
    photos: [
      "/products/macbook-pro-m2.jpg",
      "/products/macbook-pro-m2.jpg",
    ],
  },
}

export default function ListingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { userData, isAuthenticated, reinitialize, createPayment, recordTransaction } = usePiAuth()
  const { isPiBrowser, sdkReady } = usePiBrowser()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [listing, setListing] = useState<Listing | typeof mockListings[keyof typeof mockListings] | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const listingId = params?.id as string

  useEffect(() => {
    if (listingId) {
      const realListings = getAllListings()
      const foundRealListing = realListings.find(l => l.id === listingId)
      
      if (foundRealListing) {
        setListing(foundRealListing)
      } else {
        const mockListing = mockListings[listingId as keyof typeof mockListings]
        setListing(mockListing || null)
      }
    }
  }, [listingId])

  useEffect(() => {
    if (userData?.id && listingId) {
      setLiked(isLiked(listingId, userData.id))
    }
  }, [userData?.id, listingId])

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Annonce non trouvée</p>
      </div>
    )
  }

  const handleLike = () => {
    if (!userData?.id) {
      alert("Veuillez vous connecter pour ajouter aux favoris")
      return
    }
    const newLikedState = toggleLike(listingId, userData.id)
    setLiked(newLikedState)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Découvrez cette annonce: ${listing.title} - ${listing.price}π`,
          url: url,
        })
      } catch (error) {
        console.log("Partage annulé", error)
      }
    } else {
      navigator.clipboard.writeText(url)
      alert("Lien copié dans le presse-papiers!")
    }
  }

  const handleMessage = () => {
    if (!userData?.id) {
      alert("Veuillez vous connecter pour contacter le vendeur")
      return
    }

    const conversationId = `conv_${listingId}_${userData.id}`
    
    const conversation: Conversation = {
      id: conversationId,
      listingId: listing.id,
      listingTitle: listing.title,
      participants: [
        { id: userData.id, name: userData.username },
        { id: listing.seller.name, name: listing.seller.name },
      ],
      lastMessage: "Conversation démarrée",
      lastMessageTime: new Date().toISOString(),
      unread: 0,
    }

    addConversation(userData.id, conversation)

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: userData.id,
      senderName: userData.username,
      receiverId: listing.seller.name,
      receiverName: listing.seller.name,
      content: `Bonjour, je suis intéressé par ${listing.title}`,
      timestamp: new Date().toISOString(),
      read: false,
    }

    addMessage(message)
    router.push(`/messages/${conversationId}`)
  }

  const handlePurchaseClick = async () => {
    if (!isAuthenticated) {
      await reinitialize()
      return
    }

    if (!sdkReady) {
      alert("Le SDK Pi est en cours de chargement. Veuillez réessayer dans quelques instants.")
      return
    }

    setShowPaymentModal(true)
  }

  const handleConfirmPayment = async () => {
    try {
      setIsPurchasing(true)
      const piAmount = Number.parseFloat(listing.price)
      await createPayment(piAmount, `Achat: ${listing.title}`, {
        listingId: listing.id,
        sellerId: listing.seller.name,
      })
      
      recordTransaction('purchase', piAmount)
      
      // Create escrow transaction
      const escrowTransaction: EscrowTransaction = {
        id: `escrow_${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        buyerId: userData.id,
        sellerId: listing.seller.id || listing.seller.name,
        amount: listing.price,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      
      addEscrowTransaction(userData.id, escrowTransaction)
      
      setShowPaymentModal(false)
      alert("Paiement réussi! Les fonds sont en séquestre jusqu'à confirmation de réception.")
      router.push('/profil/escrow')
    } catch (error) {
      console.error("Payment error:", error)
      alert("Erreur lors du paiement. Veuillez réessayer.")
    } finally {
      setIsPurchasing(false)
    }
  }

  const allImages = 'images' in listing 
    ? listing.images 
    : [listing.image, ...(listing.photos || [])]

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top backdrop-blur-lg bg-card/95">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={handleLike} className="p-2 -mr-2 hover:bg-muted rounded-lg transition-colors">
              <Heart className={`w-5 h-5 transition-colors ${liked ? "fill-destructive text-destructive" : "text-foreground"}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="relative aspect-square bg-muted">
          <Image
            src={allImages[currentImageIndex] || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover"
          />
          {listing.escrow && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/95 backdrop-blur-sm border border-success-foreground/10">
              <ShieldCheck className="w-4 h-4 text-success-foreground" />
              <span className="text-xs font-semibold text-success-foreground">Smart Contract</span>
            </div>
          )}
          {listing.localDelivery && (
            <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/95 backdrop-blur-sm border border-accent-foreground/10">
              <Truck className="w-4 h-4 text-accent-foreground" />
              <span className="text-xs font-semibold text-accent-foreground">Local</span>
            </div>
          )}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-5 space-y-5">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl font-bold text-foreground flex-1 pr-4">{listing.title}</h1>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-primary">π</span>
                  <span className="text-2xl font-bold text-foreground">{listing.price}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
              <span>•</span>
              <span>{listing.distance}</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-success/10 border border-success/30">
              <span className="text-xs font-medium text-success">{listing.condition}</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">{listing.seller.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-foreground">{listing.seller.name}</span>
                  {listing.seller.verified && <BadgeCheck className="w-4 h-4 text-success" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>⭐ {listing.seller.rating}</span>
                  <span>•</span>
                  <span>{listing.seller.sales} ventes</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Voir profil
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              Protection par Smart Contract
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vos Pi sont bloqués en séquestre jusqu'à ce que vous confirmiez la réception de l'article. Le vendeur ne
              peut pas accéder aux fonds avant votre validation.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 safe-area-inset-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <Button variant="outline" size="lg" onClick={handleMessage} className="flex-shrink-0 bg-transparent">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button size="lg" className="flex-1" onClick={handlePurchaseClick} disabled={isPurchasing}>
            {isAuthenticated ? `Paiement par π${listing.price}` : "Se connecter pour acheter"}
          </Button>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleConfirmPayment}
        listing={{
          title: listing.title,
          price: listing.price,
          image: 'images' in listing ? listing.images[0] : listing.image,
          seller: listing.seller,
        }}
        isPurchasing={isPurchasing}
      />
    </div>
  )
}
