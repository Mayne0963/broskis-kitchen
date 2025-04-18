"use client"

import { useState, useEffect } from "react"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"
import AgeVerificationModal from "@/components/AgeVerificationModal"
import Link from "next/link"

export default function InfusedMenu() {
  const { isVerified } = useAgeVerification()
  const [showVerification, setShowVerification] = useState(false)

  useEffect(() => {
    // Show verification modal if user is not verified
    if (!isVerified) {
      setShowVerification(true)
    }
  }, [isVerified])

  // If verification modal is showing, render it
  if (showVerification) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Infused Menu</h1>
        <div className="bg-yellow-100 p-4 rounded-lg mb-8">
          <p className="font-medium">Age verification required to view infused products.</p>
        </div>

        <AgeVerificationModal onClose={() => setShowVerification(false)} showIdVerification={true} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Infused Menu</h1>
      <div className="bg-green-100 p-4 rounded-lg mb-8">
        <p className="font-medium">Age verified. You can now browse and purchase infused products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MenuSection
          title="Infused Beverages"
          items={[
            { name: "Chill Lemonade", price: "$18.99", description: "Refreshing lemonade with our special infusion" },
            { name: "Berry Bliss Tea", price: "$16.99", description: "Mixed berry tea with premium infusion" },
            { name: "Tropical Punch", price: "$19.99", description: "Exotic fruit blend with signature infusion" },
          ]}
        />

        <MenuSection
          title="Infused Edibles"
          items={[
            {
              name: "Chocolate Brownies",
              price: "$22.99",
              description: "Rich chocolate brownies with premium infusion",
            },
            { name: "Gourmet Cookies", price: "$20.99", description: "Assorted cookies with our special infusion" },
            { name: "Fruit Gummies", price: "$24.99", description: "Assorted fruit flavors with signature infusion" },
          ]}
        />
      </div>

      <div className="mt-8">
        <Link href="/shop" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Shop All Products
        </Link>
      </div>
    </div>
  )
}

function MenuSection({
  title,
  items,
}: {
  title: string
  items: { name: string; price: string; description: string }[]
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{item.name}</h3>
              <span className="font-medium">{item.price}</span>
            </div>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
