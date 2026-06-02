import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  (req) => {
    const { nextUrl } = req
    const pathname = nextUrl.pathname
    const token = (req as any).nextauth?.token
    const isLoggedIn = !!token
    const isAdmin = token?.isAdmin
    const isLister = token?.isLister

    const isApiAuthRoute = pathname.startsWith("/api/auth")
    const isPublicRoute = ["/", "/search", "/listing"].some((route) =>
      pathname.startsWith(route)
    )
    const isAdminRoute = pathname.startsWith("/admin")
    const isListerRoute = pathname.startsWith("/my-listings")

    if (isApiAuthRoute) return NextResponse.next()

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (isListerRoute && !isLister && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
