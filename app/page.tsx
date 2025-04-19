"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award, Music, FlameIcon as Fire, Utensils } from "lucide-react"
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
              <span className="block text-primary">STREET CULTURE</span>
              <span className="block">GOURMET FLAVOR</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hero-subtitle"
            >
              Experience the fusion of hip-hop culture and culinary excellence with our bold, authentic flavors
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

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute top-0 right-0 w-1/3 h-full pointer-events-none"
            style={{
              backgroundImage: "url('/patterns/urban-pattern.png')",
              backgroundSize: "cover",
              mixBlendMode: "overlay",
            }}
          />
        </section>

        {/* Featured Products Section */}
        <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gold/30 w-16 mr-4"></div>
              <h2 className="text-primary font-graffiti text-xl">Featured Items</h2>
              <div className="h-px bg-gold/30 w-16 ml-4"></div>
            </div>
            <h2 className="section-title">SIGNATURE DISHES</h2>

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
                          className="absolute top-0 right-0 bg-primary text-black px-3 py-1 text-sm font-bold"
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
                            className="bg-primary text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-colors"
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

        {/* Cultural Inspiration Section */}
        <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gold/30 w-16 mr-4"></div>
              <h2 className="text-primary font-graffiti text-xl">Our Story</h2>
              <div className="h-px bg-gold/30 w-16 ml-4"></div>
            </div>
            <h2 className="section-title">CULTURAL INSPIRATION</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center"
              >
                <h3 className="text-3xl font-bold mb-4 text-white">
                  Where <span className="text-primary">Hip-Hop</span> Meets{" "}
                  <span className="text-primary">Culinary Art</span>
                </h3>
                <p className="text-gray-300 mb-6">
                  Broski's Kitchen was born from a passion for both hip-hop culture and exceptional food. Our dishes are
                  inspired by the streets but elevated with gourmet techniques and premium ingredients.
                </p>
                <p className="text-gray-300 mb-6">
                  Each recipe tells a story of cultural heritage, innovation, and the celebration of Black excellence in
                  culinary arts. We're more than a restaurant – we're a movement that honors our roots while pushing
                  boundaries.
                </p>
                <div className="flex items-center">
                  <Music className="h-6 w-6 text-primary mr-2" />
                  <span className="text-primary font-graffiti">Food with a soundtrack</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border-2 border-gold/30 shadow-xl">
                  <Image
                    src="/rhythmic-kitchen.png"
                    alt="Cultural Inspiration"
                    width={600}
                    height={400}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-black p-4 rounded-lg border border-gold/30 shadow-lg">
                  <p className="text-primary font-graffiti text-lg">"Food is our universal language"</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 text-9xl font-graffiti text-white">HIP</div>
            <div className="absolute bottom-10 right-10 text-9xl font-graffiti text-white">HOP</div>
          </div>
        </AnimatedSection>

        {/* Why Choose Us Section */}
        <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gold/30 w-16 mr-4"></div>
              <h2 className="text-primary font-graffiti text-xl">Why Us</h2>
              <div className="h-px bg-gold/30 w-16 ml-4"></div>
            </div>
            <h2 className="section-title">THE BROSKI DIFFERENCE</h2>

            <StaggeredItems className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <StaggeredItem>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.2)" }}
                  className="text-center p-6 border border-gold/20 rounded-lg bg-card"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4"
                  >
                    <Utensils className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                  <p className="text-gray-400">
                    We use only the freshest ingredients to create our bold, flavorful dishes that honor cultural
                    traditions while innovating.
                  </p>
                </motion.div>
              </StaggeredItem>

              <StaggeredItem>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.2)" }}
                  className="text-center p-6 border border-gold/20 rounded-lg bg-card"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4"
                  >
                    <Fire className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">Bold Flavors</h3>
                  <p className="text-gray-400">
                    Our recipes blend street food traditions with gourmet techniques for an unforgettable culinary
                    experience.
                  </p>
                </motion.div>
              </StaggeredItem>

              <StaggeredItem>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.2)" }}
                  className="text-center p-6 border border-gold/20 rounded-lg bg-card"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4"
                  >
                    <Award className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">Cultural Heritage</h3>
                  <p className="text-gray-400">
                    Each dish tells a story, celebrating Black excellence and hip-hop culture through the universal
                    language of food.
                  </p>
                </motion.div>
              </StaggeredItem>
            </StaggeredItems>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-deepRed-dark to-black text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('/patterns/urban-pattern.png')",
              backgroundSize: "cover",
              mixBlendMode: "overlay",
            }}
          ></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              TASTE THE <span className="text-primary">CULTURE</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl mb-8"
            >
              Join us for a culinary experience that celebrates heritage, innovation, and exceptional flavor
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
    id: "gold-standard-burger",
    name: "Gold Standard Burger",
    description: "Premium Angus beef with our signature sauce and gold-dusted brioche bun",
    price: 1899,
    image: "/gilded-grill.png",
    featured: true,
  },
  {
    id: "brooklyn-loaded-fries",
    name: "Brooklyn Loaded Fries",
    description: "Hand-cut fries topped with braised oxtail, cheese sauce, and scallions",
    price: 1499,
    image: "/braised-meat-loaded-fries.png",
    featured: false,
  },
  {
    id: "purple-haze-lemonade",
    name: "Purple Haze Lemonade",
    description: "Lavender-infused lemonade with our special blend of herbs and spices",
    price: 1299,
    image: "/lavender-lemonade-refreshment.png",
    featured: true,
  },
]
