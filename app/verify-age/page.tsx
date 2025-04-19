"use client"

import { useEffect, useState } from "react"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { useRouter, useSearchParams } from "next/navigation"
import AgeVerificationModal from "@/components/AgeVerificationModal"

export default function VerifyAgePage() {
  const { isVerified } = useAgeVerification()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/infused"
  const [showVerification, setShowVerification] = useState(!isVerified)

  useEffect(() => {
    // If already verified, redirect
    if (isVerified && !showVerification) {
      router.push(redirectTo)
    }
  }, [isVerified, showVerification, router, redirectTo])

  const handleVerificationComplete = () => {
    setShowVerification(false)
    // The useEffect will handle redirection if verification was successful
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Age Verification</h1>

      <div className="bg-yellow-100 p-4 rounded-lg mb-8">
        <p className="font-medium">
          You must be 21 years or older to access our infused products. Please verify your age to continue.
        </p>
      </div>

      {showVerification && <AgeVerificationModal onClose={handleVerificationComplete} showIdVerification={true} />}

      {!showVerification && !isVerified && (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Age verification failed. You must be 21 or older to access this content.</p>
          <button
            onClick={() => setShowVerification(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
