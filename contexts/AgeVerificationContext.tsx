"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { isVerifiedAge } from "@/utils/ageGate"
import Cookies from "js-cookie"

interface AgeVerificationContextType {
  isVerified: boolean
  isPending: boolean
  verifyAge: (dob: Date, idName?: string) => Promise<boolean>
  resetVerification: () => void
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined)

export function AgeVerificationProvider({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isPending, setIsPending] = useState<boolean>(false)

  // Check if user is already verified on mount
  useEffect(() => {
    const storedVerification = sessionStorage.getItem("age-verified")
    if (storedVerification === "true") {
      setIsVerified(true)
    }
  }, [])

  const verifyAge = async (dob: Date, idName?: string): Promise<boolean> => {
    try {
      setIsPending(true)

      // Calculate age
      const today = new Date()
      const birthDate = new Date(dob)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      // Basic age check (must be 21 or older)
      const isOldEnough = age >= 21

      // If basic check passes and ID name is provided, use AI verification
      let verificationResult = isOldEnough

      if (isOldEnough && idName) {
        // Format date as MM/DD/YYYY for the AI verification
        const formattedDob = `${(birthDate.getMonth() + 1).toString().padStart(2, "0")}/${birthDate
          .getDate()
          .toString()
          .padStart(2, "0")}/${birthDate.getFullYear()}`

        verificationResult = await isVerifiedAge(formattedDob, idName)
      }

      if (verificationResult) {
        // Store verification in session storage
        sessionStorage.setItem("age-verified", "true")

        // Also set a cookie for middleware
        Cookies.set("age-verified", "true", { expires: 1 }) // Expires in 1 day

        setIsVerified(true)
      }

      return verificationResult
    } catch (error) {
      console.error("Age verification error:", error)
      return false
    } finally {
      setIsPending(false)
    }
  }

  const resetVerification = () => {
    sessionStorage.removeItem("age-verified")
    Cookies.remove("age-verified")
    setIsVerified(false)
  }

  return (
    <AgeVerificationContext.Provider value={{ isVerified, isPending, verifyAge, resetVerification }}>
      {children}
    </AgeVerificationContext.Provider>
  )
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext)
  if (context === undefined) {
    throw new Error("useAgeVerification must be used within an AgeVerificationProvider")
  }
  return context
}
