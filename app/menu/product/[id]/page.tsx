"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { menuItems } from "@/data/menu-items"
import { Button } from "@/components/ui/button"
import { AgeVerificationModal } from "@/components/AgeVerificationModal"
import { motion } from "framer-motion"

export default function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { checkAndShowVerification, showVerification } = useAgeVerification()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find the product by ID
    const foundProduct = menuItems.find((item) => item.id === id)
    setProduct(foundProduct)
    setLoading(false)

    // Check if this product requires age verification
    if (foundProduct && foundProduct.infused) {
      checkAndShowVerification(id as string)
    }
  }, [id, checkAndShowVerification])

  const handleAddToCart = () => {
    if (product) {
      // Check if age verification is required for this product
      if (product.infused) {
        const canProceed = checkAndShowVerification(product.id)
        if (!canProceed) return // Stop if verification is needed but not completed
      }

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    )
  }

  return (
    <>
      <motion.div
        className="container mx-auto py-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            {product.infused && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                Infused
              </div>
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-gold mb-4">${product.price.toFixed(2)}</p>
              <p className="mb-6">{product.description}</p>

              <div className="flex items-center mb-6">
                <button
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center border border-gold"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="mx-4 text-xl font-bold">{quantity}</span>
                <button
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center border border-gold"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <Button onClick={handleAddToCart} className="w-full py-6 text-lg">
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </motion.div>

      {showVerification && <AgeVerificationModal />}
    </>
  )
}
