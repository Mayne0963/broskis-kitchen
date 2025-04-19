"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GoldButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
}

export default function GoldButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "primary",
  size = "md",
  icon,
}: GoldButtonProps) {
  const baseClasses = "font-bold rounded-lg transition-all relative overflow-hidden"

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6",
    lg: "py-4 px-8 text-lg",
  }

  const variantClasses = {
    primary: "bg-primary text-black hover:bg-primary/90 shadow-lg",
    secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-lg",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      type={type}
      disabled={disabled}
    >
      <span className="relative z-10 flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </span>
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent shine-effect"></span>
      </span>
      <style jsx>{`
        .shine-effect {
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.5s;
        }
        button:hover .shine-effect {
          transform: translateX(100%) skewX(-15deg);
        }
      `}</style>
    </motion.button>
  )
}
