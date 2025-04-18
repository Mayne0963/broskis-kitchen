export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  popular?: boolean
  infused?: boolean
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and our special sauce",
    price: 12.99,
    image: "/images/menu/classic-burger.jpg",
    category: "burgers",
    popular: true,
  },
  {
    id: "2",
    name: "Infused Burger Deluxe",
    description: "Our signature burger infused with special ingredients for an elevated experience",
    price: 18.99,
    image: "/images/menu/infused-burger.jpg",
    category: "burgers",
    infused: true,
  },
  {
    id: "3",
    name: "Chicken Sandwich",
    description: "Crispy fried chicken with pickles and spicy mayo",
    price: 11.99,
    image: "/images/menu/chicken-sandwich.jpg",
    category: "sandwiches",
  },
  {
    id: "4",
    name: "Infused Brownie",
    description: "Rich chocolate brownie with our special infusion",
    price: 9.99,
    image: "/images/menu/infused-brownie.jpg",
    category: "desserts",
    infused: true,
  },
  {
    id: "5",
    name: "French Fries",
    description: "Crispy golden fries with our signature seasoning",
    price: 4.99,
    image: "/images/menu/fries.jpg",
    category: "sides",
    popular: true,
  },
  {
    id: "6",
    name: "Infused Milkshake",
    description: "Creamy milkshake with our special infusion",
    price: 8.99,
    image: "/images/menu/infused-milkshake.jpg",
    category: "drinks",
    infused: true,
  },
  // Continue with other menu items...
]
