"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"

export function useScrollAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return { ref, isInView }
}
