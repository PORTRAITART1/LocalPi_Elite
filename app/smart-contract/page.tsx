"use client"

import { ArrowLeft, ShieldCheck, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function SmartContractPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Smart Contract Escrow</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-success/20 to-success/5 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Séquestre Sécurisé</h2>
          <p className="text-sm text-muted-foreground">
            Les fonds sont bloqués dans un Smart Contract jusqu'à confirmation de la transaction
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-base font-bold text-foreground mb-4">Comment ça fonctionne ?</h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">L'acheteur paie</h4>
                <p className="text-xs text-muted-foreground">
                  Les Pi sont envoyés vers le Smart Contract et bloqués automatiquement
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Le vendeur expédie</h4>
                <p className="text-xs text-muted-foreground">
                  Le vendeur est notifié et prépare l'article pour la livraison
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">L'acheteur confirme</h4>
                <p className="text-xs text-muted-foreground">
                  Après réception, l'acheteur valide la transaction dans l'app
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Fonds libérés</h4>
                <p className="text-xs text-muted-foreground">
                  Le Smart Contract transfère automatiquement les Pi au vendeur
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-start gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-foreground mb-2">Protection garantie</h3>
              <p className="text-sm text-muted-foreground">
                Le Smart Contract protège les deux parties. Le vendeur ne reçoit les fonds que si l'acheteur confirme,
                et l'acheteur peut récupérer ses Pi en cas de litige.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">En cas de problème</h4>
              <p className="text-xs text-muted-foreground">
                Si un litige survient, notre équipe de modération peut intervenir pour résoudre le conflit et débloquer
                les fonds de manière équitable.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={() => router.back()} className="w-full">
          Compris !
        </Button>
      </main>
    </div>
  )
}
