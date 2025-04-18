"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Clock, Award } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "@/components/PageTransition"
import AnimatedSection from "@/components/AnimatedSection"
import StaggeredItems, { StaggeredItem } from "@/components/StaggeredItems"

export default function Home() {
  return (
    <PageTransition>
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hero-title"
            >
              BOLD FLAVORS, BADASS FOOD
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hero-subtitle"
            >
              Experience the most outrageous, mouth-watering dishes that will blow your mind and satisfy your cravings
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/shop" className="btn-primary">
                  Order Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/menu" className="btn-secondary">
                  View Menu
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title">FEATURED ITEMS</h2>

            <StaggeredItems className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {featuredItems.map((item) => (
                <StaggeredItem key={item.id}>
                  <motion.div whileHover={{ y: -10, transition: { duration: 0.2 } }} className="menu-card">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={400}
                        height={300}
                        className="menu-card-image"
                      />
                      {item.featured && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-bold"
                        >
                          POPULAR
                        </motion.div>
                      )}
                    </div>
                    <div className="menu-card-content">
                      <h3 className="menu-card-title">{item.name}</h3>
                      <p className="menu-card-description">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="menu-card-price">${(item.price / 100).toFixed(2)}</span>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Link
                            href={`/shop/${item.id}`}
                            className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary/90 transition-colors"
                          >
                            Add to Cart
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </StaggeredItem>
              ))}
            </StaggeredItems>

            <div className="text-center mt-12">
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                <Link href="/shop" className="inline-flex items-center text-primary font-bold text-lg hover:underline">
                  View All Menu Items
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Why Choose Us Section */}
        <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="section-title">WHY CHOOSE US</h2>

            <StaggeredItems className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <StaggeredItem>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="text-center p-6 border-2 border-gray-100 rounded-lg hover:border-primary transition-colors"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4"
                  >
                    <Star className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                  <p className="text-gray-600">
                    We use only the freshest ingredients to create our bold, flavorful dishes that will leave you
                    craving more.
                  </p>
                </motion.div>
              </StaggeredItem>

              <StaggeredItem>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="text-center p-6 border-2 border-gray-100 rounded-lg hover:border-primary transition-colors"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4"
                  >
                    <Clock className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">Fast Service</h3>
                  <p className="text-gray-600">
                    Quick preparation and delivery options to satisfy your cravings without the long wait.
                  </p>
                </motion.div>
              </StaggeredItem>

              <StaggeredItem>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="text-center p-6 border-2 border-gray-100 rounded-lg hover:border-primary transition-colors"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4"
                  >
                    <Award className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">Loyalty Rewards</h3>
                  <p className="text-gray-600">
                    Join our loyalty program and earn points with every purchase for exclusive rewards and discounts.
                  </p>
                </motion.div>
              </StaggeredItem>
            </StaggeredItems>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              READY TO EXPERIENCE THE FLAVOR?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-8"
            >
              Order now and discover why our customers keep coming back for more!
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/shop" className="btn-primary">
                Order Online
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>
    </PageTransition>
  )
}

// Sample featured items
const featuredItems = [
  {
    id: "classic-burger",
    name: "Classic Burger",
    description: "Angus beef patty with lettuce, tomato, and special sauce",
    price: 1699,
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    id: "loaded-nachos",
    name: "Loaded Nachos",
    description: "Tortilla chips with cheese, jalapeños, and our signature sauce",
    price: 1299,
    image: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
  {
    id: "chill-lemonade",
    name: "Chill Lemonade",
    description: "Refreshing lemonade with our special infusion",
    price: 1899,
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
]
