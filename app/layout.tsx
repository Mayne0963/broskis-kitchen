import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { AgeVerificationProvider } from "@/contexts/AgeVerificationContext"
import { DeliveryProvider } from "@/contexts/DeliveryContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Broski's Kitchen",
  description: "Hip-hop luxury infused food brand",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <AgeVerificationProvider>
              <DeliveryProvider>
                <Navigation />
                <main className="min-h-screen p-4">{children}</main>
              </DeliveryProvider>
            </AgeVerificationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
