import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function MenuPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">OUR MENU</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our selection of bold, flavorful dishes that will satisfy your cravings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <MenuSection
          title="Appetizers"
          description="Start your meal off right with our delicious appetizers"
          items={[
            {
              name: "Loaded Nachos",
              price: "$12.99",
              description: "Tortilla chips with cheese, jalapeños, and our signature sauce",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Buffalo Wings",
              price: "$14.99",
              description: "Crispy wings tossed in buffalo sauce with blue cheese dip",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Mozzarella Sticks",
              price: "$9.99",
              description: "Golden-fried mozzarella with marinara sauce",
              image: "/placeholder.svg?height=100&width=100",
            },
          ]}
        />

        <MenuSection
          title="Main Courses"
          description="Satisfy your hunger with our hearty main dishes"
          items={[
            {
              name: "Classic Burger",
              price: "$16.99",
              description: "Angus beef patty with lettuce, tomato, and special sauce",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Grilled Chicken Sandwich",
              price: "$15.99",
              description: "Marinated chicken breast with avocado and aioli",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Veggie Bowl",
              price: "$14.99",
              description: "Seasonal vegetables over quinoa with tahini dressing",
              image: "/placeholder.svg?height=100&width=100",
            },
          ]}
        />
      </div>

      <div className="text-center mb-12">
        <h2 className="section-title">INFUSED MENU</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">Explore our specialty infused items (21+ only)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <MenuSection
          title="Infused Beverages"
          description="Refreshing drinks with our special infusion"
          items={[
            {
              name: "Chill Lemonade",
              price: "$18.99",
              description: "Refreshing lemonade with our special infusion",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Berry Bliss Tea",
              price: "$16.99",
              description: "Mixed berry tea with premium infusion",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Tropical Punch",
              price: "$19.99",
              description: "Exotic fruit blend with signature infusion",
              image: "/placeholder.svg?height=100&width=100",
            },
          ]}
        />

        <MenuSection
          title="Infused Edibles"
          description="Delicious treats with our premium infusion"
          items={[
            {
              name: "Chocolate Brownies",
              price: "$22.99",
              description: "Rich chocolate brownies with premium infusion",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Gourmet Cookies",
              price: "$20.99",
              description: "Assorted cookies with our special infusion",
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              name: "Fruit Gummies",
              price: "$24.99",
              description: "Assorted fruit flavors with signature infusion",
              image: "/placeholder.svg?height=100&width=100",
            },
          ]}
        />
      </div>

      <div className="bg-primary/10 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
        <p className="text-lg mb-6">Place your order now for pickup or delivery</p>
        <Link
          href="/shop"
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Shop Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}

function MenuSection({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: { name: string; price: string; description: string; image: string }[]
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex border-b pb-6">
            <div className="flex-shrink-0 mr-4">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span className="font-bold text-primary">{item.price}</span>
              </div>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
