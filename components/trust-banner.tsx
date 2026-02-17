"use client"

import { ShieldCheck, Users, Coins } from "lucide-react"
import Link from "next/link"

export function TrustBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-xl p-4 mb-5">
      <h3 className="text-sm font-bold text-foreground mb-3">Pourquoi LocalPi Elite ?</h3>
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/smart-contract"
          className="flex flex-col items-center text-center hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mb-1.5">
            <ShieldCheck className="w-5 h-5 text-success" />
          </div>
          <span className="text-[10px] font-medium text-foreground">Smart Contract</span>
          <span className="text-[9px] text-muted-foreground">Escrow sécurisé</span>
        </Link>
        <Link href="/kyc" className="flex flex-col items-center text-center hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-1.5">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[10px] font-medium text-foreground">Vérification KYC</span>
          <span className="text-[9px] text-muted-foreground">Confiance totale</span>
        </Link>
        <Link href="/pi-payment" className="flex flex-col items-center text-center hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-1.5">
            <Coins className="w-5 h-5 text-accent" />
          </div>
          <span className="text-[10px] font-medium text-foreground">Paiement Pi</span>
          <span className="text-[9px] text-muted-foreground">Sans frais</span>
        </Link>
      </div>
    </div>
  )
}
