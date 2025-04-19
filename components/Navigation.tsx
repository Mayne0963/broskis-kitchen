"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Settings } from "lucide-react"
import { Cart } from "@/components/Cart"
import { useAgeVerification } from "@/contexts/AgeVerificationContext"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { verificationStatus } = useAgeVerification()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const getStatusIndicator = () => {
    switch (verificationStatus) {
      case "verified":
        return <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
      case "pending":
        return <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
      case "rejected":
        return <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      default:
        return null
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-black shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-2xl z-50">
            Broski's Kitchen
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white hover:text-gold transition-colors relative ${
                  pathname === link.href ? "text-gold" : ""
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold" layoutId="navbar-indicator" />
                )}
              </Link>
            ))}
            <Link href="/settings" className="text-white hover:text-gold transition-colors relative">
              <Settings className="h-5 w-5" />
              {getStatusIndicator()}
            </Link>
            <Cart />
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden space-x-4">
            <Link href="/settings" className="text-white hover:text-gold transition-colors relative">
              <Settings className="h-5 w-5" />
              {getStatusIndicator()}
            </Link>
            <Cart />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none z-50"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center space-y-8">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`text-white text-2xl font-bold hover:text-gold transition-colors ${
                      pathname === link.href ? "text-gold" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
