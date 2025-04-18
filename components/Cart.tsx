"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Plus, Minus, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { AgeVerificationModal } from "@/components/AgeVerificationModal"
import { menuItems } from "@/data/menu-items"

export function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart()
  const { checkAndShowVerification, showVerification, isVerified } = useAgeVerification()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Check if cart contains any infused items
  const hasInfusedItems = () => {
    return items.some((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.id)
      return menuItem?.infused
    })
  }

  const handleCheckout = () => {
    // If cart has infused items and user is not verified, show verification
    if (hasInfusedItems() && !isVerified) {
      // We'll use a dummy item ID just to trigger the verification
      checkAndShowVerification("infused-item")
      return
    }

    // Otherwise proceed to checkout
    setIsOpen(false)
    router.push("/checkout")
  }

  // Animation variants
  const cartVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <>
      <button className="relative p-2" onClick={() => setIsOpen(true)} aria-label="Open cart">
        <ShoppingCart className="h-6 w-6 text-white" />
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            >
              {items.length}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-black border-l border-gold/30 z-50 flex flex-col"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={cartVariants}
              transition={{ type: "tween" }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gold/30">
                <h2 className="text-xl font-bold text-white">Your Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close cart"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-400 text-center">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    <AnimatePresence>
                      {items.map((item) => {
                        const menuItem = menuItems.find((mi) => mi.id === item.id)

                        return (
                          <motion.div
                            key={item.id}
                            className="flex items-center mb-4 bg-gray-900 rounded-lg overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative h-20 w-20 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                              {menuItem?.infused && (
                                <div className="absolute top-1 right-1 bg-red-600 text-white px-1 rounded-full text-[10px] font-bold">
                                  Infused
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-3">
                              <h3 className="text-white font-medium">{item.name}</h3>
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center">
                                  <button
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="text-gray-400 hover:text-white"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="mx-2 text-white">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="text-gray-400 hover:text-white"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-gold mr-2">${(item.price * item.quantity).toFixed(2)}</span>
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-400 hover:text-red-500"
                                    aria-label="Remove item"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                  <div className="p-4 border-t border-gold/30">
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="text-white font-bold">${total.toFixed(2)}</span>
                    </div>
                    <motion.button
                      className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center font-bold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                    >
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.button>
                    <button
                      className="w-full text-gray-400 hover:text-white py-2 mt-2 text-sm"
                      onClick={() => clearCart()}
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showVerification && <AgeVerificationModal />}
    </>
  )
}
