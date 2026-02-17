"use client"

import type React from "react"

import { ArrowLeft, Users, CheckCircle, Shield, FileCheck, Camera, Upload, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePiBrowser } from "@/hooks/use-pi-browser"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function KYCPage() {
  const router = useRouter()
  const { piUser, isAuthenticated, authenticate, sdkReady } = usePiBrowser()
  const [kycStatus, setKycStatus] = useState<"not_started" | "in_progress" | "completed">("not_started")
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    idDocument: null as File | null,
    selfie: null as File | null,
  })

  useEffect(() => {
    if (piUser) {
      const storedKycStatus = localStorage.getItem(`kyc_status_${piUser.uid}`)
      if (storedKycStatus) {
        setKycStatus(storedKycStatus as any)
      }
    }
  }, [piUser])

  const handleStartKYC = async () => {
    if (!isAuthenticated) {
      try {
        await authenticate()
      } catch (error) {
        console.error("[v0] Authentication failed:", error)
        return
      }
    }
    setKycStatus("in_progress")
    setStep(1)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "idDocument" | "selfie") => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }))
    }
  }

  const handleSubmit = async () => {
    if (!piUser) return

    // Store KYC data in localStorage (in production, send to backend)
    const kycData = {
      uid: piUser.uid,
      username: piUser.username,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      status: "completed",
      verifiedAt: new Date().toISOString(),
    }

    localStorage.setItem(`kyc_data_${piUser.uid}`, JSON.stringify(kycData))
    localStorage.setItem(`kyc_status_${piUser.uid}`, "completed")

    setKycStatus("completed")
  }

  if (kycStatus === "completed") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Vérification KYC</h1>
            <div className="w-9" />
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Félicitations !</h2>
          <p className="text-muted-foreground mb-8">
            Votre identité a été vérifiée avec succès. Vous pouvez maintenant profiter de tous les avantages de PiLocal
            Elite.
          </p>
          <Button onClick={() => router.push("/profil")} className="w-full">
            Retour au profil
          </Button>
        </main>
      </div>
    )
  }

  if (kycStatus === "in_progress") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={() => setKycStatus("not_started")}
              className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">Étape {step}/3</h1>
            <div className="w-9" />
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-6 space-y-6">
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">Informations personnelles</h2>
                <p className="text-sm text-muted-foreground">Remplissez vos informations d'identité</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Prénom Nom"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date de naissance</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Rue, Ville, Code postal"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                disabled={!formData.fullName || !formData.dateOfBirth || !formData.address}
              >
                Continuer
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">Document d'identité</h2>
                <p className="text-sm text-muted-foreground">
                  Téléchargez une photo de votre carte d'identité ou passeport
                </p>
              </div>

              <div className="bg-card border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-foreground mb-2">
                  {formData.idDocument ? formData.idDocument.name : "Aucun fichier sélectionné"}
                </p>
                <label htmlFor="id-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Upload className="w-4 h-4" />
                    Choisir un fichier
                  </div>
                  <input
                    id="id-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "idDocument")}
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={!formData.idDocument}>
                  Continuer
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">Selfie de vérification</h2>
                <p className="text-sm text-muted-foreground">Prenez une photo de vous en temps réel</p>
              </div>

              <div className="bg-card border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-foreground mb-2">
                  {formData.selfie ? formData.selfie.name : "Aucun selfie pris"}
                </p>
                <label htmlFor="selfie-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                    Prendre un selfie
                  </div>
                  <input
                    id="selfie-upload"
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "selfie")}
                  />
                </label>
              </div>

              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Important</h4>
                    <p className="text-xs text-muted-foreground">
                      Assurez-vous que votre visage est bien visible et éclairé
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={!formData.selfie}>
                  Soumettre
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Vérification KYC</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Confiance Totale</h2>
          <p className="text-sm text-muted-foreground">
            Échangez uniquement avec des Pioneers dont l'identité a été vérifiée
          </p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-base font-bold text-foreground mb-4">Pourquoi le KYC ?</h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Sécurité renforcée</h4>
                <p className="text-xs text-muted-foreground">
                  Réduisez les risques de fraude en traitant avec des personnes identifiées
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Transparence</h4>
                <p className="text-xs text-muted-foreground">
                  Consultez le badge de vérification et le score de réputation de chaque vendeur
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Conformité Pi Network</h4>
                <p className="text-xs text-muted-foreground">
                  Le KYC suit les standards du Pi Network pour garantir la légitimité
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-base font-bold text-foreground mb-4">Processus de vérification</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Informations personnelles</p>
                <p className="text-xs text-muted-foreground">Nom, date de naissance, adresse</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Photo d'identité</p>
                <p className="text-xs text-muted-foreground">Carte d'identité ou passeport</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Selfie de vérification</p>
                <p className="text-xs text-muted-foreground">Photo en direct pour authentification</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-success/10 border border-success/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Badge vérifié</h4>
              <p className="text-xs text-muted-foreground">
                Une fois validé, vous recevez le badge vert vérifié visible sur tous vos échanges
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleStartKYC} className="w-full" disabled={!sdkReady}>
          {sdkReady ? "Commencer la vérification" : "Chargement..."}
        </Button>
      </main>
    </div>
  )
}
