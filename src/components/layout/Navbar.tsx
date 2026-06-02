"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Search, Heart, MessageSquare, List, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export function Navbar({ user }: { user?: any }) {
  const { data: session } = useSession()
  const currentUser = session?.user || user
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-secondary text-secondary-foreground shadow-card">
            <span className="text-lg font-semibold">R</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">RentSpace</p>
            <p className="text-sm font-semibold text-foreground">Modern rentals</p>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/search" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-muted">
            Search listings
          </Link>
          {currentUser ? (
            <Button variant="secondary" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          ) : (
            <Button size="sm" onClick={() => signIn("google")}>Sign in</Button>
          )}
        </div>

        <button
          type="button"
          className="sm:hidden rounded-2xl border border-border bg-surface p-3"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open navigation"
        >
          <Search className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-4">
          <div className="space-y-3">
            <Link href="/search" className="block rounded-3xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground">
              Search listings
            </Link>
            {currentUser ? (
              <>
                <Link href="/favorites" className="block rounded-3xl bg-surface px-4 py-3 text-sm font-semibold text-foreground">Saved</Link>
                <Link href="/inbox" className="block rounded-3xl bg-surface px-4 py-3 text-sm font-semibold text-foreground">Messages</Link>
                <button onClick={() => { signOut(); setMobileMenuOpen(false) }} className="w-full rounded-3xl bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground">
                  Sign out
                </button>
              </>
            ) : (
              <Button className="w-full" onClick={() => signIn("google")}>Sign in</Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
