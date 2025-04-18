"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info } from "lucide-react"

export function AgeVerificationModal() {
  const { verify, cancel, isPending } = useAgeVerification()

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
          <div className="flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-4">Age Verification Required</h2>
          <p className="text-gray-300 text-center mb-6">
            You are attempting to view or purchase infused products. These products are only available to customers who
            are 21 years of age or older.
          </p>

          <div className="flex items-start p-3 bg-blue-900/30 rounded-md mb-6">
            <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-blue-300 text-sm">
              For enhanced security and compliance, we now offer ID verification. This provides a more secure way to
              verify your age and gives you full access to all products.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 border-gold text-gold hover:bg-gold/10" onClick={cancel}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={verify} disabled={isPending}>
              {isPending ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Verifying...
                </span>
              ) : (
                "Verify with ID"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AgeVerificationModal
