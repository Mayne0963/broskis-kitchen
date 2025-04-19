"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { menuItems } from "@/data/menu-items"
import { MenuItemCard } from "@/components/MenuItemCard"
import { VerificationStatusIndicator } from "@/components/VerificationStatusIndicator"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import { Info } from "lucide-react"

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState<string[]>([])
  const [filteredItems, setFilteredItems] = useState(menuItems)
  const [showInfused, setShowInfused] = useState(true)
  const { verificationStatus } = useAgeVerification()

  // Extract unique categories from menu items
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(menuItems.map((item) => item.category)))
    setCategories(uniqueCategories)
  }, [])

  // Filter menu items based on selected category and infused setting
  useEffect(() => {
    let filtered = menuItems

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (!showInfused) {
      filtered = filtered.filter((item) => !item.infused)
    }

    setFilteredItems(filtered)
  }, [selectedCategory, showInfused])

  // Count infused items
  const infusedCount = menuItems.filter((item) => item.infused).length

  return (
    <div className="container mx-auto py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Explore our delicious offerings, crafted with the freshest ingredients and a whole lot of love.
        </p>
      </motion.div>

      {/* Verification Status Banner */}
      {verificationStatus !== "verified" && (
        <motion.div
          className="mb-8 p-4 rounded-lg bg-gradient-to-r from-black to-gray-900 border border-gold/30"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start">
            <Info className="h-5 w-5 text-gold mr-2 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-white">Age Verification Required for Infused Items</h3>
              <p className="text-gray-300 text-sm mt-1">
                We have {infusedCount} infused items that require age verification.
                {verificationStatus === "pending"
                  ? " Your verification is currently being processed."
                  : " Verify your age to access these special items."}
              </p>
              <div className="mt-2">
                <VerificationStatusIndicator />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              selectedCategory === "all" ? "bg-primary text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                selectedCategory === category ? "bg-primary text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Infused Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="show-infused" className="text-gray-300 text-sm mr-2">
              Show Infused Items
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="show-infused"
                checked={showInfused}
                onChange={() => setShowInfused(!showInfused)}
                className="sr-only"
              />
              <div
                className={`block h-6 rounded-full w-10 transition-colors ${
                  showInfused ? "bg-primary" : "bg-gray-600"
                }`}
              ></div>
              <div
                className={`dot absolute left-1 top-1 bg-white h-4 w-4 rounded-full transition ${
                  showInfused ? "transform translate-x-4" : ""
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <MenuItemCard item={item} />
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No items found in this category.</p>
        </div>
      )}
    </div>
  )
}
