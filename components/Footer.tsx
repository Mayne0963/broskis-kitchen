"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Instagram, Twitter, Facebook, Mail } from "lucide-react"
import { VerificationStatusIndicator } from "@/components/VerificationStatusIndicator"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-gold/30 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Broski's Kitchen</h3>
            <p className="text-gray-400 mb-4">
              Serving up the most delicious food with the freshest ingredients since 2020.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold"
                whileHover={{ y: -3 }}
              >
                <Instagram />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold"
                whileHover={{ y: -3 }}
              >
                <Twitter />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gold"
                whileHover={{ y: -3 }}
              >
                <Facebook />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-gold transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Hours</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Monday - Thursday: 11am - 10pm</li>
              <li>Friday - Saturday: 11am - 12am</li>
              <li>Sunday: 12pm - 9pm</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>123 Main Street</p>
              <p>Los Angeles, CA 90001</p>
              <p>
                <a href="tel:+13235551234" className="hover:text-gold">
                  (323) 555-1234
                </a>
              </p>
              <p>
                <a href="mailto:info@broskiskitchen.com" className="hover:text-gold flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  info@broskiskitchen.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Broski's Kitchen. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <VerificationStatusIndicator className="text-gray-500" />
          </div>
        </div>
      </div>
    </footer>
  )
}
