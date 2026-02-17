"use client"

import { useEffect, useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"

export function usePiBrowser() {
  const [isPiBrowser, setIsPiBrowser] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const piContext = usePiAuth()

  useEffect(() => {
    const checkPiBrowser = () => {
      return /PiBrowser/i.test(navigator.userAgent) || typeof window.Pi !== "undefined"
    }

    setIsPiBrowser(checkPiBrowser())

    const checkSDKReady = () => {
      if (typeof window !== "undefined" && window.Pi) {
        setSdkReady(true)
      }
    }

    checkSDKReady()
  }, [])

  return {
    isPiBrowser,
    sdkReady,
    piUser: piContext.userData
      ? {
          uid: piContext.userData.id,
          username: piContext.userData.username,
        }
      : null,
    isAuthenticated: piContext.isAuthenticated,
    authenticate: piContext.reinitialize,
    createPayment: piContext.createPayment,
  }
}
