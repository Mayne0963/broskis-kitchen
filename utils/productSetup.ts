import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  requiresAgeVerification: boolean
}

export const sampleProducts: Product[] = [
  {
    id: "classic-burger",
    name: "Classic Burger",
    description: "Angus beef patty with lettuce, tomato, and special sauce",
    price: 1699, // in cents
    image: "/placeholder.svg?height=300&width=300",
    category: "main",
    featured: true,
    requiresAgeVerification: false,
  },
  {
    id: "loaded-nachos",
    name: "Loaded Nachos",
    description: "Tortilla chips with cheese, jalapeños, and our signature sauce",
    price: 1299,
    image: "/placeholder.svg?height=300&width=300",
    category: "appetizer",
    featured: true,
    requiresAgeVerification: false,
  },
  {
    id: "buffalo-wings",
    name: "Buffalo Wings",
    description: "Crispy wings tossed in buffalo sauce with blue cheese dip",
    price: 1499,
    image: "/placeholder.svg?height=300&width=300",
    category: "appetizer",
    featured: false,
    requiresAgeVerification: false,
  },
  {
    id: "chill-lemonade",
    name: "Chill Lemonade",
    description: "Refreshing lemonade with our special infusion",
    price: 1899,
    image: "/placeholder.svg?height=300&width=300",
    category: "infused",
    featured: true,
    requiresAgeVerification: true,
  },
  {
    id: "chocolate-brownies",
    name: "Chocolate Brownies",
    description: "Rich chocolate brownies with premium infusion",
    price: 2299,
    image: "/placeholder.svg?height=300&width=300",
    category: "infused",
    featured: false,
    requiresAgeVerification: true,
  },
]

export const setupProducts = async () => {
  try {
    const productsCollection = collection(db, "products")

    for (const product of sampleProducts) {
      await setDoc(doc(productsCollection, product.id), product)
    }

    console.log("Sample products have been added to Firestore")
  } catch (error) {
    console.error("Error setting up products:", error)
  }
}
