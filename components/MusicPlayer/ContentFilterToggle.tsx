"use client"

import { useMusicPlayer } from "@/contexts/MusicPlayerContext"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function ContentFilterToggle() {
  const { explicitContent, toggleExplicitContent } = useMusicPlayer()

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md mb-3">
      <div className="flex items-center">
        {explicitContent ? (
          <AlertTriangle size={16} className="text-red-500 mr-2" />
        ) : (
          <CheckCircle size={16} className="text-green-500 mr-2" />
        )}
        <span className="text-sm text-white">Content Filter</span>
      </div>
      <button
        onClick={toggleExplicitContent}
        className="relative inline-flex h-6 w-11 items-center rounded-full"
        aria-pressed={!explicitContent}
      >
        <span className="sr-only">{explicitContent ? "Enable content filter" : "Disable content filter"}</span>
        <span
          className={`${
            explicitContent ? "bg-gray-600" : "bg-green-600"
          } absolute inset-0 rounded-full transition-colors`}
        />
        <motion.span
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          initial={false}
          animate={{ x: explicitContent ? 2 : 22 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}
