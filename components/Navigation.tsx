"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import CartIcon from "./CartIcon"

export default function Navigation() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isActive = (path: string) => {
    return pathname === path ? "font-bold" : ""
  }

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-4 sm:mb-0">
          Broski&apos;s Kitchen
        </Link>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Link href="/menu" className={`${isActive("/menu")} hover:text-gray-600`}>
            Menu
          </Link>
          <Link href="/shop" className={`${isActive("/shop")} hover:text-gray-600`}>
            Shop
          </Link>
          <Link href="/infused" className={`${isActive("/infused")} hover:text-gray-600`}>
            Infused
          </Link>
          <Link href="/calendar" className={`${isActive("/calendar")} hover:text-gray-600`}>
            Events
          </Link>
          <Link href="/loyalty" className={`${isActive("/loyalty")} hover:text-gray-600`}>
            Loyalty
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className={`${isActive("/dashboard")} hover:text-gray-600`}>
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="hover:text-gray-600">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`${isActive("/login")} hover:text-gray-600`}>
                Sign In
              </Link>
              <Link href="/register" className={`${isActive("/register")} hover:text-gray-600`}>
                Sign Up
              </Link>
            </>
          )}

          <CartIcon />
        </div>
      </div>
    </nav>
  )
}
