"use client"

import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { AgeVerificationProvider } from "@/contexts/AgeVerificationContext"
import { DeliveryProvider } from "@/contexts/DeliveryContext"
import { AnimatePresence } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <AgeVerificationProvider>
              <DeliveryProvider>
                <div className="flex flex-col min-h-screen">
                  <Navigation />
                  <main className="flex-grow">
                    <AnimatePresence mode="wait">{children}</AnimatePresence>
                  </main>
                  <Footer />
                </div>
              </DeliveryProvider>
            </AgeVerificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
