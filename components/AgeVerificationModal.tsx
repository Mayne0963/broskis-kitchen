"use client"

import type React from "react"

import { useState } from "react"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"

interface AgeVerificationModalProps {
  onClose?: () => void
  showIdVerification?: boolean
}

export default function AgeVerificationModal({ onClose, showIdVerification = false }: AgeVerificationModalProps) {
  const { verifyAge, isPending } = useAgeVerification()
  const [month, setMonth] = useState("")
  const [day, setDay] = useState("")
  const [year, setYear] = useState("")
  const [idName, setIdName] = useState("")
  const [error, setError] = useState("")
  const [advancedVerification, setAdvancedVerification] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate inputs
    if (!month || !day || !year) {
      setError("Please enter your complete date of birth")
      return
    }

    const monthNum = Number.parseInt(month, 10)
    const dayNum = Number.parseInt(day, 10)
    const yearNum = Number.parseInt(year, 10)

    // Basic validation
    if (
      isNaN(monthNum) ||
      isNaN(dayNum) ||
      isNaN(yearNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      dayNum < 1 ||
      dayNum > 31 ||
      yearNum < 1900 ||
      yearNum > new Date().getFullYear()
    ) {
      setError("Please enter a valid date of birth")
      return
    }

    // If advanced verification is enabled, validate ID name
    if (advancedVerification && !idName.trim()) {
      setError("Please enter the name on your ID")
      return
    }

    // Create date object (month is 0-indexed in JS Date)
    const dob = new Date(yearNum, monthNum - 1, dayNum)

    // Verify age
    const verified = await verifyAge(dob, advancedVerification ? idName : undefined)

    if (!verified) {
      setError("Age verification failed. You must be 21 or older to access this content.")
      return
    }

    // Close modal if verification successful and onClose provided
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Age Verification Required</h2>
          <p className="mb-6 text-gray-600">
            You must be 21 years or older to view and purchase infused products. Please enter your date of birth to
            verify your age.
          </p>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="month" className="sr-only">
                    Month
                  </label>
                  <input
                    type="text"
                    id="month"
                    placeholder="MM"
                    maxLength={2}
                    value={month}
                    onChange={(e) => setMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="day" className="sr-only">
                    Day
                  </label>
                  <input
                    type="text"
                    id="day"
                    placeholder="DD"
                    maxLength={2}
                    value={day}
                    onChange={(e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="sr-only">
                    Year
                  </label>
                  <input
                    type="text"
                    id="year"
                    placeholder="YYYY"
                    maxLength={4}
                    value={year}
                    onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {showIdVerification && (
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={advancedVerification}
                    onChange={(e) => setAdvancedVerification(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Use advanced ID verification</span>
                </label>
              </div>
            )}

            {advancedVerification && (
              <div className="mb-6">
                <label htmlFor="idName" className="block text-sm font-medium text-gray-700 mb-2">
                  Name on ID
                </label>
                <input
                  type="text"
                  id="idName"
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the full name on your ID"
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? "Verifying..." : "Verify Age"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-xs text-gray-500 text-center">
            By entering your date of birth, you confirm that all information provided is accurate and you agree to our
            terms of service regarding age verification.
          </div>
        </div>
      </div>
    </div>
  )
}
