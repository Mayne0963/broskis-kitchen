"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: string
}

export default function LoadingSpinner({ size = "md", color = "primary" }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  }

  return (
    <div className="flex justify-center items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className={`rounded-full border-t-2 border-b-2 ${sizeMap[size]} border-${color}`}
      />
    </div>
  )
}
