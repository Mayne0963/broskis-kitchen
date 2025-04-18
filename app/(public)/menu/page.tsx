"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "@/components/PageTransition"
import AnimatedSection from "@/components/AnimatedSection"

export default function MenuPage() {
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gold/30 w-16 mr-4"></div>
            <h2 className="text-primary font-graffiti text-xl">The Menu</h2>
            <div className="h-px bg-gold/30 w-16 ml-4"></div>
          </div>
          <h1 className="text-5xl font-bold mb-4">OUR CULINARY LINEUP</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our selection of bold, flavorful dishes that blend street culture with culinary excellence
          </p>
        </motion.div>

        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <MenuSection
              title="Starters & Sides"
              description="Begin your culinary journey with these street-inspired appetizers"
              items={[
                {
                  name: "Gold Dusted Wings",
                  price: "$16.99",
                  description: "Crispy wings tossed in our signature sauce with edible gold dust",
                  image: "/placeholder.svg?height=100&width=100&query=gold dusted chicken wings",
                  featured: true,
                },
                {
                  name: "Brooklyn Loaded Fries",
                  price: "$14.99",
                  description: "Hand-cut fries topped with braised oxtail, cheese sauce, and scallions",
                  image: "/braised-meat-loaded-fries.png",
                },
                {
                  name: "Harlem Cornbread",
                  price: "$9.99",
                  description: "Jalapeño cornbread with honey butter and gold flakes",
                  image: "/placeholder.svg?height=100&width=100&query=cornbread with honey butter",
                },
              ]}
            />

            <MenuSection
              title="Main Courses"
              description="Signature dishes that tell our cultural story through flavor"
              items={[
                {
                  name: "Gold Standard Burger",
                  price: "$18.99",
                  description: "Premium Angus beef with our signature sauce and gold-dusted brioche bun",
                  image: "/gilded-grill.png",
                  featured: true,
                },
                {
                  name: "Notorious Short Ribs",
                  price: "$24.99",
                  description: "Slow-braised short ribs with bourbon glaze and truffle mash",
                  image: "/placeholder.svg?height=100&width=100&query=braised short ribs with mashed potatoes",
                },
                {
                  name: "Queens Vegan Bowl",
                  price: "$16.99",
                  description: "Seasonal vegetables over ancient grains with our house sauce",
                  image: "/placeholder.svg?height=100&width=100&query=vegan bowl with vegetables and grains",
                },
              ]}
            />
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gold/30 w-16 mr-4"></div>
              <h2 className="text-primary font-graffiti text-xl">Premium Selection</h2>
              <div className="h-px bg-gold/30 w-16 ml-4"></div>
            </div>
            <h2 className="section-title">INFUSED MENU</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-6">
              Explore our specialty infused items with unique flavor profiles (21+ only)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <MenuSection
              title="Infused Beverages"
              description="Refreshing drinks with our special infusion"
              items={[
                {
                  name: "Purple Haze Lemonade",
                  price: "$12.99",
                  description: "Lavender-infused lemonade with our special blend of herbs",
                  image: "/lavender-lemonade-refreshment.png",
                  featured: true,
                },
                {
                  name: "Brooklyn Tea",
                  price: "$14.99",
                  description: "Mixed berry tea with premium infusion and gold flakes",
                  image: "/placeholder.svg?height=100&width=100&query=berry tea with gold flakes",
                },
                {
                  name: "Uptown Punch",
                  price: "$16.99",
                  description: "Exotic fruit blend with signature infusion and fresh herbs",
                  image: "/placeholder.svg?height=100&width=100&query=exotic fruit punch cocktail",
                },
              ]}
            />

            <MenuSection
              title="Infused Edibles"
              description="Delicious treats with our premium infusion"
              items={[
                {
                  name: "24K Brownies",
                  price: "$22.99",
                  description: "Rich chocolate brownies with premium infusion and gold leaf",
                  image: "/placeholder.svg?height=100&width=100&query=chocolate brownies with gold leaf",
                  featured: true,
                },
                {
                  name: "Biggie Cookies",
                  price: "$20.99",
                  description: "Oversized cookies with our special infusion and chocolate chunks",
                  image: "/placeholder.svg?height=100&width=100&query=large chocolate chunk cookies",
                },
                {
                  name: "Harlem Gummies",
                  price: "$24.99",
                  description: "Assorted fruit flavors with signature infusion and sugar coating",
                  image: "/placeholder.svg?height=100&width=100&query=colorful fruit gummies",
                },
              ]}
            />
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-black to-deepRed-dark p-8 rounded-lg text-center border border-gold/30 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "url('/patterns/urban-pattern.png')",
                backgroundSize: "cover",
                mixBlendMode: "overlay",
              }}
            ></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience the Flavor?</h2>
              <p className="text-lg mb-6 text-gray-300">Place your order now for pickup or delivery</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-primary text-black px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </PageTransition>
  )
}

function MenuSection({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: { name: string; price: string; description: string; image: string; featured?: boolean }[]
}) {
  return (
    <div className="bg-card p-6 rounded-lg border border-gold/20">
      <h2 className="text-3xl font-bold mb-2 text-white">{title}</h2>
      <p className="text-gray-400 mb-6">{description}</p>
      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex border-b border-gold/10 pb-6"
          >
            <div className="flex-shrink-0 mr-4">
              <div className="relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover border border-gold/20"
                />
                {item.featured && (
                  <div className="absolute -top-2 -right-2 bg-primary text-black rounded-full p-1">
                    <Star className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span className="font-bold text-primary">{item.price}</span>
              </div>
              <p className="text-gray-400 mt-1">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
