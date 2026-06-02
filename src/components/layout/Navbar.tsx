"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Menu, Home, Heart, MessageSquare, List, Settings, LogOut } from "lucide-react"
import { useState } from "react"

export function Navbar({ user }: { user?: any }) {
  const { data: session } = useSession()
  const currentUser = session?.user || user
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Home className="w-6 h-6" />
          <span>RentSpace</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/search" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <Search className="w-4 h-4" />
            Search
          </Link>
          {currentUser?.isLister && (
            <Link href="/my-listings" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
              <List className="w-4 h-4" />
              My Listings
            </Link>
          )}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {currentUser.name?.[0] || currentUser.email?.[0] || "?"}
                  </div>
                  <span className="max-w-[120px] truncate">{currentUser.name || currentUser.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="gap-2">
                    <Heart className="w-4 h-4" /> Saved
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/inbox" className="gap-2">
                    <MessageSquare className="w-4 h-4" /> Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-listings" className="gap-2">
                    <List className="w-4 h-4" /> My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="gap-2">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="gap-2 text-red-600">
                  <LogOut className="w-4 h-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn("google")}>Sign In</Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3">
          <Link href="/search" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
            <Search className="w-4 h-4" /> Search
          </Link>
          {currentUser ? (
            <>
              <Link href="/favorites" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                <Heart className="w-4 h-4" /> Saved
              </Link>
              <Link href="/inbox" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                <MessageSquare className="w-4 h-4" /> Messages
              </Link>
              <Link href="/my-listings" className="flex items-center gap-2 py-2" onClick={() => setMobileMenuOpen(false)}>
                <List className="w-4 h-4" /> My Listings
              </Link>
              <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="flex items-center gap-2 py-2 text-red-600 w-full">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </>
          ) : (
            <Button onClick={() => signIn("google")} className="w-full">Sign In with Google</Button>
          )}
        </div>
      )}
    </nav>
  )
}
