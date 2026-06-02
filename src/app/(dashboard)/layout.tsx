import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, List, Plus, Settings, Home } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/")

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 hidden md:flex flex-col">
        <div className="p-4 space-y-1">
          <Link href="/my-listings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <List className="w-4 h-4" /> My Listings
            </Button>
          </Link>
          <Link href="/my-listings/new">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" /> New Listing
            </Button>
          </Link>
          <Link href="/inbox">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <MessageSquare className="w-4 h-4" /> Messages
            </Button>
          </Link>
          <Link href="/favorites">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Heart className="w-4 h-4" /> Saved
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
