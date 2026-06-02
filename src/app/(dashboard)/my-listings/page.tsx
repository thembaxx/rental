import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Plus, Eye, RefreshCw, Edit, Trash2 } from "lucide-react"
import { deleteListing, refreshListing } from "@/actions/listings"

async function getMyListings(userId: string) {
  return prisma.listing.findMany({
    where: { listerId: userId },
    include: {
      _count: { select: { favorites: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function MyListingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const listings = await getMyListings(session.user.id)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link href="/my-listings/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Listing
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-muted/30">
          <p className="text-muted-foreground mb-4">You haven't posted any listings yet.</p>
          <Link href="/my-listings/new">
            <Button>Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing: any) => (
            <div key={listing.id} className="border rounded-xl p-4 flex items-start gap-4">
              <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                {listing.images[0] && (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold truncate">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">{listing.city}, {listing.country}</p>
                  </div>
                  <Badge variant={listing.status === "ACTIVE" ? "default" : "secondary"}>
                    {listing.status.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{formatPrice(Number(listing.price), listing.priceType)}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.viewCount} views</span>
                  <span>{listing._count.favorites} saves</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <form action={refreshListing.bind(null, listing.id)}>
                    <Button variant="outline" size="sm" className="gap-1" type="submit">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </Button>
                  </form>
                  <Link href={`/my-listings/${listing.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="w-3 h-3" /> Edit
                    </Button>
                  </Link>
                  <form action={deleteListing.bind(null, listing.id)}>
                    <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700" type="submit">
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
