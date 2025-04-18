"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Inter, Bebas_Neue, Permanent_Marker, Teko } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext"
import MusicPlayer from "@/components/MusicPlayer"
import { AgeVerificationProvider } from "@/contexts/AgeVerificationContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { DeliveryProvider } from "@/contexts/DeliveryContext"
import AgeVerificationModal from "@/components/AgeVerificationModal"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebasNeue = Bebas_Neue({ weight: "400", variable: "--font-bebas", subsets: ["latin"] })
const permanentMarker = Permanent_Marker({ weight: "400", variable: "--font-marker", subsets: ["latin"] })
const teko = Teko({ subsets: ["latin"], variable: "--font-teko" })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${permanentMarker.variable} ${teko.variable} font-sans bg-black text-white`}
      >
        <AuthProvider>
          <AgeVerificationProvider>
            <CartProvider>
              <DeliveryProvider>
                <MusicPlayerProvider>
                  <Navigation />
                  <AgeVerificationModal />
                  {children}
                  <Footer />
                  <MusicPlayer />
                </MusicPlayerProvider>
              </DeliveryProvider>
            </CartProvider>
          </AgeVerificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
