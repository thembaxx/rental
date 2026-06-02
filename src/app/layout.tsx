import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { auth } from "@/lib/auth"
import { SessionWrapper } from "@/components/SessionWrapper"

export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RentSpace - Find Your Perfect Place",
  description: "Discover apartments, houses, rooms, and more for rent. No fees, direct contact with landlords.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper session={session}>
          <div className="min-h-screen flex flex-col">
            <Navbar user={session?.user} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionWrapper>
      </body>
    </html>
  )
}
