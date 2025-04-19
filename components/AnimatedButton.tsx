"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  variant?: "primary" | "secondary" | "outline"
}

export default function AnimatedButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "primary",
}: AnimatedButtonProps) {
  const baseClasses = "font-bold py-3 px-8 rounded-lg transition-all shadow-lg"

  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 text-white",
    secondary: "bg-accent hover:bg-accent/90 text-white",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type={type}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
