import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
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
    <div className="max-w-6xl mx-auto space-y-8">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">My Listings</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">See all the properties you’ve posted, refresh visibility, and manage your portfolio.</p>
          </div>
          <Link href="/my-listings/new">
            <Button className="gap-2"> <Plus className="w-4 h-4" /> New Listing </Button>
          </Link>
        </div>
      </section>

      {listings.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50 p-14 text-center text-slate-600 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">No listings yet</p>
          <p className="mt-2 text-sm">Create your first property and let travelers discover it.</p>
          <div className="mt-6 inline-flex">
            <Link href="/my-listings/new">
              <Button>Create Your First Listing</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-[1.5rem] bg-slate-100 sm:w-40">
                  {listing.images[0] && (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 truncate">{listing.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{listing.city}, {listing.country}</p>
                    </div>
                    <Badge variant={listing.status === "ACTIVE" ? "default" : "secondary"}>
                      {listing.status.toLowerCase()}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{formatPrice(Number(listing.price), listing.priceType)}</span>
                    <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.viewCount} views</span>
                    <span>{listing._count.favorites} saves</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
