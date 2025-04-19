"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/CartContext"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { AgeVerificationModal } from "@/components/AgeVerificationModal"
import type { MenuItem } from "@/types/menu"

type MenuItemCardProps = {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart()
  const { checkAndShowVerification, showVerification } = useAgeVerification()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Check if age verification is required
    if (item.infused) {
      const canProceed = checkAndShowVerification(item.id)
      if (!canProceed) return // Stop if verification is needed but not completed
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    })
  }

  const handleItemClick = (e: React.MouseEvent) => {
    // Check if age verification is required before navigating
    if (item.infused) {
      const canProceed = checkAndShowVerification(item.id)
      if (!canProceed) {
        e.preventDefault()
        return
      }
    }
  }

  return (
    <>
      <motion.div
        className="bg-black rounded-lg overflow-hidden shadow-lg border border-gold/30 h-full"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Link href={`/menu/product/${item.id}`} onClick={handleItemClick}>
          <div className="relative h-48 w-full">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />
            {item.popular && (
              <div className="absolute top-2 left-2 bg-gold text-black px-2 py-1 rounded-full text-xs font-bold">
                Popular
              </div>
            )}
            {item.infused && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                Infused
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-1 text-white">{item.name}</h3>
            <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-gold font-bold">${item.price.toFixed(2)}</span>
              <motion.button
                className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>

      {showVerification && <AgeVerificationModal />}
    </>
  )
}
