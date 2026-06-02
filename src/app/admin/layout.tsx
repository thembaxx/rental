import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Users, List, Flag, BarChart3 } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.isAdmin) redirect("/")

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className="w-64 border-r bg-muted/30 hidden md:flex flex-col">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold">Admin Panel</span>
          </div>
          <div className="space-y-1">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <BarChart3 className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
            <Link href="/admin/listings">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <List className="w-4 h-4" /> Listings
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="w-4 h-4" /> Users
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Flag className="w-4 h-4" /> Reports
              </Button>
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
