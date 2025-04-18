"use client"

import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import Link from "next/link"
import { ShoppingBag, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CartIcon() {
  const { totalItems, items, removeFromCart, subtotal } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleCart}
        className="flex items-center text-secondary hover:text-primary transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-6 w-6" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Your Cart</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleCart}
                  className="text-gray-500 hover:text-primary"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty</p>
              ) : (
                <>
                  <motion.div className="max-h-60 overflow-y-auto">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center py-3 border-b"
                      >
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            ${(item.product.price / 100).toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 pt-2 border-t"
                  >
                    <div className="flex justify-between font-medium">
                      <span>Subtotal:</span>
                      <span>${(subtotal / 100).toFixed(2)}</span>
                    </div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/checkout"
                        className="block w-full mt-4 py-2 text-center bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-bold"
                        onClick={toggleCart}
                      >
                        Checkout
                      </Link>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
