"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
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
            <h3 className="footer-title">Broski's Kitchen</h3>
            <p className="text-gray-300 mb-4">
              Bold flavors, badass food. Experience the most outrageous, mouth-watering dishes.
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
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Broski's Kitchen. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
