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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),transparent_40%)]">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden rounded-[2rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-md md:flex flex-col gap-3">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Dashboard</div>
          <Link href="/my-listings">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-2xl px-4 py-3 text-left text-sm">
              <List className="w-4 h-4" /> My Listings
            </Button>
          </Link>
          <Link href="/my-listings/new">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-2xl px-4 py-3 text-left text-sm">
              <Plus className="w-4 h-4" /> New Listing
            </Button>
          </Link>
          <Link href="/inbox">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-2xl px-4 py-3 text-left text-sm">
              <MessageSquare className="w-4 h-4" /> Messages
            </Button>
          </Link>
          <Link href="/favorites">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-2xl px-4 py-3 text-left text-sm">
              <Heart className="w-4 h-4" /> Saved
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-2xl px-4 py-3 text-left text-sm">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-2 rounded-2xl px-4 py-3 text-left text-sm">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm backdrop-blur-md md:hidden">
            <Link href="/my-listings" className="shrink-0">
              <Button variant="outline" size="sm">My Listings</Button>
            </Link>
            <Link href="/my-listings/new" className="shrink-0">
              <Button variant="outline" size="sm">New</Button>
            </Link>
            <Link href="/inbox" className="shrink-0">
              <Button variant="outline" size="sm">Messages</Button>
            </Link>
            <Link href="/favorites" className="shrink-0">
              <Button variant="outline" size="sm">Saved</Button>
            </Link>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}
