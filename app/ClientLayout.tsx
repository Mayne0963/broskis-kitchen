"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { DeliveryProvider } from "@/contexts/DeliveryContext"
import { AgeVerificationProvider } from "@/contexts/AgeVerificationContext"
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import MusicPlayer from "@/components/MusicPlayer/MusicPlayer"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function ClientLayout({
  children,
  fontClasses = "",
}: {
  children: React.ReactNode
  fontClasses?: string
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for resources
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <html lang="en">
      <body className={fontClasses}>
        <AuthProvider>
          <AgeVerificationProvider>
            <CartProvider>
              <DeliveryProvider>
                <MusicPlayerProvider>
                  <div className="flex flex-col min-h-screen">
                    <Navigation />
                    <main className="flex-grow pt-16">{children}</main>
                    <Footer />
                    <MusicPlayer />
                  </div>
                </MusicPlayerProvider>
              </DeliveryProvider>
            </CartProvider>
          </AgeVerificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
