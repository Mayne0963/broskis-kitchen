import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that require age verification
const AGE_RESTRICTED_PATHS = ["/infused", "/shop/infused"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is age restricted
  const isAgeRestricted = AGE_RESTRICTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  if (isAgeRestricted) {
    // Check if user is age verified
    const isVerified = request.cookies.get("age-verified")?.value === "true"

    if (!isVerified) {
      // Redirect to age verification page with return URL
      const url = new URL("/verify-age", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths that require age verification
    "/infused/:path*",
    "/shop/infused/:path*",
  ],
}
