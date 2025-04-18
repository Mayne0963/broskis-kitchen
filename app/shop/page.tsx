"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useCart } from "@/contexts/CartContext"
import type { Product } from "@/utils/productSetup"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import AgeVerificationModal from "@/components/AgeVerificationModal"
import { Filter, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "@/components/PageTransition"
import StaggeredItems, { StaggeredItem } from "@/components/StaggeredItems"

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isVerified } = useAgeVerification()
  const [showVerification, setShowVerification] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products")
        const productsSnapshot = await getDocs(productsCollection)
        const productsList = productsSnapshot.docs.map((doc) => doc.data() as Product)
        setProducts(productsList)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = filter === "all" ? products : products.filter((product) => product.category === filter)

  const handleAddToCart = (product: Product) => {
    // Check if product requires age verification
    if (product.requiresAgeVerification && !isVerified) {
      setSelectedProduct(product)
      setShowVerification(true)
      return
    }

    // Otherwise, add to cart directly
    addToCart(product)
  }

  const handleVerificationComplete = () => {
    setShowVerification(false)
    // Add the selected product to cart if verification was successful
    if (selectedProduct && isVerified) {
      addToCart(selectedProduct)
      setSelectedProduct(null)
    }
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">SHOP OUR MENU</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our selection of mouth-watering dishes and place your order for pickup or delivery
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <Filter className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-bold">Filter Products</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                All
              </FilterButton>
              <FilterButton active={filter === "appetizer"} onClick={() => setFilter("appetizer")}>
                Appetizers
              </FilterButton>
              <FilterButton active={filter === "main"} onClick={() => setFilter("main")}>
                Main Courses
              </FilterButton>
              <FilterButton active={filter === "infused"} onClick={() => setFilter("infused")}>
                Infused Items
              </FilterButton>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <StaggeredItem key={product.id}>
                    <motion.div whileHover={{ y: -10 }} className="menu-card">
                      <div className="relative">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="menu-card-image"
                        />
                        {product.requiresAgeVerification && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-0 right-0 bg-accent text-white px-3 py-1 text-sm font-bold"
                          >
                            21+ ONLY
                          </motion.div>
                        )}
                      </div>
                      <div className="menu-card-content">
                        <h2 className="menu-card-title">{product.name}</h2>
                        <p className="menu-card-description">{product.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="menu-card-price">${(product.price / 100).toFixed(2)}</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCart(product)}
                            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                            disabled={product.requiresAgeVerification && !user}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            {product.requiresAgeVerification && !user ? "Login to Purchase" : "Add to Cart"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </StaggeredItem>
                ))}
              </StaggeredItems>
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          {showVerification && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AgeVerificationModal onClose={handleVerificationComplete} showIdVerification={true} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        active ? "bg-primary text-white" : "bg-white text-gray-800 hover:bg-gray-100"
      }`}
    >
      {children}
    </motion.button>
  )
}
