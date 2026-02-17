"use client"

import { ArrowLeft, Bell, Lock, Globe, Moon, User, Shield, HelpCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ParametresPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Paramètres</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <h3 className="text-sm font-bold text-foreground px-4 pt-4 pb-3">Compte</h3>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <User className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Informations personnelles</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Vérification KYC</span>
            <span className="text-xs text-success font-medium">Vérifié</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Sécurité et mot de passe</span>
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <h3 className="text-sm font-bold text-foreground px-4 pt-4 pb-3">Préférences</h3>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Notifications</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <Moon className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Mode sombre</span>
            <div className="w-10 h-6 bg-primary rounded-full flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Langue</span>
            <span className="text-xs text-muted-foreground">Français</span>
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <h3 className="text-sm font-bold text-foreground px-4 pt-4 pb-3">Support</h3>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Centre d'aide</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-t border-border">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-left text-sm text-foreground">Conditions d'utilisation</span>
          </button>
        </div>

        <Button variant="destructive" className="w-full" onClick={() => {}}>
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </Button>

        <div className="text-center text-xs text-muted-foreground pt-4">
          LocalPi Elite v1.0.0
          <br />
          Propulsé par Pi Network
        </div>
      </main>
    </div>
  )
}
