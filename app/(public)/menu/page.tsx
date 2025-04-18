export default function MenuPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MenuSection
          title="Appetizers"
          items={[
            {
              name: "Loaded Nachos",
              price: "$12.99",
              description: "Tortilla chips with cheese, jalapeños, and our signature sauce",
            },
            {
              name: "Buffalo Wings",
              price: "$14.99",
              description: "Crispy wings tossed in buffalo sauce with blue cheese dip",
            },
            { name: "Mozzarella Sticks", price: "$9.99", description: "Golden-fried mozzarella with marinara sauce" },
          ]}
        />

        <MenuSection
          title="Main Courses"
          items={[
            {
              name: "Classic Burger",
              price: "$16.99",
              description: "Angus beef patty with lettuce, tomato, and special sauce",
            },
            {
              name: "Grilled Chicken Sandwich",
              price: "$15.99",
              description: "Marinated chicken breast with avocado and aioli",
            },
            {
              name: "Veggie Bowl",
              price: "$14.99",
              description: "Seasonal vegetables over quinoa with tahini dressing",
            },
          ]}
        />
      </div>
    </div>
  )
}

function MenuSection({
  title,
  items,
}: {
  title: string
  items: { name: string; price: string; description: string }[]
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex justify-between">
              <h3 className="font-medium">{item.name}</h3>
              <span className="font-medium">{item.price}</span>
            </div>
            <p className="text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
