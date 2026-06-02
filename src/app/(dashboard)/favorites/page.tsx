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
  return favorites.map((favorite) => favorite.listing)
}

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const listings = await getFavorites(session.user.id)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Saved Listings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">A curated view of the properties you’ve bookmarked for later.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
            <span className="font-semibold text-slate-900">{listings.length}</span> saved listing{listings.length === 1 ? "" : "s"}
          </div>
        </div>
      </section>

      {listings.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50 p-14 text-center text-slate-600 shadow-sm">
          <Heart className="mx-auto mb-4 h-12 w-12 text-sky-500" />
          <p className="text-lg font-semibold">No saved listings yet.</p>
          <p className="mt-2 text-sm text-slate-600">Tap the heart icon on any listing to keep it here for easy access.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
