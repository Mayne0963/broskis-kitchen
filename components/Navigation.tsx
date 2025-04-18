"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import CartIcon from "./CartIcon"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path ? "active font-bold" : ""
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="text-3xl font-display font-bold text-primary">
              Broski&apos;s Kitchen
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="text-secondary hover:text-primary focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-6"
          >
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/menu" className={`nav-link ${isActive("/menu")}`}>
                Menu
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/shop" className={`nav-link ${isActive("/shop")}`}>
                Shop
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/infused" className={`nav-link ${isActive("/infused")}`}>
                Infused
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/calendar" className={`nav-link ${isActive("/calendar")}`}>
                Events
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/loyalty" className={`nav-link ${isActive("/loyalty")}`}>
                Loyalty
              </Link>
            </motion.div>

            {user ? (
              <>
                <motion.div whileHover={{ y: -2 }}>
                  <Link href="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <button onClick={() => signOut()} className="nav-link hover:text-primary">
                    Sign Out
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ y: -2 }}>
                  <Link href="/login" className={`nav-link ${isActive("/login")}`}>
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}

            <CartIcon />
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 py-4 border-t border-gray-200 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col space-y-4"
              >
                <Link href="/menu" className={`nav-link ${isActive("/menu")}`} onClick={() => setMobileMenuOpen(false)}>
                  Menu
                </Link>
                <Link href="/shop" className={`nav-link ${isActive("/shop")}`} onClick={() => setMobileMenuOpen(false)}>
                  Shop
                </Link>
                <Link
                  href="/infused"
                  className={`nav-link ${isActive("/infused")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Infused
                </Link>
                <Link
                  href="/calendar"
                  className={`nav-link ${isActive("/calendar")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  href="/loyalty"
                  className={`nav-link ${isActive("/loyalty")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Loyalty
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`nav-link ${isActive("/dashboard")}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setMobileMenuOpen(false)
                      }}
                      className="nav-link hover:text-primary text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`nav-link ${isActive("/login")}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}

                <div className="pt-2">
                  <CartIcon />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
