"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config"
import { api, setApiAuthToken } from "@/lib/api"

export type LoginDTO = {
  id: string
  username: string
  credits_balance: number
  terms_accepted: boolean
  member_since?: string
}

interface PiAuthResult {
  accessToken: string
  user: {
    uid: string
    username: string
  }
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>
      authenticate: (scopes: string[]) => Promise<PiAuthResult>
      createPayment: (
        paymentData: {
          amount: number
          memo: string
          metadata: Record<string, unknown>
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void
          onReadyForServerCompletion: (paymentId: string, txid: string) => void
          onCancel: (paymentId: string) => void
          onError: (error: Error, payment?: any) => void
        },
      ) => void
    }
  }
}

interface PiAuthContextType {
  isAuthenticated: boolean
  authMessage: string
  piAccessToken: string | null
  userData: LoginDTO | null
  reinitialize: () => Promise<void>
  logout: () => void
  createPayment: (
    amount: number,
    memo: string,
    metadata?: Record<string, unknown>,
  ) => Promise<{ paymentId: string; txid: string }>
  recordTransaction: (type: 'sale' | 'purchase', piAmount: number) => void
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined)

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      throw new Error("SDK URL is not set")
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL
    script.async = true

    script.onload = () => {
      console.log("✅ Pi SDK script loaded successfully")
      resolve()
    }

    script.onerror = () => {
      console.error("❌ Failed to load Pi SDK script")
      reject(new Error("Failed to load Pi SDK script"))
    }

    document.head.appendChild(script)
  })
}

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...")
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<LoginDTO | null>(null)

  const authenticateAndLogin = async (): Promise<void> => {
    setAuthMessage("Authenticating with Pi Network...")
    const piAuthResult = await window.Pi.authenticate(["username"])

    setAuthMessage("Logging in to backend...")
    const loginRes = await api.post<LoginDTO>(BACKEND_URLS.LOGIN, {
      pi_auth_token: piAuthResult.accessToken,
    })

    if (piAuthResult?.accessToken) {
      setPiAccessToken(piAuthResult.accessToken)
      setApiAuthToken(piAuthResult.accessToken)
    }

    const userData = loginRes.data
    
    if (typeof window !== 'undefined' && userData.id) {
      const memberSinceKey = `member_since_${userData.id}`
      if (!localStorage.getItem(memberSinceKey)) {
        localStorage.setItem(memberSinceKey, new Date().toISOString())
      }
      userData.member_since = localStorage.getItem(memberSinceKey) || new Date().toISOString()
    }

    setUserData(userData)
  }

  const initializePiAndAuthenticate = async () => {
    try {
      setAuthMessage("Loading Pi Network SDK...")

      // Only load if not already loaded
      if (typeof window.Pi === "undefined") {
        await loadPiSDK()
      }

      if (typeof window.Pi === "undefined") {
        throw new Error("Pi object not available after script load")
      }

      setAuthMessage("Initializing Pi Network...")
      await window.Pi.init({
        version: "2.0",
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      })

      await authenticateAndLogin()

      setIsAuthenticated(true)
    } catch (err) {
      console.error("❌ Pi Network initialization failed:", err)
      setAuthMessage("Failed to authenticate or login. Please refresh and try again.")
    }
  }

  const createPayment = async (
    amount: number,
    memo: string,
    metadata: Record<string, unknown> = {},
  ): Promise<{ paymentId: string; txid: string }> => {
    if (!window.Pi) {
      throw new Error("Pi SDK not available")
    }

    if (!userData) {
      throw new Error("User not authenticated")
    }

    const commission = amount * 0.05
    const totalAmount = amount + commission

    return new Promise((resolve, reject) => {
      window.Pi.createPayment(
        {
          amount: totalAmount,
          memo,
          metadata: {
            ...metadata,
            commission,
            adminWallet: "GDH7MNRURD4G6J6ZL5ATTTPC4QAS6MOM3CCYPHPF3A7KYCR2Z7OWJL5F",
            buyerUid: userData.id,
          },
        },
        {
          onReadyForServerApproval: async (paymentId) => {
            console.log("Payment ready for approval:", paymentId)
            await fetch("/api/payments/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentId,
                amount,
                commission,
                metadata,
              }),
            })
          },
          onReadyForServerCompletion: async (paymentId, txid) => {
            console.log("Payment completed:", paymentId, txid)
            await fetch("/api/payments/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid, amount, commission }),
            })
            resolve({ paymentId, txid })
          },
          onCancel: (paymentId) => {
            console.log("Payment cancelled:", paymentId)
            reject(new Error("Payment cancelled by user"))
          },
          onError: (error, payment) => {
            console.error("Payment error:", error, payment)
            reject(error)
          },
        },
      )
    })
  }

  const recordTransaction = (type: 'sale' | 'purchase', piAmount: number) => {
    if (!userData?.id || typeof window === 'undefined') return

    const statsKey = `stats_${userData.id}`
    const existingStats = localStorage.getItem(statsKey)
    const stats = existingStats ? JSON.parse(existingStats) : { sales: 0, purchases: 0, piExchanged: 0 }

    if (type === 'sale') {
      stats.sales += 1
    } else if (type === 'purchase') {
      stats.purchases += 1
    }
    stats.piExchanged += piAmount

    localStorage.setItem(statsKey, JSON.stringify(stats))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setPiAccessToken(null)
    setUserData(null)
    setApiAuthToken(null)
    setAuthMessage("Logged out successfully")
    
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  useEffect(() => {
    initializePiAndAuthenticate()
  }, [])

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    piAccessToken,
    userData,
    reinitialize: initializePiAndAuthenticate,
    logout,
    createPayment,
    recordTransaction,
  }

  return <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
}

/**
 * Hook to access Pi Network authentication state and user data
 *
 * Must be used within a component wrapped by PiAuthProvider.
 * Provides read-only access to authentication state and user data.
 *
 * @returns {PiAuthContextType} Authentication state and methods
 * @throws {Error} If used outside of PiAuthProvider
 *
 * @example
 * const { piAccessToken, userData, isAuthenticated, reinitialize, createPayment } = usePiAuth();
 */
export function usePiAuth() {
  const context = useContext(PiAuthContext)
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider")
  }
  return context
}
