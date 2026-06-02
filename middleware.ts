import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export default auth(
  (req: NextRequest & { auth?: { user?: { isAdmin?: boolean; isLister?: boolean } } }) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.isAdmin
  const isLister = req.auth?.user?.isLister

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/search", "/listing"].some((route) =>
    nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isListerRoute = nextUrl.pathname.startsWith("/my-listings")

  if (isApiAuthRoute) return NextResponse.next()

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  if (isListerRoute && !isLister && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
