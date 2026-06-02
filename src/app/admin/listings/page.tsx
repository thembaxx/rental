import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Eye, Check, X, Flag } from "lucide-react"

async function getListings() {
  return prisma.listing.findMany({
    include: {
      lister: { select: { id: true, name: true, email: true } },
      _count: { select: { reports: true, favorites: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export default async function AdminListingsPage() {
  const listings = await getListings()

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Listings Moderation</h1>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Listing</th>
              <th className="text-left p-3 font-medium">Lister</th>
              <th className="text-left p-3 font-medium">Price</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Reports</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing: any) => (
              <tr key={listing.id} className="border-t hover:bg-muted/30">
                <td className="p-3">
                  <div className="font-medium">{listing.title}</div>
                  <div className="text-xs text-muted-foreground">{listing.city}</div>
                </td>
                <td className="p-3">
                  <div className="text-sm">{listing.lister.name || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">{listing.lister.email}</div>
                </td>
                <td className="p-3">{formatPrice(Number(listing.price), listing.priceType)}</td>
                <td className="p-3">
                  <Badge variant={
                    listing.status === "ACTIVE" ? "default" :
                    listing.status === "PENDING" ? "secondary" :
                    listing.status === "FLAGGED" ? "destructive" : "outline"
                  }>
                    {listing.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="p-3">
                  {listing._count.reports > 0 ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <Flag className="w-3 h-3" /> {listing._count.reports}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/listing/${listing.id}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </Link>
                    {listing.status === "PENDING" && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    )}
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
