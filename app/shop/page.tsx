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
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shop Our Menu</h1>

      <div className="mb-8">
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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <span className="font-medium">${(product.price / 100).toFixed(2)}</span>
                </div>
                <p className="text-gray-600 mb-4">{product.description}</p>

                {product.requiresAgeVerification && (
                  <div className="bg-yellow-100 p-2 rounded-md mb-4 text-sm">
                    Age verification required for purchase
                  </div>
                )}

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={product.requiresAgeVerification && !user}
                >
                  {product.requiresAgeVerification && !user ? "Login to Purchase" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showVerification && <AgeVerificationModal onClose={handleVerificationComplete} showIdVerification={true} />}
    </div>
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
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md ${
        active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  )
}
