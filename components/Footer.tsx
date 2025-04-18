"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Music, Headphones } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

export default function Footer() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="footer"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image src="/logo.png" alt="Broski's Kitchen Logo" width={60} height={60} className="mr-3" />
              <div>
                <span className="text-3xl font-display font-bold text-primary block leading-none">Broski&apos;s</span>
                <span className="text-xl font-graffiti text-white">Kitchen</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Urban flavors, street-inspired cuisine with an upscale twist. Experience the culture through every bite.
            </p>
            <div className="flex mt-4">
              <motion.a
                whileHover={{ y: -5, backgroundColor: "hsl(var(--primary))" }}
                href="#"
                className="social-icon"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -5, backgroundColor: "hsl(var(--primary))" }}
                href="#"
                className="social-icon"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -5, backgroundColor: "hsl(var(--primary))" }}
                href="#"
                className="social-icon"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ y: -5, backgroundColor: "hsl(var(--primary))" }}
                href="#"
                className="social-icon"
                aria-label="Music"
              >
                <Music className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Quick Links</h3>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/menu" className="footer-link">
                Menu
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/shop" className="footer-link">
                Shop
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/infused" className="footer-link">
                Infused
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/calendar" className="footer-link">
                Events
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/loyalty" className="footer-link">
                Loyalty Program
              </Link>
            </motion.div>
          </div>

          <div>
            <h3 className="footer-title">Information</h3>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/about" className="footer-link">
                About Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/contact" className="footer-link">
                Contact Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/faq" className="footer-link">
                FAQ
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 5 }}>
              <Link href="/terms" className="footer-link">
                Terms of Service
              </Link>
            </motion.div>
          </div>

          <div>
            <h3 className="footer-title">Contact Us</h3>
            <p className="text-gray-300 mb-2">123 Main Street</p>
            <p className="text-gray-300 mb-2">New York, NY 10001</p>
            <p className="text-gray-300 mb-2">Phone: (555) 123-4567</p>
            <p className="text-gray-300 mb-2">Email: info@broskiskitchen.com</p>

            <div className="mt-6 bg-muted p-4 rounded-lg border border-gold/20">
              <h4 className="text-primary font-bold mb-2 flex items-center">
                <Headphones className="mr-2 h-5 w-5" /> Playlist of the Month
              </h4>
              <p className="text-sm text-gray-400">
                Scan the QR code in store to listen to our curated playlist while you dine.
              </p>
            </div>
          </div>
        </div>

        <div className="urban-divider my-8"></div>

        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Broski's Kitchen. All rights reserved.</p>
          <p className="mt-2 text-xs">
            <span className="text-primary font-graffiti text-sm mr-1">Elevating</span> street food culture since 2020
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
