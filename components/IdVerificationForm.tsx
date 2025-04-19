"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Upload, X, Camera, Info } from "lucide-react"
import Image from "next/image"

export function IdVerificationForm() {
  const { submitIdVerification, isPending, cancel } = useAgeVerification()
  const [idImage, setIdImage] = useState<string | null>(null)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<"id" | "selfie" | "review">("id")
  const [error, setError] = useState<string | null>(null)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  const idInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setIdImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelfieImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!idImage || !selfieImage) {
      setError("Both ID and selfie are required")
      return
    }

    if (!privacyAccepted) {
      setError("You must accept the privacy policy")
      return
    }

    const formData = new FormData()

    // Convert base64 to blob and append to formData
    if (idImage) {
      const idBlob = await fetch(idImage).then((r) => r.blob())
      formData.append("idImage", idBlob, "id.jpg")
    }

    if (selfieImage) {
      const selfieBlob = await fetch(selfieImage).then((r) => r.blob())
      formData.append("selfieImage", selfieBlob, "selfie.jpg")
    }

    await submitIdVerification(formData)
  }

  const nextStep = () => {
    if (activeStep === "id") {
      if (!idImage) {
        setError("Please upload your ID")
        return
      }
      setActiveStep("selfie")
    } else if (activeStep === "selfie") {
      if (!selfieImage) {
        setError("Please upload your selfie")
        return
      }
      setActiveStep("review")
    }
  }

  const prevStep = () => {
    if (activeStep === "selfie") {
      setActiveStep("id")
    } else if (activeStep === "review") {
      setActiveStep("selfie")
    }
  }

  const resetImage = (type: "id" | "selfie") => {
    if (type === "id") {
      setIdImage(null)
      if (idInputRef.current) {
        idInputRef.current.value = ""
      }
    } else {
      setSelfieImage(null)
      if (selfieInputRef.current) {
        selfieInputRef.current.value = ""
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-black border-2 border-gold rounded-lg max-w-md w-full p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">ID Verification</h2>
            <button onClick={cancel} className="text-gray-400 hover:text-white" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-4">
              <div
                className={`flex-1 text-center py-2 border-b-2 ${
                  activeStep === "id" ? "border-primary text-primary" : "border-gray-700 text-gray-500"
                }`}
              >
                1. Upload ID
              </div>
              <div
                className={`flex-1 text-center py-2 border-b-2 ${
                  activeStep === "selfie" ? "border-primary text-primary" : "border-gray-700 text-gray-500"
                }`}
              >
                2. Selfie
              </div>
              <div
                className={`flex-1 text-center py-2 border-b-2 ${
                  activeStep === "review" ? "border-primary text-primary" : "border-gray-700 text-gray-500"
                }`}
              >
                3. Review
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {activeStep === "id" && (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">
                  Please upload a clear photo of your government-issued ID (driver's license, passport, or state ID).
                </p>

                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  {idImage ? (
                    <div className="relative">
                      <Image
                        src={idImage || "/placeholder.svg"}
                        alt="ID Preview"
                        width={300}
                        height={200}
                        className="mx-auto rounded-md object-contain max-h-[200px]"
                      />
                      <button
                        type="button"
                        onClick={() => resetImage("id")}
                        className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="h-10 w-10 mx-auto text-gray-500 mb-2" />
                      <p className="text-gray-400 mb-2">Drag and drop your ID, or click to browse</p>
                      <Button type="button" variant="outline" size="sm" onClick={() => idInputRef.current?.click()}>
                        Select File
                      </Button>
                    </div>
                  )}
                  <input ref={idInputRef} type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
                </div>

                <div className="flex items-start p-3 bg-blue-900/30 rounded-md">
                  <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-300 text-sm">
                    Make sure all four corners of your ID are visible and all information is clearly readable.
                  </p>
                </div>
              </div>
            )}

            {activeStep === "selfie" && (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">
                  Please take a selfie or upload a photo of yourself holding your ID next to your face.
                </p>

                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                  {selfieImage ? (
                    <div className="relative">
                      <Image
                        src={selfieImage || "/placeholder.svg"}
                        alt="Selfie Preview"
                        width={300}
                        height={200}
                        className="mx-auto rounded-md object-contain max-h-[200px]"
                      />
                      <button
                        type="button"
                        onClick={() => resetImage("selfie")}
                        className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Camera className="h-10 w-10 mx-auto text-gray-500 mb-2" />
                      <p className="text-gray-400 mb-2">Take a selfie or upload a photo</p>
                      <div className="flex justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => selfieInputRef.current?.click()}
                        >
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={selfieInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-start p-3 bg-blue-900/30 rounded-md">
                  <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-300 text-sm">
                    Your face should be clearly visible and match the photo on your ID.
                  </p>
                </div>
              </div>
            )}

            {activeStep === "review" && (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">Please review your submission before finalizing.</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-700 rounded-lg p-2">
                    <p className="text-xs text-gray-400 mb-1">ID Document</p>
                    {idImage && (
                      <Image
                        src={idImage || "/placeholder.svg"}
                        alt="ID Preview"
                        width={150}
                        height={100}
                        className="mx-auto rounded-md object-contain h-[100px]"
                      />
                    )}
                  </div>
                  <div className="border border-gray-700 rounded-lg p-2">
                    <p className="text-xs text-gray-400 mb-1">Selfie</p>
                    {selfieImage && (
                      <Image
                        src={selfieImage || "/placeholder.svg"}
                        alt="Selfie Preview"
                        width={150}
                        height={100}
                        className="mx-auto rounded-md object-contain h-[100px]"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="mr-2 mt-1"
                    />
                    <span className="text-sm text-gray-300">
                      I understand that my ID will be securely stored and used only for age verification purposes. My
                      data will be handled according to the{" "}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex items-start p-3 bg-yellow-900/30 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300 text-sm">
                    By submitting, you confirm that you are 21 or older and that the ID provided belongs to you.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {activeStep !== "id" ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={cancel}>
                  Cancel
                </Button>
              )}

              {activeStep !== "review" ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isPending || !privacyAccepted}>
                  {isPending ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Verification"
                  )}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
