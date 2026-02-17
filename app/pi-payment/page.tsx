"use client"

import { ArrowLeft, Coins, Zap, Shield, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function PiPaymentPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Paiement Pi</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-4">
            <Coins className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Paiements en Pi (π)</h2>
          <p className="text-sm text-muted-foreground">
            La cryptomonnaie du peuple, accessible à tous et sans frais de transaction
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-base font-bold text-foreground mb-4">Avantages du Pi</h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Zéro frais</h4>
                <p className="text-xs text-muted-foreground">
                  Pas de frais de transaction sur le réseau Pi. Gardez 100% de vos gains
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Sécurisé</h4>
                <p className="text-xs text-muted-foreground">
                  Blockchain Pi Network avec consensus de sécurité validé par la communauté
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Économie locale</h4>
                <p className="text-xs text-muted-foreground">
                  Soutenez l'écosystème Pi en participant au commerce local P2P
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-base font-bold text-foreground mb-4">Comment payer ?</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <p className="text-sm text-muted-foreground flex-1">Sélectionnez l'article que vous souhaitez acheter</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Cliquez sur "Acheter avec Pi" et confirmez le montant
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <p className="text-sm text-muted-foreground flex-1">Autorisez le paiement dans l'app Pi Browser</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Coins className="w-3 h-3 text-success" />
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Les Pi sont envoyés au Smart Contract Escrow automatiquement
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Coins className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Solde Pi requis</h4>
              <p className="text-xs text-muted-foreground">
                Assurez-vous d'avoir suffisamment de Pi dans votre portefeuille Pi Network avant d'acheter
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={() => router.push('/listing/1')} size="lg" className="w-full">
            Essayer le paiement Pi
          </Button>
          
          <Button onClick={() => router.back()} variant="outline" className="w-full">
            Compris !
          </Button>
        </div>
      </main>
    </div>
  )
}
