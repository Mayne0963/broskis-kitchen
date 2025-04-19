"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ArrowLeft, Clock, Info, Shield } from "lucide-react"
import Link from "next/link"
import { AgeVerificationModal } from "@/components/AgeVerificationModal"
import { IdVerificationForm } from "@/components/IdVerificationForm"

export default function SettingsPage() {
  const {
    verificationStatus,
    verificationDate,
    verificationExpiry,
    verificationMessage,
    resetVerification,
    checkAndShowVerification,
    setShowIdUpload,
    showIdUpload,
  } = useAgeVerification()
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const handleVerify = () => {
    checkAndShowVerification("infused-item")
  }

  const handleStartIdVerification = () => {
    setShowIdUpload(true)
  }

  const handleResetVerification = () => {
    resetVerification()
    setShowConfirmReset(false)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Not available"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">Verified</div>
      case "pending":
        return (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-900 text-yellow-300">Pending Review</div>
        )
      case "rejected":
        return <div className="px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-300">Rejected</div>
      default:
        return <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">Not Verified</div>
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <Link href="/" className="flex items-center text-gold hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>

        <div className="grid gap-8">
          <Card className="border border-gold/30 bg-black">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">Age Verification Status</span>
                {verificationStatus === "verified" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {verificationStatus === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                {verificationStatus === "rejected" && <AlertTriangle className="h-5 w-5 text-red-500" />}
                {verificationStatus === "unverified" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
              </CardTitle>
              <CardDescription>Manage your age verification status for accessing infused menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-gray-900">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Current Status</p>
                      <p className="text-lg font-bold text-white capitalize">{verificationStatus}</p>
                    </div>
                    {getStatusBadge()}
                  </div>
                </div>

                {verificationDate && (
                  <div className="p-4 rounded-md bg-gray-900">
                    <p className="text-sm font-medium text-gray-300">Verification Date</p>
                    <p className="text-white">{formatDate(verificationDate)}</p>
                  </div>
                )}

                {verificationExpiry && (
                  <div className="p-4 rounded-md bg-gray-900">
                    <p className="text-sm font-medium text-gray-300">Verification Expiry</p>
                    <p className="text-white">{formatDate(verificationExpiry)}</p>
                  </div>
                )}

                {verificationMessage && (
                  <div className="p-4 rounded-md bg-blue-900/30">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                      <p className="text-blue-300">{verificationMessage}</p>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-md bg-gray-900">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-gold mr-2 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-300 mb-2">Enhanced ID Verification</p>
                      <p className="text-gray-400 text-sm">
                        Our enhanced ID verification provides a more secure way to verify your age. Upload a
                        government-issued ID and a selfie to get verified.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              {verificationStatus === "unverified" && (
                <>
                  <Button className="w-full sm:w-auto" onClick={handleVerify}>
                    Start Verification
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto" onClick={handleStartIdVerification}>
                    Verify with ID
                  </Button>
                </>
              )}

              {verificationStatus === "pending" && (
                <Button variant="outline" className="w-full sm:w-auto" disabled>
                  Verification in Progress
                </Button>
              )}

              {verificationStatus === "rejected" && (
                <Button className="w-full sm:w-auto" onClick={handleStartIdVerification}>
                  Try Again
                </Button>
              )}

              {verificationStatus === "verified" && (
                <Button variant="destructive" className="w-full sm:w-auto" onClick={() => setShowConfirmReset(true)}>
                  Reset Verification
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Other settings cards could go here */}
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-black border-2 border-gold rounded-lg max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="flex items-center justify-center mb-4 text-yellow-500">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-4">Reset Age Verification?</h2>
            <p className="text-gray-300 text-center mb-6">
              This will remove your age verification status. You will need to verify your age again to view or purchase
              infused products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 border-gold text-gold hover:bg-gold/10"
                onClick={() => setShowConfirmReset(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleResetVerification}>
                Reset Verification
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <AgeVerificationModal />
      {showIdUpload && <IdVerificationForm />}
    </div>
  )
}
