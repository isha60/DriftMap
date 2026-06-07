import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
)

// Routes that require the user to be logged in
const PROTECTED_ROUTES = ["/dashboard"]

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = ["/login", "/signup"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("driftmap_token")?.value

  // Verify the token
  let isValidToken = false
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isValidToken = true
    } catch {
      isValidToken = false
    }
  }

  // If trying to access a protected route without a valid token → redirect to login
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  if (isProtected && !isValidToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If already logged in and trying to visit login/signup or landing page → redirect to dashboard
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route)) || pathname === "/"
  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
}
