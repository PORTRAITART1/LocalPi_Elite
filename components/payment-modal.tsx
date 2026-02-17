"use client"

import { Shield, Info, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  listing: {
    title: string
    price: string
    image: string
    seller: {
      name: string
      verified: boolean
      rating: number
    }
  }
  isPurchasing: boolean
}

export function PaymentModal({ isOpen, onClose, onConfirm, listing, isPurchasing }: PaymentModalProps) {
  if (!isOpen) return null

  const piAmount = Number.parseFloat(listing.price)
  const commission = piAmount * 0.05
  const total = piAmount + commission

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">π</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Confirmer le paiement</h2>
            <p className="text-sm text-muted-foreground">Vérifiez les détails avant d'acheter</p>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <div className="flex gap-3 mb-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-2">{listing.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">{listing.seller.name}</span>
                  {listing.seller.verified && (
                    <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Prix de l'article</span>
                <span className="font-semibold text-foreground">π {piAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Frais de plateforme (5%)</span>
                <span className="font-semibold text-foreground">π {commission.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-base font-bold text-foreground">Total à payer</span>
                <span className="text-xl font-bold text-primary">π {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-success/10 via-success/5 to-success/10 border border-success/20 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Protection Smart Contract</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Vos Pi sont sécurisés en séquestre jusqu'à ce que vous confirmiez la réception. Le vendeur ne peut pas accéder aux fonds avant votre validation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              En confirmant, vous acceptez les conditions d'utilisation et la politique de remboursement de LocalPi Elite.
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={onConfirm}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              "Traitement en cours..."
            ) : (
              <>
                Confirmer et payer π{total.toFixed(2)}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isPurchasing}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}
