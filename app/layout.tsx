import type React from "react"
import type { Metadata } from "next"
import { Bebas_Neue, Permanent_Marker, Teko, Poppins } from "next/font/google"
import ClientLayout from "./ClientLayout"
import "./globals.css"

// Load fonts with display: swap to prevent FOIT (Flash of Invisible Text)
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
})

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
})

const teko = Teko({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-teko",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Broski's Kitchen",
  description: "Delicious food with a hip-hop vibe",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout
      fontClasses={`${poppins.variable} ${bebasNeue.variable} ${permanentMarker.variable} ${teko.variable}`}
    >
      {children}
    </ClientLayout>
  )
}
