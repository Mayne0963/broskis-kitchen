"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { menuItems } from "@/data/menu-items"

// Define verification status types
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected"

type AgeVerificationContextType = {
  verificationStatus: VerificationStatus
  isPending: boolean
  showVerification: boolean
  showIdUpload: boolean
  verificationDate: Date | null
  verificationExpiry: Date | null
  verificationMessage: string | null
  verify: () => void
  cancel: () => void
  resetVerification: () => void
  submitIdVerification: (formData: FormData) => Promise<void>
  checkItemRequiresVerification: (itemId: string) => boolean
  checkAndShowVerification: (itemId: string) => boolean
  setShowIdUpload: (show: boolean) => void
  isVerified: boolean
}

const AgeVerificationContext = createContext<AgeVerificationContextType>({
  verificationStatus: "unverified",
  isPending: false,
  showVerification: false,
  showIdUpload: false,
  verificationDate: null,
  verificationExpiry: null,
  verificationMessage: null,
  verify: () => {},
  cancel: () => {},
  resetVerification: () => {},
  submitIdVerification: async () => {},
  checkItemRequiresVerification: () => false,
  checkAndShowVerification: () => false,
  setShowIdUpload: () => {},
  isVerified: false,
})

export const useAgeVerification = () => useContext(AgeVerificationContext)

export const AgeVerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("unverified")
  const [isPending, setIsPending] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [showIdUpload, setShowIdUpload] = useState(false)
  const [verificationDate, setVerificationDate] = useState<Date | null>(null)
  const [verificationExpiry, setVerificationExpiry] = useState<Date | null>(null)
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Computed property for backward compatibility
  const isVerified = verificationStatus === "verified"

  // Check local storage for verification status on mount
  useEffect(() => {
    const status = localStorage.getItem("age-verification-status") as VerificationStatus | null
    if (status) {
      setVerificationStatus(status)
    }

    const storedDate = localStorage.getItem("age-verified-date")
    if (storedDate) {
      setVerificationDate(new Date(storedDate))
    }

    const storedExpiry = localStorage.getItem("age-verification-expiry")
    if (storedExpiry) {
      setVerificationExpiry(new Date(storedExpiry))
    }

    const message = localStorage.getItem("age-verification-message")
    if (message) {
      setVerificationMessage(message)
    }

    // Check if verification has expired
    if (verificationExpiry && new Date() > new Date(verificationExpiry)) {
      resetVerification()
    }
  }, [])

  // Function to check if an item requires age verification
  const checkItemRequiresVerification = (itemId: string): boolean => {
    const item = menuItems.find((item) => item.id === itemId)
    return item?.infused || false
  }

  // Function to check and show verification if needed
  const checkAndShowVerification = (itemId: string): boolean => {
    if (verificationStatus === "verified") return true // Already verified

    const requiresVerification = checkItemRequiresVerification(itemId)
    if (requiresVerification) {
      setShowVerification(true)
      return false // Not verified yet
    }

    return true // No verification needed
  }

  // Simple verification (without ID)
  const verify = () => {
    setIsPending(true)
    // Simulate verification process
    setTimeout(() => {
      setShowVerification(false)
      setShowIdUpload(true)
      setIsPending(false)
    }, 1000)
  }

  const cancel = () => {
    setShowVerification(false)
    setShowIdUpload(false)
    // If on a product page that requires verification, redirect to menu
    if (pathname.includes("/menu/product/")) {
      const productId = pathname.split("/").pop()
      if (productId && checkItemRequiresVerification(productId)) {
        router.push("/menu")
      }
    }
  }

  const resetVerification = () => {
    setVerificationStatus("unverified")
    setVerificationDate(null)
    setVerificationExpiry(null)
    setVerificationMessage(null)
    localStorage.removeItem("age-verification-status")
    localStorage.removeItem("age-verified-date")
    localStorage.removeItem("age-verification-expiry")
    localStorage.removeItem("age-verification-message")
  }

  // ID verification submission
  const submitIdVerification = async (formData: FormData) => {
    setIsPending(true)
    setVerificationMessage(null)

    try {
      // In a real app, you would upload the ID to a secure server
      // and potentially use an identity verification service

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Set verification to pending
      const now = new Date()
      setVerificationStatus("pending")
      setVerificationDate(now)

      // In a real app, the expiry would be set after admin approval
      // For demo purposes, we'll set it to 30 days from now
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 30)
      setVerificationExpiry(expiry)

      // Store in localStorage
      localStorage.setItem("age-verification-status", "pending")
      localStorage.setItem("age-verified-date", now.toISOString())
      localStorage.setItem("age-verification-expiry", expiry.toISOString())

      setVerificationMessage("Your ID has been submitted for verification. This usually takes 1-2 business days.")

      // For demo purposes, we'll auto-approve after 5 seconds
      // In a real app, this would be done by an admin
      setTimeout(() => {
        setVerificationStatus("verified")
        localStorage.setItem("age-verification-status", "verified")
        setVerificationMessage("Your ID has been verified. You now have access to all products.")
        localStorage.setItem(
          "age-verification-message",
          "Your ID has been verified. You now have access to all products.",
        )
      }, 5000)

      setShowIdUpload(false)
    } catch (error) {
      console.error("Error submitting ID verification:", error)
      setVerificationMessage("There was an error submitting your ID. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AgeVerificationContext.Provider
      value={{
        verificationStatus,
        isPending,
        showVerification,
        showIdUpload,
        verificationDate,
        verificationExpiry,
        verificationMessage,
        verify,
        cancel,
        resetVerification,
        submitIdVerification,
        checkItemRequiresVerification,
        checkAndShowVerification,
        setShowIdUpload,
        isVerified,
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  )
}
