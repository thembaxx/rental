import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ListingCard } from "@/components/listings/ListingCard"
import { Heart } from "lucide-react"

async function getFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      listing: {
        include: {
          lister: { select: { id: true, name: true, image: true } },
          _count: { select: { reviews: true, favorites: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return favorites.map((f: { listing: any }) => f.listing)
}

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const listings = await getFavorites(session.user.id)

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Saved Listings</h1>

      {listings.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-muted/30">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No saved listings yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the heart icon on any listing to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
