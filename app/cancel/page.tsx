import Link from "next/link"

export default function Cancel() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">Your payment was cancelled. No charges were made to your account.</p>

        <div className="space-x-4">
          <Link href="/checkout" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Return to Checkout
          </Link>
          <Link href="/shop" className="inline-block px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
