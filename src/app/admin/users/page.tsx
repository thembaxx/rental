import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Shield, X } from "lucide-react"

async function getUsers() {
  return prisma.user.findMany({
    include: {
      _count: { select: { listings: true, reviewsGiven: true, reviewsReceived: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">User</th>
              <th className="text-left p-3 font-medium">Role</th>
              <th className="text-left p-3 font-medium">Listings</th>
              <th className="text-left p-3 font-medium">Reviews</th>
              <th className="text-left p-3 font-medium">Joined</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-t hover:bg-muted/30">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {user.name?.[0] || user.email[0]}
                    </div>
                    <div>
                      <div className="font-medium">{user.name || "Unnamed"}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {user.isAdmin && (
                      <Badge variant="destructive" className="gap-1">
                        <Shield className="w-3 h-3" /> Admin
                      </Badge>
                    )}
                    {user.isLister && (
                      <Badge variant="secondary">Lister</Badge>
                    )}
                    {!user.isLister && !user.isAdmin && (
                      <Badge variant="outline">Seeker</Badge>
                    )}
                  </div>
                </td>
                <td className="p-3">{user._count.listings}</td>
                <td className="p-3">
                  <span className="text-muted-foreground">
                    {user._count.reviewsReceived} received
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {!user.isAdmin && (
                      <Button variant="ghost" size="sm">
                        <Shield className="w-3 h-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
