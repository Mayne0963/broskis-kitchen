import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to Broski&apos;s Kitchen</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <NavCard href="/menu" title="Menu" description="Check out our delicious offerings" />
        <NavCard href="/shop" title="Shop" description="Order food for delivery or pickup" />
        <NavCard href="/infused" title="Infused Menu" description="Explore our specialty infused items" />
        <NavCard href="/calendar" title="Events" description="See our upcoming events" />
        <NavCard href="/testimonials" title="Testimonials" description="What our customers say" />
        <NavCard href="/volunteer" title="Volunteer" description="Join our community efforts" />
      </div>
    </div>
  )
}

function NavCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="block">
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
