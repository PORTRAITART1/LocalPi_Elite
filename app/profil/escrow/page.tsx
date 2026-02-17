"use client"

import { ArrowLeft, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { getEscrowTransactions, updateEscrowStatus, type EscrowTransaction } from "@/lib/storage"

export default function EscrowPage() {
  const router = useRouter()
  const { userData, isAuthenticated } = usePiAuth()
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }
    
    if (userData?.id) {
      const userTransactions = getEscrowTransactions(userData.id)
      setTransactions(userTransactions)
    }
  }, [isAuthenticated, userData, router])

  const handleConfirmReception = (transactionId: string) => {
    if (userData?.id && confirm("Confirmez-vous avoir reçu l'article ?")) {
      updateEscrowStatus(userData.id, transactionId, 'confirmed')
      setTransactions(getEscrowTransactions(userData.id))
    }
  }

  const getStatusIcon = (status: EscrowTransaction['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'released':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusText = (status: EscrowTransaction['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'confirmed':
        return 'Confirmé'
      case 'released':
        return 'Libéré'
      case 'disputed':
        return 'Litige'
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
            <h1 className="text-lg font-bold text-foreground">Transactions escrow</h1>
            <p className="text-xs text-muted-foreground">{transactions.length} transaction(s)</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Aucune transaction en cours</p>
            <p className="text-xs text-muted-foreground mt-2">
              Vos achats sécurisés apparaîtront ici
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{transaction.listingTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(transaction.status)}
                  <span className="text-xs font-medium">{getStatusText(transaction.status)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-border">
                <span className="text-sm text-muted-foreground">Montant</span>
                <span className="text-lg font-bold text-primary">{transaction.amount}π</span>
              </div>

              {transaction.status === 'pending' && transaction.buyerId === userData?.id && (
                <Button
                  onClick={() => handleConfirmReception(transaction.id)}
                  className="w-full mt-3 bg-success text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer la réception
                </Button>
              )}

              {transaction.status === 'confirmed' && (
                <div className="mt-3 p-3 bg-success/10 rounded-lg">
                  <p className="text-xs text-success text-center">
                    Les fonds seront libérés automatiquement dans 24h
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
