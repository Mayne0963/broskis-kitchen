"use client"

import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

type VerificationStatusIndicatorProps = {
  showLabel?: boolean
  showLink?: boolean
  className?: string
}

export function VerificationStatusIndicator({
  showLabel = true,
  showLink = true,
  className = "",
}: VerificationStatusIndicatorProps) {
  const { verificationStatus } = useAgeVerification()

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500 mr-1" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
    }
  }

  const getStatusText = () => {
    switch (verificationStatus) {
      case "verified":
        return "Age Verified"
      case "pending":
        return "Verification Pending"
      case "rejected":
        return "Verification Rejected"
      default:
        return "Not Verified"
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className={`flex items-center ${showLink ? "hover:opacity-80" : ""}`}
      >
        {getStatusIcon()}
        {showLabel && <span className="text-xs text-gray-300">{getStatusText()}</span>}
      </motion.div>
      {showLink && (
        <Link href="/settings" className="text-xs text-gold ml-2 hover:underline">
          Manage
        </Link>
      )}
    </div>
  )
}
